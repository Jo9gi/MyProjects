import cv2
import os
import pickle
import time
import numpy as np
from face_functions import img_to_encoding
from voice_functions import record_audio, extract_features

def full_recognition():
    print("=== DUAL-FACTOR BIOMETRIC AUTHENTICATION ===")
    
    # Check databases
    if not os.path.exists('face_database/embeddings.pickle'):
        print("No face database found!")
        return
    
    if not os.path.exists('gmm_models'):
        print("No voice models found!")
        return
    
    # Load face database
    face_db = pickle.load(open('face_database/embeddings.pickle', "rb"))
    print(f"Face database: {list(face_db.keys())}")
    
    # Load voice models
    gmm_files = [f for f in os.listdir('gmm_models') if f.endswith('.gmm')]
    if not gmm_files:
        print("No voice models found!")
        return
    
    voice_models = {}
    for gmm_file in gmm_files:
        name = gmm_file.replace('.gmm', '')
        with open(f'gmm_models/{gmm_file}', 'rb') as f:
            voice_models[name] = pickle.load(f)
    
    print(f"Voice database: {list(voice_models.keys())}")
    
    # STEP 1: Voice Authentication
    print("\n--- STEP 1: VOICE AUTHENTICATION ---")
    input("Press Enter when ready to speak your name...")
    
    # Record voice
    audio_data, sample_rate = record_audio(duration=3)
    
    # Extract features
    vector = extract_features(audio_data, sample_rate)
    
    # Test against all voice models
    best_voice_score = -np.inf
    voice_identity = 'unknown'
    
    for name, model in voice_models.items():
        try:
            scores = model.score_samples(vector)
            avg_score = np.mean(scores)
            print(f"Voice match for {name}: {avg_score:.2f}")
            
            if avg_score > best_voice_score:
                best_voice_score = avg_score
                voice_identity = name
        except:
            continue
    
    print(f"Voice recognized as: {voice_identity}")
    
    if voice_identity == 'unknown':
        print("❌ VOICE AUTHENTICATION FAILED!")
        return
    
    print("✅ Voice authentication passed!")
    
    # STEP 2: Face Authentication
    print("\n--- STEP 2: FACE AUTHENTICATION ---")
    print("Position your face in front of the camera...")
    
    cap = cv2.VideoCapture(0)
    cap.set(3, 640)
    cap.set(4, 480)
    
    cascade = cv2.CascadeClassifier('./haarcascades/haarcascade_frontalface_default.xml')
    
    start_time = time.time()
    face_identity = 'unknown'
    
    while time.time() - start_time < 5:  # 5 second window
        _, frame = cap.read()
        frame = cv2.flip(frame, 1, 0)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        faces = cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 1:
            x, y, w, h = faces[0]
            roi = frame[y-10:y+h+10, x-10:x+w+10]
            
            fh, fw = roi.shape[:2]
            if fh >= 20 and fw >= 20:
                # Get face encoding
                img = cv2.resize(roi, (96, 96))
                encoding = img_to_encoding(img)
                
                # Find best face match
                min_dist = 100
                for name in face_db:
                    dist = np.linalg.norm(np.subtract(face_db[name], encoding))
                    if dist < min_dist:
                        min_dist = dist
                        face_identity = name
                
                # Draw result
                if min_dist <= 0.4:
                    cv2.rectangle(frame, (x-10, y-10), (x+w+10, y+h+10), (0, 255, 0), 2)
                    cv2.putText(frame, f"{face_identity} ({min_dist:.2f})", (x, y-15), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                else:
                    cv2.rectangle(frame, (x-10, y-10), (x+w+10, y+h+10), (0, 0, 255), 2)
                    cv2.putText(frame, f"Unknown ({min_dist:.2f})", (x, y-15), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        
        cv2.imshow('Face Authentication', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    
    print(f"Face recognized as: {face_identity}")
    
    # FINAL DECISION
    print("\n--- AUTHENTICATION RESULT ---")
    
    # Case insensitive comparison
    voice_lower = voice_identity.lower()
    face_lower = face_identity.lower()
    
    if voice_lower == face_lower and voice_identity != 'unknown':
        print(f"🎉 ACCESS GRANTED! Welcome {voice_identity}")
        print("✅ Voice Authentication: PASSED")
        print("✅ Face Authentication: PASSED")
        print("✅ Identity Match: CONFIRMED")
    else:
        print("❌ ACCESS DENIED!")
        print(f"Voice Identity: {voice_identity}")
        print(f"Face Identity: {face_identity}")
        if voice_lower != face_lower:
            print("❌ Identity Mismatch!")
        else:
            print("ℹ️ Case mismatch but same person detected")

if __name__ == '__main__':
    full_recognition()