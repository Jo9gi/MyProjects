import os
import pickle
import numpy as np
from scipy.io.wavfile import read
from voice_functions import extract_features
from sklearn.mixture import GaussianMixture

def train_voice_model(name):
    voice_dir = f"./voice_database/{name}"
    
    if not os.path.exists(voice_dir):
        print(f"No voice samples found for {name}")
        return
    
    print(f"Training voice model for {name}...")
    
    features_list = []
    
    # Extract features from all recordings
    for i in range(1, 4):
        filepath = os.path.join(voice_dir, f"{i}.wav")
        
        if not os.path.exists(filepath):
            print(f"Missing file: {filepath}")
            continue
            
        try:
            sr, audio = read(filepath)
            
            # Handle different audio formats
            if len(audio.shape) > 1:
                audio = audio[:, 0]  # Take first channel if stereo
            
            # Convert to float if needed
            if audio.dtype != np.float64:
                audio = audio.astype(np.float64)
            
            # Normalize audio
            if np.max(np.abs(audio)) > 0:
                audio = audio / np.max(np.abs(audio))
            
            # Extract MFCC features
            vector = extract_features(audio, sr)
            features_list.append(vector)
            print(f"Processed {filepath}: {vector.shape}")
            
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
            continue
    
    if len(features_list) == 0:
        print("No valid audio features extracted!")
        return
    
    # Combine all features
    all_features = np.vstack(features_list)
    print(f"Combined features shape: {all_features.shape}")
    
    # Train GMM model (using newer sklearn API)
    try:
        gmm = GaussianMixture(n_components=16, max_iter=200, covariance_type='diag', n_init=3)
        gmm.fit(all_features)
        
        # Save GMM model
        model_path = f"./gmm_models/{name}.gmm"
        with open(model_path, 'wb') as f:
            pickle.dump(gmm, f)
        
        print(f"Voice model for '{name}' created successfully!")
        print(f"Model saved to: {model_path}")
        
    except Exception as e:
        print(f"Error training GMM model: {e}")

if __name__ == '__main__':
    name = input("Enter name to train model for: ")
    train_voice_model(name)