from twilio.rest import Client
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")

SENDER = os.getenv("TWILIO_SEND_NUMBER")
RECEIVER = os.getenv("TWILIO_RECEIVE_NUMBER")

client = Client(ACCOUNT_SID, AUTH_TOKEN)

def send_notification(url):
    now = datetime.now()
    formatted_now = now.strftime("%d/%m/%y %H:%M:%S")
    client.messages.create(
        body=f"Person motion detected @{formatted_now}: {url}",
        from_=SENDER,  # Your Twilio phone number
        to=RECEIVER     # Recipient phone number
    )