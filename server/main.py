import os
from dotenv import load_dotenv
from fastapi import FastAPI
from twilio_server import TwilioClient
from pydantic import BaseModel

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
    twilio_client.register_phone_agent("+18339501419", os.environ['RETELL_AGENT_ID'])
    twilio_client.create_phone_call("+18339501419", message.phone, os.environ['RETELL_AGENT_ID'])
    
    # manager.twilio_client.create_phone_call(TWILIO_NUMBER, message.phone, RETELL_AGENT_ID)
    
    return {"message": message.phone}

