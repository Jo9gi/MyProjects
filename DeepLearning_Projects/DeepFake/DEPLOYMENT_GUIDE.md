# 🚀 Deployment Guide - Live Deepfake Detector

Complete guide to deploy your Deepfake Detection System online.

---

## 📋 Table of Contents
- [Hugging Face Spaces (Recommended)](#hugging-face-spaces-recommended)
- [Render.com](#rendercom-alternative-1)
- [Railway.app](#railwayapp-alternative-2)
- [Why NOT Vercel](#why-not-vercel)
- [Custom Domain Setup](#custom-domain-setup)

---

## 🌟 Hugging Face Spaces (RECOMMENDED - FREE)

**Best for**: Gradio ML applications (like yours!)

### ✅ Advantages:
- **FREE** tier available
- **Made for Gradio** - zero config needed
- **Persistent storage** for models
- **Auto-deploy** from GitHub
- **GPU support** (paid tier)
- **Custom domain** support
- **Built-in Git LFS** for large models

### 🚀 Step-by-Step Deployment:

#### Step 1: Create Hugging Face Account
1. Go to https://huggingface.co/join
2. Sign up (free)
3. Verify your email

#### Step 2: Create a New Space
1. Go to https://huggingface.co/new-space
2. Fill in details:
   - **Space name**: `deepfake-detector` (or your choice)
   - **License**: `mit` or `apache-2.0`
   - **SDK**: Select `Gradio` ✅
   - **Python version**: `3.10`
   - **Visibility**: `Public` (free) or `Private` (paid)
3. Click **Create Space**

#### Step 3: Configure Your Space

The space will create a Git repository. You need to push your code there.

**Option A: Clone and Push (Recommended)**

```bash
# Clone the new space (replace USERNAME and SPACE_NAME)
git clone https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector
cd deepfake-detector

# Copy your files from GitHub project
# Navigate to your project folder
cd d:/downloads/DeepFake/hugging_deepfake/newmultimodal

# Add HF Space as remote
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector

# Push to Hugging Face
git push hf main
```

**Option B: Upload Files via Web**

1. Go to your Space page
2. Click **Files and versions**
3. Click **Add file** → **Upload files**
4. Drag and drop:
   - All `.py` files
   - `requirements.txt`
   - `packages.txt`
   - README.md
   - Model folders (Git LFS will handle)
   - Example files

#### Step 4: Create/Update README.md Header

Add this to the TOP of your README.md:

```yaml
---
title: Deepfake Detector
emoji: 🎭
colorFrom: blue
colorTo: red
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
license: mit
---
```

#### Step 5: Verify Deployment

1. Hugging Face will **automatically build** your space
2. Check the **Logs** tab to see progress
3. Wait 5-10 minutes for first build
4. Your app will be live at: `https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector`

#### Step 6: Share Your Live App! 🎉

Your app is now live and can be:
- ✅ Shared with students
- ✅ Embedded in websites
- ✅ Used by anyone worldwide
- ✅ Auto-updated when you push code

---

## 🔧 Render.com (Alternative 1 - FREE Tier)

**Best for**: Python web apps with persistent storage

### Advantages:
- ✅ FREE tier (750 hours/month)
- ✅ Persistent disk storage
- ✅ Custom domains
- ✅ Auto-deploy from GitHub

### Disadvantages:
- ⚠️ Slower than HF Spaces for ML
- ⚠️ 512 MB RAM on free tier (might be tight)
- ⚠️ Cold starts after inactivity

### Deployment Steps:

#### Step 1: Prepare Your Code

Create `render.yaml` in your project:

```yaml
services:
  - type: web
    name: deepfake-detector
    env: python
    region: oregon
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: python app.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.11
```

Update `app.py` to use environment port:

```python
import os

# ... existing code ...

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7860))
    app.launch(server_name="0.0.0.0", server_port=port, share=False)
```

#### Step 2: Deploy to Render

1. Go to https://render.com
2. Sign up / Log in
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Select `DeepFake_Detector`
6. Render will auto-detect settings
7. Click **Create Web Service**
8. Wait for deployment (10-15 minutes)

#### Step 3: Access Your App

Your app will be live at:
`https://deepfake-detector-XXXX.onrender.com`

---

## 🚂 Railway.app (Alternative 2 - Generous FREE Tier)

**Best for**: Quick deployments with good free tier

### Advantages:
- ✅ $5 FREE credit/month
- ✅ One-click deploy
- ✅ Good performance
- ✅ Custom domains

### Deployment Steps:

#### Step 1: Prepare Railway Config

Create `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python app.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ['python310', 'ffmpeg']

[phases.install]
cmds = ['pip install -r requirements.txt']

[phases.build]
cmds = ['echo "Build complete"']

[start]
cmd = 'python app.py'
```

Update `app.py` for Railway:

```python
import os

# ... existing code ...

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7860))
    app.launch(server_name="0.0.0.0", server_port=port, share=False)
```

#### Step 2: Deploy

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Choose `DeepFake_Detector`
6. Railway auto-deploys!

#### Step 3: Add Domain

1. Go to your project settings
2. Click **Generate Domain**
3. Your app is live!

---

## ❌ Why NOT Vercel

### Vercel Limitations for ML Apps:

| Issue | Limit | Your App |
|-------|-------|----------|
| **Function Size** | 50 MB max | 154 MB models ❌ |
| **Execution Time** | 10 sec (free) / 60 sec (pro) | ML inference can take longer ❌ |
| **Memory** | 1 GB (free) / 3 GB (pro) | TensorFlow needs more ⚠️ |
| **Cold Starts** | Frequent | Terrible for ML apps ❌ |
| **File System** | Read-only | Can't save uploads ❌ |

### If You REALLY Want Vercel (Not Recommended):

**Workaround** (Complex & Not Ideal):

1. Host models on external storage (S3, Cloudflare R2)
2. Download models on first request
3. Use Vercel Edge Functions with streaming
4. Implement heavy caching
5. Use external ML API instead

**This defeats the purpose and costs more!**

---

## 🌐 Custom Domain Setup

### For Hugging Face Spaces:

1. Go to Space Settings
2. Scroll to **Custom Domain**
3. Add your domain: `detector.yourdomain.com`
4. Add CNAME record in your DNS:
   ```
   CNAME detector -> spaces.huggingface.tech
   ```
5. Wait for DNS propagation (up to 24 hours)

### For Render/Railway:

1. Go to project settings
2. Add custom domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

---

## 📊 Deployment Comparison

| Feature | HF Spaces | Render | Railway | Vercel |
|---------|-----------|--------|---------|--------|
| **FREE Tier** | ✅ Unlimited | ✅ 750 hrs | ✅ $5/month | ✅ Yes |
| **ML Optimized** | ✅ Yes | ⚠️ OK | ⚠️ OK | ❌ No |
| **Model Size** | ✅ No limit | ✅ OK | ✅ OK | ❌ 50 MB |
| **Cold Starts** | ✅ Fast | ⚠️ Slow | ✅ Fast | ❌ Very slow |
| **GPU Support** | ✅ Yes (paid) | ❌ No | ❌ No | ❌ No |
| **Setup Time** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **For Your App** | ✅ BEST | ⚠️ OK | ⚠️ OK | ❌ Poor |

---

## 🎯 Recommended Choice

### For Your Deepfake Detector:

**🏆 #1: Hugging Face Spaces**
- Perfect for Gradio apps
- Made for ML models
- FREE and unlimited
- Professional platform

**🥈 #2: Railway**
- If you prefer traditional hosting
- Good performance
- Easy setup

**🥉 #3: Render**
- Good free tier
- Reliable but slower

**❌ Avoid: Vercel**
- Not designed for this
- Will have major issues

---

## 🚀 Quick Deploy (Hugging Face Spaces)

### Fastest Method:

```bash
# 1. Create space on Hugging Face website
# 2. Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector
cd deepfake-detector

# 3. Copy files from your GitHub repo
cp -r ../newmultimodal/* .

# 4. Create HF README header
cat > README.md << 'EOF'
---
title: Deepfake Detector
emoji: 🎭
sdk: gradio
app_file: app.py
---

# Deepfake Detection System
[Rest of your README content]
EOF

# 5. Push to HF
git add .
git commit -m "Initial deployment"
git push

# 6. Wait 5 minutes - YOUR APP IS LIVE! 🎉
```

---

## 💡 Pro Tips

### 1. **Optimize for Production**

Update `app.py` for public deployment:

```python
if __name__ == '__main__':
    app.launch(
        share=False,
        inbrowser=False,  # Don't auto-open browser
        server_name="0.0.0.0",  # Allow external access
        server_port=7860,
        enable_queue=True,  # Handle multiple users
        max_threads=10  # Concurrent requests
    )
```

### 2. **Add Usage Analytics**

Track usage with Gradio Analytics:

```python
app.launch(
    analytics_enabled=True  # Track usage stats
)
```

### 3. **Add Rate Limiting**

For HF Spaces, add in `app.py`:

```python
app.queue(concurrency_count=3)  # Max 3 concurrent users
app.launch()
```

### 4. **Monitor Your App**

- HF Spaces: Built-in logs and analytics
- Render/Railway: Dashboard with logs
- Set up uptime monitoring (UptimeRobot, Pingdom)

---

## 🎓 For Your Students

### Share Instructions:

```
🌐 Live Deepfake Detector

Try it live: https://huggingface.co/spaces/YOUR_USERNAME/deepfake-detector

Features:
- Upload images or videos
- Get instant deepfake detection results
- See confidence scores
- Try example files

No installation needed - just click and use!
```

---

## 🔧 Troubleshooting

### Common Issues:

**1. "Out of Memory" Error**
- Solution: Use HF Spaces with more RAM (paid tier)
- Or: Reduce model size / optimize code

**2. "Slow First Load"**
- Normal for cold starts
- Solution: Keep app active or use paid tier

**3. "Model Not Found"**
- Ensure Git LFS tracked model files
- Run: `git lfs pull` before pushing

**4. "Port Already in Use"**
- Change port in app.py
- Use environment variable: `PORT`

---

## ✅ Final Recommendation

### Deploy to Hugging Face Spaces Because:

1. ✅ **Made for your app** (Gradio + ML)
2. ✅ **Completely FREE** (public apps)
3. ✅ **Professional** (used by thousands)
4. ✅ **Easy to update** (just git push)
5. ✅ **Share with students** (just send link)
6. ✅ **No configuration** needed
7. ✅ **Built-in Git LFS** for models

### Live in 5 Minutes:
```bash
1. Create HF account (2 min)
2. Create new Space (1 min)
3. Push your code (2 min)
4. LIVE! 🎉
```

---

**Ready to deploy? Follow the Hugging Face Spaces section above! 🚀**

---

*Last Updated: November 4, 2025*
*Recommended: Hugging Face Spaces*
*Avoid: Vercel (not suitable)*
