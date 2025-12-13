# 📦 Complete Installation Guide

Detailed step-by-step installation instructions for all platforms.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Windows Installation](#windows-installation)
- [Linux Installation](#linux-installation)
- [macOS Installation](#macos-installation)
- [Docker Installation](#docker-installation-optional)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
1. **Python 3.10.11** (Recommended)
   - Download: https://www.python.org/downloads/release/python-31011/
   - Alternative: Anaconda/Miniconda

2. **Git** (for cloning)
   - Download: https://git-scm.com/downloads

3. **Git LFS** (for large files)
   - Download: https://git-lfs.github.com/

### System Requirements
- RAM: 8 GB minimum, 16 GB recommended
- Storage: 2 GB free space
- Internet: For downloading models and dependencies

---

## Windows Installation

### Option 1: Using Conda (Recommended)

#### Step 1: Install Anaconda
1. Download from https://www.anaconda.com/download
2. Run installer, follow prompts
3. Open "Anaconda Prompt" from Start Menu

#### Step 2: Clone Repository
```powershell
# Navigate to desired location
cd C:\Users\YourName\Documents

# Clone the project
git clone https://huggingface.co/spaces/divagar006/newmultimodal
cd newmultimodal
```

#### Step 3: Create Environment
```powershell
# Create new environment
conda create -n deepfake_detector python=3.10.11 -y

# Activate environment
conda activate deepfake_detector

# Verify Python version
python --version
# Should show: Python 3.10.11
```

#### Step 4: Install Dependencies
```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Wait for installation to complete (5-10 minutes)
```

#### Step 5: Run Application
```powershell
# Start the application
python app.py

# Or use the batch file
run_app.bat
```

### Option 2: Using Python Virtual Environment

#### Prerequisites
Ensure Python 3.10.11 is installed:
```powershell
# Check Python version
python --version

# If not 3.10.11, download and install it
```

#### Installation Steps
```powershell
# Clone repository
git clone https://github.com/Jo9gi/DeepFake_Detector.git
cd DeepFake_Detector

# Create virtual environment
python -m venv deepfake_env

# Activate environment
deepfake_env\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run application
python app.py
```

---

## Linux Installation

### Option 1: Using Conda

#### Step 1: Install Miniconda
```bash
# Download Miniconda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Install
bash Miniconda3-latest-Linux-x86_64.sh

# Follow prompts, then restart terminal
source ~/.bashrc
```

#### Step 2: Clone and Setup
```bash
# Clone repository
git clone https://github.com/Jo9gi/DeepFake_Detector.git
cd DeepFake_Detector

# Create environment
conda create -n deepfake_detector python=3.10.11 -y
conda activate deepfake_detector

# Install system dependencies
sudo apt-get update
sudo apt-get install -y ffmpeg libsm6 libxext6

# Install Python packages
pip install -r requirements.txt
```

#### Step 3: Run Application
```bash
python app.py
```

### Option 2: Using Virtual Environment

```bash
# Ensure Python 3.10 is installed
sudo apt-get update
sudo apt-get install -y python3.10 python3.10-venv python3-pip

# Clone repository
git clone https://github.com/Jo9gi/DeepFake_Detector.git
cd DeepFake_Detector

# Create virtual environment
python3.10 -m venv deepfake_env

# Activate environment
source deepfake_env/bin/activate

# Install system dependencies
sudo apt-get install -y ffmpeg libsm6 libxext6

# Install Python packages
pip install --upgrade pip
pip install -r requirements.txt

# Run application
python app.py
```

---

## macOS Installation

### Option 1: Using Conda

#### Step 1: Install Miniconda
```bash
# Download Miniconda
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh

# Install
bash Miniconda3-latest-MacOSX-x86_64.sh

# Restart terminal
source ~/.bash_profile  # or ~/.zshrc for newer macOS
```

#### Step 2: Clone and Setup
```bash
# Clone repository
git clone https://github.com/Jo9gi/DeepFake_Detector.git
cd DeepFake_Detector

# Create environment
conda create -n deepfake_detector python=3.10.11 -y
conda activate deepfake_detector

# Install dependencies
pip install -r requirements.txt
```

#### Step 3: Run Application
```bash
python app.py
```

### Option 2: Using Homebrew and venv

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python 3.10
brew install python@3.10

# Clone repository
git clone https://github.com/Jo9gi/DeepFake_Detector.git
cd DeepFake_Detector

# Create virtual environment
python3.10 -m venv deepfake_env

# Activate environment
source deepfake_env/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run application
python app.py
```

---

## Docker Installation (Optional)

For isolated, reproducible environments:

### Create Dockerfile
Create a file named `Dockerfile` in the project root:

```dockerfile
FROM python:3.10.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose Gradio default port
EXPOSE 7860

# Run application
CMD ["python", "app.py"]
```

### Build and Run
```bash
# Build Docker image
docker build -t deepfake-detector .

# Run container
docker run -p 7860:7860 deepfake-detector

# Access at http://localhost:7860
```

---

## Verification

### Check Installation

```bash
# Activate environment
conda activate deepfake_detector  # or source deepfake_env/bin/activate

# Test imports
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__}')"
python -c "import gradio as gr; print(f'Gradio {gr.__version__}')"
python -c "import torch; print(f'PyTorch {torch.__version__}')"

# All should execute without errors
```

### Test Run
```bash
# Start application
python app.py

# Look for output:
# Running on local URL:  http://127.0.0.1:7860

# Open browser to the URL
# Try uploading an example image
```

---

## Troubleshooting

### Python Version Issues

**Problem**: Wrong Python version
```bash
# Solution: Specify exact version in conda
conda create -n deepfake_detector python=3.10.11 -y
```

### Dependency Conflicts

**Problem**: Package version conflicts
```bash
# Solution: Create fresh environment
conda deactivate
conda env remove -n deepfake_detector
conda create -n deepfake_detector python=3.10.11 -y
conda activate deepfake_detector
pip install -r requirements.txt
```

### TensorFlow Installation Issues

**Problem**: TensorFlow not installing
```bash
# Solution: Install specific version
pip install tensorflow==2.12.0 --no-cache-dir
```

### CUDA/GPU Errors

**Problem**: CUDA library errors
```bash
# Solution: Install CPU version
pip uninstall tensorflow
pip install tensorflow-cpu==2.12.0
```

### Permission Errors (Linux/Mac)

**Problem**: Permission denied
```bash
# Solution: Use --user flag
pip install -r requirements.txt --user
```

### Port Already in Use

**Problem**: Port 7860 is busy
```python
# Solution: Edit app.py, change port
app.launch(share=False, server_port=7861)
```

### Model Files Missing

**Problem**: efficientnet-b0 directory empty
```bash
# Solution: Pull with Git LFS
git lfs install
git lfs pull
```

### Out of Memory

**Problem**: System runs out of RAM
- Close other applications
- Process smaller files
- Restart system
- Upgrade RAM if possible

---

## Environment Management

### Listing Environments
```bash
# Conda
conda env list

# venv (just check directory)
ls -la deepfake_env/
```

### Activating Environment
```bash
# Conda
conda activate deepfake_detector

# venv (Linux/Mac)
source deepfake_env/bin/activate

# venv (Windows)
deepfake_env\Scripts\activate
```

### Deactivating Environment
```bash
# Conda
conda deactivate

# venv
deactivate
```

### Removing Environment
```bash
# Conda
conda env remove -n deepfake_detector

# venv
rm -rf deepfake_env/  # Linux/Mac
rmdir /s deepfake_env  # Windows
```

### Updating Dependencies
```bash
# Activate environment first
conda activate deepfake_detector

# Update all packages
pip install --upgrade -r requirements.txt

# Update specific package
pip install --upgrade gradio
```

---

## Advanced Setup

### GPU Acceleration (NVIDIA)

For faster inference with NVIDIA GPUs:

```bash
# Check CUDA availability
nvidia-smi

# Install TensorFlow GPU version
pip uninstall tensorflow
pip install tensorflow-gpu==2.12.0

# Verify GPU detection
python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
```

### Jupyter Notebook Integration

```bash
# Install Jupyter
pip install jupyter notebook

# Create kernel
python -m ipykernel install --user --name=deepfake_detector

# Launch Jupyter
jupyter notebook
```

### Development Setup

```bash
# Install development dependencies
pip install pytest black flake8 mypy

# Install in editable mode
pip install -e .
```

---

## Post-Installation

### Creating Desktop Shortcut (Windows)

1. Create file `Launch Deepfake Detector.bat`:
```batch
@echo off
cd /d "C:\path\to\newmultimodal"
call conda activate deepfake_detector
python app.py
pause
```

2. Right-click → Create Shortcut
3. Move shortcut to Desktop

### Creating Launch Script (Linux/Mac)

Create `launch.sh`:
```bash
#!/bin/bash
cd /path/to/newmultimodal
source ~/miniconda3/bin/activate deepfake_detector
python app.py
```

Make executable:
```bash
chmod +x launch.sh
./launch.sh
```

---

## Support

If you encounter issues not covered here:

1. Check the main [README.md](README.md)
2. Search GitHub Issues
3. Check Hugging Face Discussions
4. Verify all prerequisites are met
5. Try creating a fresh environment

---

**Installation complete! Ready to detect deepfakes! 🎯**
