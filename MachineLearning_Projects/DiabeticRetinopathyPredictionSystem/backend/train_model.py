import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_diabetic_retinopathy_model():
    """Train model using the provided Excel dataset"""
    
    # Load dataset
    dataset_path = '../data/18_features.xlsx'
    
    try:
        print(f"Loading dataset from {dataset_path}...")
        data = pd.read_excel(dataset_path)
        print(f"Dataset loaded successfully. Shape: {data.shape}")
        print(f"Columns: {list(data.columns)}")
        
    except Exception as e:
        print(f"Error loading Excel file: {e}")
        print("Using fallback CSV data...")
        
        # Fallback sample data
        data = pd.DataFrame({
            'exudates_count': np.random.randint(0, 10, 500),
            'hemorrhages_count': np.random.randint(0, 15, 500),
            'microaneurysms_count': np.random.randint(0, 20, 500),
            'vessel_tortuosity': np.random.uniform(0, 1, 500),
            'faz_area': np.random.uniform(0.1, 0.8, 500),
            'macular_thickness': np.random.uniform(200, 400, 500),
            'rnfl_thickness': np.random.uniform(80, 120, 500),
            'deep_feature_1': np.random.uniform(0, 1, 500),
            'deep_feature_2': np.random.uniform(0, 1, 500),
            'deep_feature_3': np.random.uniform(0, 1, 500),
            'age': np.random.randint(30, 80, 500),
            'systolic_bp': np.random.randint(110, 180, 500),
            'diastolic_bp': np.random.randint(70, 110, 500),
            'fasting_glucose': np.random.uniform(80, 200, 500),
            'hba1c': np.random.uniform(5, 12, 500),
            'diabetes_duration': np.random.randint(0, 30, 500),
            'history_hypertension': np.random.randint(0, 2, 500),
            'visual_acuity': np.random.uniform(0.1, 1.0, 500),
            'retinal_disorder': np.random.randint(0, 2, 500)
        })
    
    # Handle missing values and convert text to numeric
    data = data.fillna(0)
    
    # Convert text values to numeric
    for col in data.columns:
        if data[col].dtype == 'object':
            data[col] = pd.to_numeric(data[col].replace({'Yes': 1, 'No': 0, 'Male': 1, 'Female': 0}), errors='coerce')
    
    data = data.fillna(0)
    
    # Create target variable if not present
    if 'severity' not in data.columns and 'target' not in data.columns:
        print("Creating target variable based on risk factors...")
        risk_score = (
            data.get('exudates_count', 0) * 0.3 + 
            data.get('hemorrhages_count', 0) * 0.25 + 
            data.get('microaneurysms_count', 0) * 0.2 + 
            (data.get('age', 50) > 60).astype(int) * 0.15 + 
            (data.get('hba1c', 6) > 7).astype(int) * 0.1
        )
        data['severity'] = pd.cut(risk_score, bins=3, labels=[0, 1, 2])
    
    # Prepare features and target
    target_col = 'severity' if 'severity' in data.columns else 'target'
    X = data.drop(target_col, axis=1)
    y = data[target_col]
    
    print(f"Features shape: {X.shape}")
    print(f"Target distribution:\n{y.value_counts()}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model Accuracy: {accuracy:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and scaler
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, 'model/dr_model.pkl')
    joblib.dump(scaler, 'model/scaler.pkl')
    
    print("Model and scaler saved successfully!")
    return model, scaler

if __name__ == "__main__":
    train_diabetic_retinopathy_model()