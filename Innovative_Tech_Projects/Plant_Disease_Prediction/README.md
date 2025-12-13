# Plant Disease Recognition System

A machine learning-powered web application built with Streamlit and TensorFlow for identifying plant diseases from uploaded images.

## Features

- **Disease Recognition**: Upload plant images to detect diseases using a trained CNN model
- **Multi-class Classification**: Identifies 38 different plant disease classes
- **User-friendly Interface**: Simple Streamlit web interface
- **Real-time Predictions**: Fast disease detection and classification

## Supported Plants & Diseases

The model can identify diseases in:
- Apple (Apple scab, Black rot, Cedar apple rust)
- Tomato (Bacterial spot, Early blight, Late blight, Leaf Mold, etc.)
- Corn (Cercospora leaf spot, Common rust, Northern Leaf Blight)
- Grape (Black rot, Esca, Leaf blight)
- Potato (Early blight, Late blight)
- And many more...

## Installation

1. Clone the repository
2. Create a conda environment with Python 3.10:
   ```bash
   conda create -n plant_disease python=3.10
   conda activate plant_disease
   ```
3. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```

## Usage

1. Run the Streamlit application:
   ```bash
   streamlit run main.py
   ```
2. Open your browser and go to `http://localhost:8501`
3. Navigate to "Disease Recognition" page
4. Upload a plant image
5. Click "Predict" to get disease classification

## Model Information

- **Architecture**: Convolutional Neural Network (CNN)
- **Input Size**: 128x128 pixels
- **Classes**: 38 different plant disease categories
- **Framework**: TensorFlow/Keras

## Dataset

The model is trained on a dataset containing approximately 87K RGB images of healthy and diseased crop leaves, categorized into 38 different classes.

## Requirements

- Python 3.10+
- TensorFlow
- Streamlit
- NumPy
- PIL (Pillow)
- Other dependencies listed in `requirement.txt`