import os
import pickle
import time
import numpy as np
from voice_functions import record_audio, save_audio, extract_features
from sklearn.mixture import GMM

def add_voice_only():
    name = input("Enter your name: ")
    
    # Create voice directory
    voice_dir = f"./voice_database/{name}"
    
    if os.path.exists(voice_dir):
        print("Voice already exists for this name!")
        return
    
    os.makedirs(voice_dir, exist_ok=True)
    
    print(f"Recording 3 voice samples for {name}")
    print("You will be asked to say your name 3 times")
    
    # Record 3 voice samples
    for i in range(3):
        input(f"\nPress Enter when ready to record sample {i+1}/3...")
        
        # Countdown
        for j in range(3, 0, -1):
            print(f"Say your name in {j}...")
            time.sleep(1)
        
        # Record audio
        audio_data, sample_rate = record_audio(duration=3)
        
        # Save audio file
        filename = os.path.join(voice_dir, f"{i+1}.wav")
        save_audio(audio_data, sample_rate, filename)
        print(f"Sample {i+1} saved")
    
    # Train GMM model
    print("Training voice model...")
    
    features_list = []
    
    # Extract features from all 3 recordings
    for i in range(1, 4):
        filepath = os.path.join(voice_dir, f"{i}.wav")
        sr, audio = read(filepath)
        
        # Convert to proper format if needed
        if len(audio.shape) > 1:
            audio = audio[:, 0]  # Take first channel if stereo
        
        # Extract MFCC features
        vector = extract_features(audio, sr)
        features_list.append(vector)
    
    # Combine all features
    all_features = np.vstack(features_list)
    
    # Train GMM model
    gmm = GMM(n_components=16, n_iter=200, covariance_type='diag', n_init=3)
    gmm.fit(all_features)
    
    # Save GMM model
    model_path = f"./gmm_models/{name}.gmm"
    with open(model_path, 'wb') as f:
        pickle.dump(gmm, f)
    
    print(f"Voice model for '{name}' created successfully!")
    print("You can now test voice recognition")

if __name__ == '__main__':
    add_voice_only()