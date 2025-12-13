import cv2
import os
import pickle
import time
import numpy as np
from face_functions import img_to_encoding

def test_face_recognition():
    print("Testing face recognition only...")
    
    # Check if face database exists
    if not os.path.exists('face_database/embeddings.pickle'):
        print("No face database found. Run add_user.py first.")
        return
    
    # Load face database
    database = pickle.load(open('face_database/embeddings.pickle', "rb"))
    print(f"Found {len(database)} users in database: {list(database.keys())}")
    
    # Initialize camera
    cap = cv2.VideoCapture(0)
    cap.set(3, 640)
    cap.set(4, 480)
    
    cascade = cv2.CascadeClassifier('./haarcascades/haarcascade_frontalface_default.xml')
    
    print("Keep your face in front of the camera. Press 'q' to quit.")
    
    while True:
        _, frame = cap.read()
        frame = cv2.flip(frame, 1, 0)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        faces = cascade.detectMultiScale(gray, 1.3, 5)
        
        for (x, y, w, h) in faces:
            roi = frame[y-10:y+h+10, x-10:x+w+10]
            
            fh, fw = roi.shape[:2]
            if fh < 20 or fw < 20:
                continue
                
            # Draw rectangle around face
            cv2.rectangle(frame, (x-10, y-10), (x+w+10, y+h+10), (0, 255, 0), 2)
            
            # Resize and get encoding
            img = cv2.resize(roi, (96, 96))
            encoding = img_to_encoding(img)
            
            # Find best match
            min_dist = 100
            name = 'Unknown'
            
            for known_name in database:
                dist = np.linalg.norm(np.subtract(database[known_name], encoding))
                if dist < min_dist:
                    min_dist = dist
                    name = known_name
            
            # Display result
            if min_dist <= 0.4:
                cv2.putText(frame, f"{name} ({min_dist:.2f})", (x, y-15), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            else:
                cv2.putText(frame, f"Unknown ({min_dist:.2f})", (x, y-15), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        
        cv2.imshow('Face Recognition Test', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    test_face_recognition()