import cv2 as cv
import numpy as np
import threading
import datetime
from storage import handle_detection

class Camera:
    net = cv.dnn.readNetFromCaffe('models/config.txt', 'models/mobilenet_iter_73000.caffemodel')
    cap = cv.VideoCapture(0)
    out = None

    def __init__(self):
        self.armed = False
        self.camera_thread = None
    
    def arm(self):
        if not self.armed and not self.camera_thread:
            self.camera_thread = threading.Thread(target=self.run)
        
        self.camera_thread.start()
        self.armed = True
        print("Camera armed.")

    def disarm(self):
        self.armed = False
        self.camera_thread = None
        print("Camera disarmed.")

    def run(self):
        person_detected = False
        non_detected_counter = 0
        current_recording_name = None

        Camera.cap = cv.VideoCapture(0)

        print("Camera started...")
        while self.armed:
            _, frame = self.cap.read()
            blob = cv.dnn.blobFromImage(frame, 0.007843, (300, 300), 127.5)
            self.net.setInput(blob)
            detections = self.net.forward()
            person_detected = False

            for i in range(detections.shape[2]):
                # Extract the confidence
                confidence = detections[0, 0, i, 2]

                # Get the label for the class number and set its color
                idx = int(detections[0, 0, i, 1])

                # Check if the detection is of a person and its confidence is greater than the minimum confidence
                if idx == 15 and confidence > 0.5:
                    box = detections[0, 0, i, 3:7] * np.array([frame.shape[1], frame.shape[0], frame.shape[1], frame.shape[0]])
                    (startX, startY, endX, endY) = box.astype("int")
                    cv.rectangle(frame, (startX, startY), (endX, endY), (0, 255, 0), 2)
                    person_detected = True

            # If a person is detected, start/continue recording
            if person_detected:
                non_detected_counter = 0  # reset the counter
                if self.out is None:  # if VideoWriter isn't initialized, initialize it
                    now = datetime.datetime.now()
                    formatted_now = now.strftime("%d-%m-%y-%H-%M-%S")
                    print("Person motion detected at", formatted_now)
                    current_recording_name = f'{formatted_now}.mp4'
                    fourcc = cv.VideoWriter_fourcc(*'mp4v')  # or use 'XVID'
                    self.out = cv.VideoWriter(current_recording_name, fourcc, 20.0, (frame.shape[1], frame.shape[0]))

                # Write the frame into the file 'output.mp4'
                self.out.write(frame)

            # If no person is detected, stop recording after 50 frames
            else:
                non_detected_counter += 1  # increment the counter
                if non_detected_counter >= 50:  # if 50 frames have passed without a detection
                    if self.out is not None:  # if VideoWriter is initialized, release it
                        self.out.release()
                        self.out = None  # set it back to None
                        handle_detection(current_recording_name)
                        current_recording_name = None
                        
        if self.out is not None:  # if VideoWriter is initialized, release it
            self.out.release()
            self.out = None  # set it back to None
            handle_detection(current_recording_name)
            current_recording_name = None
            
        self.cap.release()
        print("Camera released...")

    def __del__(self):
        self.cap.release()
        if self.out is not None:
            self.out.release()

