# Voice and Face Recognition System

Dual-factor biometric authentication system using voice recognition (GMM) and face recognition (FaceNet).

## Requirements

- **Python 3.7.x** (Required - newer versions will break TensorFlow 1.14)
- **Webcam** for face recognition
- **Microphone** for voice authentication
- **Windows/Linux/macOS**

## Installation

### 1. Install Python 3.7.9
```bash
# Download from: https://www.python.org/downloads/release/python-379/
# Or use winget on Windows:
winget install Python.Python.3.7
```

### 2. Clone Repository
```bash
git clone https://github.com/Jo9gi/Voice_and_Face_Recognition.git
cd Voice_and_Face_Recognition
```

### 3. Create Virtual Environment
```bash
# Windows
py -3.7 -m venv venv_voice_face
venv_voice_face\Scripts\activate

# Linux/macOS
python3.7 -m venv venv_voice_face
source venv_voice_face/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirement.txt
pip install sounddevice soundfile
```

### 5. Create Required Directories
```bash
mkdir saved_image
```

## Usage

### Register New User

**Step 1: Add Face**
```bash
python add_face_only.py
```

**Step 2: Add Voice**
```bash
python add_voice_only.py
```

**Step 3: Train Voice Model**
```bash
python train_voice_model.py
```

### Authentication

**Full Dual-Factor Authentication**
```bash
python full_recognition.py
```

**Test Face Recognition Only**
```bash
python test_face_only.py
```

## Project Structure

```
├── face_functions.py          # Face recognition logic
├── voice_functions.py         # Voice processing logic
├── full_recognition.py        # Main authentication system
├── add_face_only.py          # Face registration
├── add_voice_only.py         # Voice recording
├── train_voice_model.py      # Voice model training
├── test_face_only.py         # Face testing
├── facenet_model/            # Pre-trained FaceNet model
├── haarcascades/             # Face detection classifier
├── face_database/            # Face encodings (created after first user)
├── voice_database/           # Voice samples (created after first user)
├── gmm_models/              # Trained voice models (created after training)
└── requirement.txt          # Dependencies
```

## How It Works

1. **Face Recognition**: Uses FaceNet model to generate 128-dimensional face encodings
2. **Voice Recognition**: Extracts MFCC features and trains GMM models for each user
3. **Authentication**: Requires both voice AND face to match for access

## Troubleshooting

**TensorFlow Warnings**: Normal - ignore deprecation warnings

**Camera Issues**: Ensure no other apps are using webcam

**Audio Issues**: Check microphone permissions

**Import Errors**: Verify Python 3.7.x and virtual environment activation

## Security Features

- Dual-factor authentication (voice + face)
- Real-time face detection
- MFCC voice feature extraction
- Configurable similarity thresholds
- Case-insensitive name matching

## References

- [FaceNet Paper](https://arxiv.org/pdf/1503.03832.pdf)
- [Keras OpenFace Implementation](https://github.com/iwantooxxoox/Keras-OpenFace)
- [DeepLearning.ai CNN Course](https://www.coursera.org/learn/convolutional-neural-networks)