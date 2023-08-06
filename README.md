# Python Security System

This repo implements a python security system that uses OpenCV and a basic person detection model to record and save video. It features the following:

- Person Detection
- Video Storage (Google Cloud Object Storage)
- Text Notifications
- Arming & Disarming The System
- Activity Logs

## Installation

Before starting make sure you have the following installed:

- Python 3.9+
- Node.js
- ffmpeg

Install the python dependencies by running: `pip install -r requirements.txt` from the root directory.

Next, `cd frontend && npm install`

## Running The Backend

To run the backend simply run the `main.py` file with `cd backend && python main.py`.

## Running The Frontend

To run the frontend simply run `npm start` from `/frontend`.

