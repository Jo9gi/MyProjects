# Phishing URL Detection System

A machine learning-based web application that detects phishing URLs using advanced feature extraction and ensemble modeling techniques.

## Features

- **Real-time URL Analysis**: Instant phishing detection through web interface
- **Multiple ML Models**: SVM and LightGBM classifiers for robust predictions
- **Smart Whitelisting**: Trusted domains bypass for improved accuracy
- **Feature Engineering**: 16 URL-based features including domain analysis, suspicious patterns, and structural metrics
- **Web Interface**: Clean, responsive Flask-based UI

## Project Structure

```
phishing_detection/
├── app/
│   └── app.py              # Flask web application
├── data/
│   ├── processed/
│   │   └── dataset.csv     # Processed feature dataset
│   └── raw/
│       ├── benign.csv      # Legitimate URLs dataset
│       └── phishing.csv    # Phishing URLs dataset
├── features/
│   └── url_features.py     # Feature extraction module
├── inference/
│   ├── predict.py          # Prediction engine
│   └── whitelist.py        # Trusted domains list
├── models/
│   ├── lgbm_model.pkl      # LightGBM trained model
│   └── svm_model.pkl       # SVM trained model
├── templates/
│   └── index.html          # Web interface template
└── training/
    └── train.py            # Model training pipeline
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Jo9gi/MyProjects.git
cd MyProjects/MachineLearning_Projects/phishing_detection
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Training Models

Run the training pipeline to create new models:
```bash
python -m training.train
```

### Web Application

Start the Flask web server:
```bash
python -m app.app
```

Access the application at `http://localhost:5000`

### Programmatic Usage

```python
from inference.predict import predict_url

result = predict_url("https://example.com")
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}%")
```

## Feature Engineering

The system extracts 16 key features from URLs:

- **Length Metrics**: URL length, domain length, subdomain length
- **Character Counts**: Dots, hyphens, @ symbols, question marks, percentages
- **Content Analysis**: Digit count, letter count, suspicious keywords
- **Security Indicators**: HTTPS presence, IP address detection
- **Domain Structure**: Subdomain count analysis

## Models

- **SVM**: Radial Basis Function kernel with probability estimates
- **LightGBM**: Gradient boosting with 200 estimators (primary model)

## Performance

The system uses a confidence threshold of 95% for phishing classification, with whitelisted domains automatically classified as legitimate.

## Dependencies

- pandas
- numpy
- scikit-learn
- lightgbm
- tldextract
- flask
- joblib

## License

This project is for educational and research purposes.