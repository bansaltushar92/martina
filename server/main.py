import os
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from twilio_server import TwilioClient
from pydantic import BaseModel
from server import ConnectionManager, manager, trial

load_dotenv()

app = FastAPI()

RETELL_AGENT_ID="e4ecf0aa3c82e91d06538d60168d9649"
TWILIO_NUMBER = "+18339501419"

class Message(BaseModel):
    phone: str

# class TwilioManager:
#     def __init__(self):
#         self.twilio_client = TwilioClient()
#         # self.phone_number = self.twilio_client.create_phone_number(213, RETELL_AGENT_ID)
#         self.twilio_client.register_phone_agent(TWILIO_NUMBER, RETELL_AGENT_ID)
        

# manager = TwilioManager()


@app.post("/call")
async def call(message: Message):

    twilio_client = TwilioClient()
    twilio_client.register_phone_agent(TWILIO_NUMBER, os.environ['RETELL_AGENT_ID'])
    twilio_client.create_phone_call(TWILIO_NUMBER, message.phone, os.environ['RETELL_AGENT_ID'])
    
    # manager.twilio_client.create_phone_call(TWILIO_NUMBER, message.phone, RETELL_AGENT_ID)
    
    return {"message": message.phone}


# @app.websocket("/martina-ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await manager.connect(websocket)
#     try:
#         while True:
#             # Keep the connection open
#             data = await websocket.receive_text()
#             # You can also send data back to the client if needed
#             await manager.broadcast(f"Message text: {data}")
#     except WebSocketDisconnect:
#         print("Websocket is disconnected.")
#         manager.disconnect(websocket)
        
        
# html = """
# <!DOCTYPE html>
# <html>
#     <head>
#         <title>Chat</title>
#     </head>
#     <body>
#         <h1>WebSocket Chat</h1>
#         <form action="" onsubmit="sendMessage(event)">
#             <input type="text" id="messageText" autocomplete="off"/>
#             <button>Send</button>
#         </form>
#         <ul id='messages'>
#         </ul>
#         <script>
#             var ws = new WebSocket("ws://0.0.0.0:8000/martina-ws");
#             ws.onmessage = function(event) {
#                 var messages = document.getElementById('messages')
#                 var message = document.createElement('li')
#                 var content = document.createTextNode(event.data)
#                 message.appendChild(content)
#                 messages.appendChild(message)
#             };
#             function sendMessage(event) {
#                 var input = document.getElementById("messageText")
#                 ws.send(input.value)
#                 input.value = ''
#                 event.preventDefault()
#             }
#         </script>
#     </body>
# </html>
# """


# @app.get("/")
# async def get():
#     global manager
#     return HTMLResponse(html)

# @app.get("/trial")
# async def get():
#     await trial()
#     return {"status": "done"}