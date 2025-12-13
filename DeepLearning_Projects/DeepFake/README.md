# 🎭 Deepfake Detection System
### Multimodal AI-Powered Deepfake Detector for Images and Videos

[![Python 3.10](https://img.shields.io/badge/python-3.10-blue.svg)](https://www.python.org/downloads/)
[![TensorFlow 2.12](https://img.shields.io/badge/TensorFlow-2.12-orange.svg)](https://www.tensorflow.org/)
[![Gradio](https://img.shields.io/badge/Gradio-Interface-red.svg)](https://gradio.app/)

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [System Requirements](#-system-requirements)
- [Installation Guide](#-installation-guide)
- [Usage](#-usage)
- [Cloning Instructions](#-cloning-instructions)
- [Model Information](#-model-information)
- [Technical Details](#-technical-details)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

This project is an advanced **Deepfake Detection System** that uses deep learning models to identify manipulated (fake) images and videos. The system employs **EfficientNetV2** architecture for visual content analysis, providing real-time detection with confidence scores.

### What is a Deepfake?
Deepfakes are synthetic media created using artificial intelligence to manipulate or generate visual and audio content. This tool helps identify such manipulated content.

### Use Cases
- 🔒 **Media Verification** - Verify authenticity of images and videos
- 📰 **Journalism** - Fact-checking visual content
- 🛡️ **Security** - Detect manipulated surveillance footage
- 🎓 **Education** - Learn about AI detection techniques
- 🔍 **Research** - Academic deepfake detection research

---

## ✨ Features

- **🖼️ Image Detection** - Analyze single images for deepfake manipulation
- **🎬 Video Detection** - Frame-by-frame analysis of video content
- **📊 Confidence Scoring** - Get percentage-based confidence levels
- **🎨 Modern UI** - Large, user-friendly Gradio interface
- **⚡ Real-time Processing** - Fast detection results
- **📁 Example Files** - Pre-loaded test images and videos
- **🔄 Batch Processing** - Analyze multiple frames in videos

---

## 📁 Project Structure

```
newmultimodal/
│
├── 📄 app.py                    # Main Gradio application interface
├── 📄 pipeline.py               # Core detection pipeline and logic
├── 📄 rawnet.py                 # RawNet2 model architecture (audio)
├── 📄 requirements.txt          # Python dependencies
├── 📄 packages.txt              # System-level dependencies
├── 📄 run_app.bat              # Windows batch script to run app
├── 📄 .gitignore               # Git ignore configuration
├── 📄 .gitattributes           # Git LFS configuration
│
├── 📂 efficientnet-b0/         # EfficientNet B0 model directory
│   ├── saved_model.pb          # TensorFlow saved model
│   ├── keras_metadata.pb       # Keras model metadata
│   └── variables/              # Model weights and variables
│
├── 📂 images/                   # Example images for testing
│   ├── images_lady.jpg         # Example real image
│   └── images_fake_image.jpg   # Example fake image
│
├── 📂 videos/                   # Example videos for testing
│   ├── celeb_synthesis.mp4     # Example fake video
│   └── real-1.mp4              # Example real video
│
├── 📂 audios/                   # Example audio files (optional)
│   └── *.flac                  # Audio samples
│
├── 📦 RawNet2.pth              # RawNet2 audio model weights (67 MB)
│
└── 📂 .git/                     # Git repository (if cloned)
```

### File Descriptions

| File/Folder | Purpose | Size | Required |
|-------------|---------|------|----------|
| `app.py` | Main application with Gradio UI | ~2 KB | ✅ Yes |
| `pipeline.py` | Detection logic & preprocessing | ~7 KB | ✅ Yes |
| `rawnet.py` | Audio detection model class | ~14 KB | ⚠️ Optional |
| `requirements.txt` | Python package dependencies | ~135 B | ✅ Yes |
| `efficientnet-b0/` | Image/Video detection model | ~87 MB | ✅ Yes |
| `RawNet2.pth` | Audio detection weights | ~67 MB | ⚠️ Optional |
| `images/` | Example test images | ~36 KB | 📝 Recommended |
| `videos/` | Example test videos | ~840 KB | 📝 Recommended |

---

## 💻 System Requirements

### Recommended Python Version
**Python 3.10.11** (Tested and Verified ✅)

> **Why Python 3.10.11?**
> - Best compatibility with TensorFlow 2.12
> - Stable support for all dependencies
> - Optimal performance with PyTorch
> - Well-tested in production environments

### Alternative Python Versions
- ✅ Python 3.10.x (Any 3.10 version)
- ✅ Python 3.9.x (Compatible but not optimal)
- ⚠️ Python 3.11+ (May have dependency conflicts)
- ❌ Python 3.8 or lower (Not supported)

### Hardware Requirements
- **RAM**: Minimum 8 GB, Recommended 16 GB
- **Storage**: ~500 MB for models and dependencies
- **GPU**: Optional (CPU inference works fine)
- **OS**: Windows 10/11, Linux, macOS

---

## 🚀 Installation Guide

### Method 1: Using Conda Environment (Recommended ⭐)

#### Step 1: Install Anaconda/Miniconda
Download from: https://www.anaconda.com/download

#### Step 2: Create Conda Environment
```bash
# Create environment with Python 3.10.11
conda create -n deepfake_detector python=3.10.11 -y

# Activate the environment
conda activate deepfake_detector
```

#### Step 3: Install Dependencies
```bash
# Navigate to project directory
cd path/to/newmultimodal

# Install all requirements
pip install -r requirements.txt
```

#### Step 4: Install System Dependencies (Linux only)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y ffmpeg libsm6 libxext6

# For other Linux distributions, install equivalent packages
```

### Method 2: Using Virtual Environment (venv)

#### Step 1: Ensure Python 3.10.11 is Installed
```bash
# Check Python version
python --version
# Should output: Python 3.10.11
```

#### Step 2: Create Virtual Environment
```bash
# Navigate to project directory
cd path/to/newmultimodal

# Create virtual environment
python -m venv deepfake_env

# Activate environment
# Windows:
deepfake_env\Scripts\activate

# Linux/Mac:
source deepfake_env/bin/activate
```

#### Step 3: Install Dependencies
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

### Method 3: System-Wide Installation (Not Recommended)
```bash
# Install directly to system Python
pip install -r requirements.txt
```

---

## 📦 Dependencies

### Core Dependencies
```
tensorflow==2.12.0          # Deep learning framework
gradio                      # Web interface
opencv-python              # Image/video processing
opencv-python-headless     # Headless OpenCV
numpy                      # Numerical operations
```

### Additional Dependencies
```
torch                      # PyTorch for audio model
torchvision               # Vision utilities
facenet_pytorch           # Face detection
mtcnn                     # Multi-task CNN
moviepy                   # Video processing
librosa                   # Audio processing
```

All dependencies are automatically installed via `requirements.txt`.

---

## 🎮 Usage

### Running the Application

#### Option 1: Using Batch Script (Windows)
```bash
# Double-click or run:
run_app.bat
```

#### Option 2: Using Python Command
```bash
# Activate environment first
conda activate deepfake_detector  # or your env name

# Run the application
python app.py
```

#### Option 3: Using Conda Run
```bash
# Run without activating (from any directory)
conda run -n deepfake_detector python app.py
```

### Accessing the Interface

Once running, the application will display:
```
Running on local URL:  http://127.0.0.1:7860
```

Open this URL in your web browser to access the interface.

### Using the Detector

1. **Image Detection**:
   - Navigate to "Image inference" tab
   - Click upload area or drag & drop an image
   - Click "Submit" button
   - View detection result with confidence score

2. **Video Detection**:
   - Navigate to "Video inference" tab
   - Upload a video file
   - Click "Submit" button
   - Wait for frame-by-frame analysis
   - View aggregated detection result

3. **Example Files**:
   - Click on example images/videos below upload area
   - Automatically runs detection

---

## 📥 Installation from GitHub

### Standard Installation

```bash
# Clone the repository
git clone https://github.com/Jo9gi/DeepFake_Detector.git

# Navigate into directory
cd DeepFake_Detector

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

### Using Git LFS (For Large Model Files)

```bash
# Install Git LFS first (one-time setup)
git lfs install

# Clone with large files
git clone https://github.com/Jo9gi/DeepFake_Detector.git

# If models are missing, pull them:
cd DeepFake_Detector
git lfs pull
```

### Quick Clone (Without Large Files)

```bash
# Skip large files during clone (faster)
GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/Jo9gi/DeepFake_Detector.git

# Download models later when needed
cd DeepFake_Detector
git lfs pull --include="efficientnet-b0/*"
```

---

## 🧠 Model Information

### EfficientNetV2-B0 (Image/Video Detection)
- **Architecture**: EfficientNetV2
- **Variant**: B0 (Smallest, fastest)
- **Input Size**: 224x224 pixels
- **Output**: Binary classification (Real/Fake)
- **Size**: ~87 MB
- **Framework**: TensorFlow/Keras

### RawNet2 (Audio Detection - Optional)
- **Architecture**: RawNet2
- **Purpose**: Audio deepfake detection
- **Input**: Raw audio waveforms
- **Output**: Binary classification
- **Size**: ~67 MB
- **Framework**: PyTorch

---

## 🔧 Technical Details

### Detection Pipeline

1. **Input Processing**:
   - Images: Resized to 224x224 RGB
   - Videos: Extracted frames at intervals
   - Normalization: Pixel values scaled to [0, 1]

2. **Feature Extraction**:
   - EfficientNet convolutional layers
   - Compound scaling for efficiency
   - MBConv blocks with squeeze-excitation

3. **Classification**:
   - Binary output (Real vs Fake)
   - Softmax activation
   - Confidence scores in percentage

4. **Video Aggregation**:
   - Frame-by-frame analysis
   - Mean confidence across frames
   - Threshold: 50% for classification

### Performance Metrics
- **Inference Time**: 
  - Image: ~0.5-2 seconds
  - Video: ~2-10 seconds (depends on length)
- **Accuracy**: Varies by content type
- **Supported Formats**:
  - Images: JPG, PNG, JPEG, WEBP
  - Videos: MP4, AVI, MOV, MKV

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue 1: TensorFlow Import Error
```
Error: module 'tensorflow' has no attribute 'random'
```
**Solution**:
```bash
pip uninstall tensorflow tensorflow-intel -y
pip install tensorflow==2.12.0
```

#### Issue 2: CUDA/GPU Errors
```
Error: Could not load dynamic library 'cudart64_110.dll'
```
**Solution**: Install CPU version or ignore (CPU inference works)
```bash
pip install tensorflow-cpu==2.12.0
```

#### Issue 3: Port Already in Use
```
Error: Address already in use: 7860
```
**Solution**: Kill existing process or change port
```python
# In app.py, change:
app.launch(share=False, server_port=7861)
```

#### Issue 4: Out of Memory
```
Error: ResourceExhaustedError: OOM when allocating tensor
```
**Solution**: Process smaller images or videos, or increase system RAM

#### Issue 5: Model Files Missing
```
Error: No such file or directory: 'efficientnet-b0/'
```
**Solution**: Ensure Git LFS pulled the models
```bash
git lfs pull
```

### Getting Help
- Check existing GitHub Issues
- Review Hugging Face Space discussions
- Ensure all dependencies are installed correctly

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Your Changes**
4. **Test Thoroughly**
5. **Commit Your Changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Areas for Contribution
- 🎨 UI/UX improvements
- 🧪 Additional model architectures
- 📊 Performance optimizations
- 📝 Documentation enhancements
- 🐛 Bug fixes
- 🌐 Multi-language support

---

## 📄 License

This project is available for educational and research purposes.
Please use responsibly and cite appropriately when using in academic work.

---

## 🙏 Acknowledgments

- **EfficientNet Architecture**: Google Research
- **Gradio Framework**: Gradio Team for the web interface
- **TensorFlow**: Google Brain Team
- **Deep Learning Community**: For open-source tools and models

---

## 📞 Contact & Support

- **GitHub Repository**: https://github.com/Jo9gi/DeepFake_Detector
- **Issues**: Use GitHub Issues tab for bug reports
- **Discussions**: GitHub Discussions for questions and ideas

---

## 🔄 Version History

- **v1.0.0** - Initial release with image and video detection
- **v1.1.0** - Enhanced UI with larger interface
- **v1.2.0** - Removed audio tab, cleaned project structure

---

## ⚠️ Disclaimer

This tool is for educational and research purposes. While it aims to detect deepfakes accurately, no detection system is perfect. Always verify important content through multiple sources.

---

**Made with ❤️ for a safer digital world**
