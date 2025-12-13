from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

# MongoDB connection with SSL settings
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
try:
    client = MongoClient(MONGO_URI, 
                        serverSelectionTimeoutMS=10000,
                        ssl=True,
                        tlsAllowInvalidCertificates=True,
                        tlsAllowInvalidHostnames=True)
    db = client.diabetic_retinopathy
    print('✅ Connected to MongoDB Atlas')
except Exception as e:
    print(f'❌ MongoDB connection failed: {e}')
    db = None

# Load or train model
MODEL_PATH = 'model/dr_model.pkl'
SCALER_PATH = 'model/scaler.pkl'

def load_model():
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        return model, scaler
    return None, None

def train_model():
    # Load actual dataset
    dataset_path = '../data/18_features.xlsx'
    if os.path.exists(dataset_path):
        data = pd.read_excel(dataset_path)
    else:
        # Fallback to CSV if Excel not found
        csv_path = '../data/dataset.csv'
        if os.path.exists(csv_path):
            data = pd.read_csv(csv_path)
        else:
            # Create sample data as fallback
            data = pd.DataFrame({
                'exudates_count': np.random.randint(0, 10, 1000),
                'hemorrhages_count': np.random.randint(0, 15, 1000),
                'microaneurysms_count': np.random.randint(0, 20, 1000),
                'vessel_tortuosity': np.random.uniform(0, 1, 1000),
                'faz_area': np.random.uniform(0.1, 0.8, 1000),
                'macular_thickness': np.random.uniform(200, 400, 1000),
                'rnfl_thickness': np.random.uniform(80, 120, 1000),
                'deep_feature_1': np.random.uniform(0, 1, 1000),
                'deep_feature_2': np.random.uniform(0, 1, 1000),
                'deep_feature_3': np.random.uniform(0, 1, 1000),
                'age': np.random.randint(30, 80, 1000),
                'systolic_bp': np.random.randint(110, 180, 1000),
                'diastolic_bp': np.random.randint(70, 110, 1000),
                'fasting_glucose': np.random.uniform(80, 200, 1000),
                'hba1c': np.random.uniform(5, 12, 1000),
                'diabetes_duration': np.random.randint(0, 30, 1000),
                'history_hypertension': np.random.randint(0, 2, 1000),
                'visual_acuity': np.random.uniform(0.1, 1.0, 1000),
                'retinal_disorder': np.random.randint(0, 2, 1000)
            })
    
    # Handle missing target column
    if 'severity' not in data.columns:
        # Create target based on risk factors if not present
        risk_score = (data.get('exudates_count', 0) * 0.3 + 
                      data.get('hemorrhages_count', 0) * 0.25 + 
                      data.get('microaneurysms_count', 0) * 0.2 + 
                      (data.get('age', 50) > 60) * 0.15 + 
                      (data.get('hba1c', 6) > 7) * 0.1)
        data['severity'] = pd.cut(risk_score, bins=3, labels=[0, 1, 2])
    
    # Clean data and handle missing values
    data = data.fillna(0)
    
    # Convert text values to numeric
    for col in data.columns:
        if data[col].dtype == 'object':
            data[col] = pd.to_numeric(data[col].replace({'Yes': 1, 'No': 0, 'Male': 1, 'Female': 0}), errors='coerce')
    
    data = data.fillna(0)
    
    # Ensure we have the target column
    if 'severity' not in data.columns:
        data['severity'] = 0
    
    X = data.drop('severity', axis=1)
    y = data['severity']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    return model, scaler

# Initialize model
print('Loading ML model...')
model, scaler = load_model()
if model is None:
    print('No existing model found, training new model...')
    model, scaler = train_model()
    print('Model training completed')
else:
    print('Existing model loaded successfully')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Create DataFrame with same structure as training data
        import pandas as pd
        
        # Get feature names from scaler (if available) or use default order
        feature_names = [
            'exudates_count', 'hemorrhages_count', 'microaneurysms_count',
            'vessel_tortuosity', 'faz_area', 'macular_thickness', 'rnfl_thickness',
            'deep_feature_1', 'deep_feature_2', 'deep_feature_3',
            'age', 'systolic_bp', 'diastolic_bp', 'fasting_glucose',
            'hba1c', 'diabetes_duration', 'history_hypertension',
            'visual_acuity', 'retinal_disorder'
        ]
        
        # Create feature vector with proper names, handle empty strings
        features_dict = {}
        for name in feature_names:
            value = data.get(name, 0)
            if value == '' or value is None:
                features_dict[name] = 0.0
            else:
                try:
                    features_dict[name] = float(value)
                except (ValueError, TypeError):
                    features_dict[name] = 0.0
        
        # Add any missing columns that were in training (handle extra columns)
        if hasattr(scaler, 'feature_names_in_'):
            for col in scaler.feature_names_in_:
                if col not in features_dict:
                    features_dict[col] = 0.0
        
        # Create DataFrame and ensure column order matches training
        features_df = pd.DataFrame([features_dict])
        
        # Scale features
        features_scaled = scaler.transform(features_df)
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        
        # Map prediction to risk level
        risk_levels = ['Low', 'Medium', 'High']
        risk_level = risk_levels[int(prediction)]
        
        # Store prediction in database if available
        if db is not None:
            try:
                result = {
                    'patient_data': data,
                    'prediction': int(prediction),
                    'risk_level': risk_level,
                    'confidence': float(max(probability)),
                    'timestamp': datetime.now()
                }
                db.predictions.insert_one(result)
            except Exception as e:
                print(f'Database storage failed: {e}')
        
        return jsonify({
            'prediction': int(prediction),
            'risk_level': risk_level,
            'confidence': float(max(probability))
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        print(f"Input data: {data}")
        return jsonify({'error': str(e)}), 400

@app.route('/train', methods=['POST'])
def retrain():
    try:
        global model, scaler
        model, scaler = train_model()
        return jsonify({'message': 'Model retrained successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print('Starting Flask server on port 6000...')
    print('CORS enabled for http://localhost:3000')
    app.run(debug=True, port=6000, host='127.0.0.1')