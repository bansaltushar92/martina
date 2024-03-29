from typing import Dict
import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from fastapi.websockets import WebSocketState
# from llm import LlmClient
from llm_with_func_calling import LlmClient
from twilio_server import TwilioClient
from retellclient.models import operations
from twilio.twiml.voice_response import VoiceResponse

load_dotenv()

from supabase.client import Client, create_client
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_community.docstore.document import Document

supabase: Client = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_API_KEY'])
embeddings = OpenAIEmbeddings()

app = FastAPI()

llm_client = LlmClient()
twilio_client = TwilioClient()

print("Here is the retell key: ", os.environ['RETELL_AGENT_ID'])

USER_ID = None
CALL_CONTEXT = None
CAMPAIGN_ID = None
CALL_ID = None


# Dictionary to hold multiple WebSocket connections
# connections: Dict[str, WebSocket] = {}


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
            
manager = ConnectionManager()

# twilio_client.create_phone_number(213, os.environ['RETELL_AGENT_ID'])
# twilio_client.register_phone_agent("+18339501419", os.environ['RETELL_AGENT_ID'])
# twilio_client.delete_phone_number("+12133548310")
# twilio_client.create_phone_call("+18339501419", "+18587293302", os.environ['RETELL_AGENT_ID'])

@app.post("/twilio-voice-webhook/{agent_id_path}")
async def handle_twilio_voice_webhook(request: Request, agent_id_path: str):
    try:
        # Check if it is machine
        post_data = await request.form()
        if 'AnsweredBy' in post_data and post_data['AnsweredBy'] == "machine_start":
            twilio_client.end_call(post_data['CallSid'])
            return PlainTextResponse("")

        call_response = twilio_client.retell.register_call(operations.RegisterCallRequestBody(
            agent_id=agent_id_path, 
            audio_websocket_protocol="twilio", 
            audio_encoding="mulaw", 
            sample_rate=8000
        ))
        if call_response.call_detail:
            response = VoiceResponse()
            start = response.connect()
            start.stream(url=f"wss://api.retellai.com/audio-websocket/{call_response.call_detail.call_id}")
            print("i am here: ", str(response))
            try:
                manager.broadcast(str(response))
            except WebSocketDisconnect:
                manager.disconnect()
            return PlainTextResponse(str(response), media_type='text/xml')
        
    except Exception as err:
        print(f"Error in twilio voice webhook: {err}")
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})

@app.websocket("/llm-websocket/{call_id}")
async def websocket_handler(websocket: WebSocket, call_id: str):
    global manager
    global USER_ID
    await websocket.accept()
    print(f"Handle llm ws for: {call_id}")

    # send first message to signal ready of server
    response_id = 0
    first_event = llm_client.draft_begin_messsage()
    await websocket.send_text(json.dumps(first_event))

    try:
        while True:
            message = await websocket.receive_text()
            request = json.loads(message)
            # print out transcript
            os.system('cls' if os.name == 'nt' else 'clear')
            print(json.dumps(request, indent=4))
            await manager.broadcast(json.dumps(request, indent=4))

            if 'response_id' not in request:
                continue # no response needed, process live transcript update if needed

            if request['response_id'] > response_id:
                response_id = request['response_id']
            for event in llm_client.draft_response(request):
                await websocket.send_text(json.dumps(event))
                if request['response_id'] < response_id:
                    continue # new response needed, abondon this one    
    except Exception as e:
        print(f'LLM WebSocket error for {call_id}: {e}')
        transcript = {'transcript': json.dumps(str(request), indent=4)}
        document = Document(page_content=json.dumps(transcript),metadata={'cust_id': USER_ID, 'call_context': CALL_CONTEXT, 'campaign_id': CAMPAIGN_ID, 'call_id': CALL_ID})
        try:
            vector_store = SupabaseVectorStore.from_documents([document],embedding=embeddings, client=supabase, table_name="documents", query_name="match_documents")
            print("This is the vector store: ", vector_store)
        except Exception as err:
            print("This is the document: ", document)
            print("This is the error: ", err)
        print("Final Transcript: ", json.dumps(request, indent=4))
        
        await websocket.close(1002, e)
    finally:
        try:
            await websocket.close(1000, "Closing as requested.")
        except RuntimeError as e:
            print(f"Websocket already closed for {call_id}")
        print(f"Closing llm ws for: {call_id}")
        
async def trial():
    global manager
    print("check here trial: ", manager.active_connections)
    await manager.broadcast(f"Message trial")

@app.websocket("/martina-ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection open
            data = await websocket.receive_text()
            # You can also send data back to the client if needed
            await manager.broadcast(f"Message text: {data}")
    except WebSocketDisconnect:
        print("Websocket is disconnected.")
        manager.disconnect(websocket)
        
        
html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://0.0.0.0:8080/martina-ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    global manager
    return HTMLResponse(html)

@app.get("/trial")
async def get():
    await trial()
    return {"status": "done"}

RETELL_AGENT_ID="e4ecf0aa3c82e91d06538d60168d9649"
TWILIO_NUMBER = "+18339501419"

from pydantic import BaseModel
class Message(BaseModel):
    phone: str
    cust_id: int
    call_id: int
    campaign_id: int
    call_context: str
    

@app.post("/call")
async def call(message: Message):
    global USER_ID
    global CALL_CONTEXT
    global CAMPAIGN_ID
    global CALL_ID
    USER_ID = message.cust_id
    CALL_CONTEXT = message.call_context
    CAMPAIGN_ID = message.campaign_id
    CALL_ID = message.call_id
    twilio_client = TwilioClient()
    twilio_client.register_phone_agent("+18339501419", os.environ['RETELL_AGENT_ID'])
    twilio_client.create_phone_call("+18339501419", message.phone, os.environ['RETELL_AGENT_ID'])
    
    # manager.twilio_client.create_phone_call(TWILIO_NUMBER, message.phone, RETELL_AGENT_ID)
    
    return {"message": message.phone}
