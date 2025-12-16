import joblib
import pandas as pd

from features.url_features import extract_features
from inference.whitelist import is_whitelisted

# Load trained model once
model = joblib.load("models/lgbm_model.pkl")

def predict_url(url: str, threshold=0.95):
    # 1. Hard whitelist check
    if is_whitelisted(url):
        return {
            "prediction": "Legitimate",
            "confidence": 99.9
        }

    # 2. Feature extraction
    features = extract_features(url)
    df = pd.DataFrame([features])

    # 3. Model prediction
    prob = model.predict_proba(df)[0][1]

    # 4. Threshold decision
    if prob >= threshold:
        return {
            "prediction": "Phishing",
            "confidence": round(prob * 100, 2)
        }
    else:
        return {
            "prediction": "Legitimate",
            "confidence": round((1 - prob) * 100, 2)
        }
