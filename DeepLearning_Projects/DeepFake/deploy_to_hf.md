# 🚀 Deploy to Hugging Face Spaces - Quick Guide

**Your app will be LIVE in 5 minutes!**

---

## Step-by-Step (Copy-Paste Commands)

### 1️⃣ Create Your Space

1. Go to: https://huggingface.co/new-space
2. Sign up/login
3. Fill in:
   - **Space name**: `deepfake-detector`
   - **SDK**: `Gradio`
   - **Visibility**: `Public` (FREE)
4. Click **Create Space**

### 2️⃣ Prepare Your README Header

Replace the FIRST lines of `README.md` with:

```yaml
---
title: AI Deepfake Detector
emoji: 🎭
colorFrom: blue
colorTo: red
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
license: mit
python_version: 3.10.11
---
```

### 3️⃣ Deploy Your Code

**Option A: Via Web Upload (Easiest)**

1. Go to your Space page
2. Click **Files** tab
3. Upload these files:
   - `app.py`
   - `pipeline.py`
   - `rawnet.py`
   - `requirements.txt`
   - `packages.txt`
   - `README.md` (with header)
   - Entire `efficientnet-b0/` folder
   - `RawNet2.pth`
   - `images/` folder
   - `videos/` folder

**Option B: Via Git (Advanced)**

```bash
# Clone your new space
git clone https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector
cd deepfake-detector

# Setup Git LFS
git lfs install
git lfs track "*.pth"
git lfs track "*.pb"
git lfs track "efficientnet-b0/**"

# Copy your files
cp -r d:/downloads/DeepFake/hugging_deepfake/newmultimodal/* .

# Add and push
git add .
git commit -m "Deploy Deepfake Detector"
git push
```

### 4️⃣ Wait for Build

1. Go to your Space page
2. Click **Logs** tab
3. Watch the build (5-10 minutes)
4. When you see "Running on public URL", it's LIVE! 🎉

### 5️⃣ Access Your Live App

Your app will be at:
```
https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector
```

---

## 🎓 Share With Students

Send them this link:
```
🎭 Try our AI Deepfake Detector:
https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector

Upload an image or video to detect if it's real or fake!
```

---

## 💡 Pro Tips

### Make It Better:

1. **Add Description** in Space settings
2. **Add Tags**: `deepfake`, `detection`, `computer-vision`
3. **Pin Examples**: Students can try immediately
4. **Enable Queue**: Handle multiple users

### Update Later:

Just push to Git:
```bash
git add .
git commit -m "Update model"
git push
```

Auto-deploys in 2 minutes!

---

## ✅ That's It!

**Your deepfake detector is now LIVE and accessible worldwide!** 🌍

---

**Questions? Check DEPLOYMENT_GUIDE.md for full details**
