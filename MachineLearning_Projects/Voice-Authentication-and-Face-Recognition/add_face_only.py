import cv2
import os
import pickle
import time
from face_functions import img_to_encoding

def add_face_only():
    name = input("Enter your name: ")
    
    # Check for existing database
    if os.path.exists('./face_database/embeddings.pickle'):
        with open('./face_database/embeddings.pickle', 'rb') as database:
            db = pickle.load(database)   
            
            if name in db or name == 'unknown':
                print("Name already exists! Try another name...")
                return
    else:
        # Create new database
        db = {}
    
    cap = cv2.VideoCapture(0)
    cap.set(3, 640)
    cap.set(4, 480)
    
    # Face detection
    face_cascade = cv2.CascadeClassifier('./haarcascades/haarcascade_frontalface_default.xml')
    
    print("Position your face in front of the camera...")
    
    # Countdown
    for i in range(3, 0, -1):
        _, frame = cap.read()
        frame = cv2.flip(frame, 1, 0)
        
        cv2.putText(frame, f'Starting in {i}', (200, 300), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow('Add Face', frame)
        cv2.waitKey(1000)
    
    # Capture face
    start_time = time.time()
    face_found = False
    
    while time.time() - start_time < 3:
        _, frame = cap.read()
        frame = cv2.flip(frame, 1, 0)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 1:
            x, y, w, h = faces[0]
            roi = frame[y-10:y+h+10, x-10:x+w+10]
            
            fh, fw = roi.shape[:2]
            if fh >= 20 and fw >= 20:
                face_found = True
                cv2.rectangle(frame, (x-10, y-10), (x+w+10, y+h+10), (0, 255, 0), 2)
                cv2.putText(frame, 'Face captured!', (x, y-20), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        cv2.imshow('Add Face', frame)
        cv2.waitKey(1)
    
    cap.release()
    cv2.destroyAllWindows()
    
    if face_found:
        # Process and save face
        img = cv2.resize(roi, (96, 96))
        encoding = img_to_encoding(img)
        
        db[name] = encoding
        
        with open('./face_database/embeddings.pickle', "wb") as database:
            pickle.dump(db, database, protocol=pickle.HIGHEST_PROTOCOL)
        
        print(f"Face for '{name}' added successfully!")
        print("You can now test face recognition with test_face_only.py")
        
    else:
        print("No face detected. Try again with better lighting.")

if __name__ == '__main__':
    add_face_only()