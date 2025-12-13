# ⚡ Quick Start Guide

Get started with the Deepfake Detector in under 5 minutes!

---

## 🚀 Fast Setup (3 Steps)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Jo9gi/DeepFake_Detector.git
cd DeepFake_Detector
```

### 2️⃣ Create Environment & Install
```bash
# Create conda environment (recommended)
conda create -n deepfake_detector python=3.10.11 -y
conda activate deepfake_detector

# Install dependencies
pip install -r requirements.txt
```

### 3️⃣ Run the Application
```bash
python app.py
```

**That's it!** Open http://127.0.0.1:7860 in your browser.

---

## 💡 Quick Commands Reference

### For Windows Users
```batch
# One-click run (after initial setup)
run_app.bat
```

### For Conda Users
```bash
# Run without activating environment
conda run -n deepfake_detector python app.py
```

### For Virtual Environment Users
```bash
# Activate and run
source deepfake_env/bin/activate  # Linux/Mac
deepfake_env\Scripts\activate     # Windows
python app.py
```

---

## 📝 Usage Tips

1. **Image Detection**: 
   - Drag & drop an image
   - Or click example images below the upload box
   - Hit Submit

2. **Video Detection**:
   - Upload any video file
   - Processing takes a few seconds
   - See confidence score

3. **Supported Formats**:
   - Images: JPG, PNG, JPEG, WEBP
   - Videos: MP4, AVI, MOV, MKV

---

## ⚠️ Common Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Port already in use | Change port: `app.launch(server_port=7861)` |
| TensorFlow error | `pip install tensorflow==2.12.0` |
| Missing gradio | `pip install gradio` |
| Model not found | Ensure you're in the correct directory |

---

## 📖 Need More Help?

See the full [README.md](README.md) for:
- Detailed installation instructions
- Troubleshooting guide
- Technical documentation
- Contributing guidelines

---

**Happy Detecting! 🎯**
