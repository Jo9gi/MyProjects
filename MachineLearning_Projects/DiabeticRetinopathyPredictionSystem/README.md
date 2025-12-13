# Diabetic Retinopathy Prediction System

A comprehensive web application for predicting diabetic retinopathy using machine learning, built with React, Node.js, Flask, and MongoDB.

## 🏗️ Architecture

- **Frontend**: React with TailwindCSS
- **Backend API**: Node.js + Express (Authentication & User Management)
- **ML Backend**: Python Flask (Model Training & Predictions)
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens with role-based access

## 📁 Project Structure

```
DiabeticRetinopathyPredictionSystem/
├── backend/                 # Python Flask ML backend
│   ├── app.py              # Main Flask application
│   ├── model/              # ML models and training scripts
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   ├── public/
│   └── package.json
├── database/               # Database setup
│   └── mongo_setup.js
├── data/                   # Training dataset
│   └── dataset.csv
├── server.js              # Node.js Express server
├── package.json           # Node.js dependencies
└── .env.example           # Environment variables template
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB Atlas account

### 1. Clone and Install Dependencies

```bash
# Install all dependencies
npm run install-all
```

### 2. Environment Setup

```bash
# The .env file is already configured with your MongoDB URI:
MONGO_URI=mongodb+srv://Joginaidu:<db_password>@diabetic0.jtaic8x.mongodb.net/?retryWrites=true&w=majority&appName=Diabetic0

# Replace <db_password> with your actual MongoDB password
```

### 3. Database Setup

```bash
# Setup MongoDB collections and default doctor account
node database/mongo_setup.js
```

### 4. Start Services

**Terminal 1 - Node.js Server:**
```bash
npm start
# Runs on http://localhost:3001
```

**Terminal 2 - Python ML Backend:**
```bash
cd backend
# Start the ML API server
python app.py
# Runs on http://localhost:6000
```

**Terminal 3 - React Frontend:**
```bash
cd frontend-new
npm start
# Runs on http://localhost:3000
```

## 👥 User Accounts

### Default Doctor Account
- **Email**: doctor@example.com
- **Password**: password
- **Role**: Doctor (Admin access)

### Patient Registration
- Patients can sign up through the web interface
- Role: Patient (Standard access)

## 🔧 Features

### For Patients
- ✅ User registration and login
- ✅ Input clinical data for prediction
- ✅ View diabetic retinopathy risk assessment
- ✅ Risk levels: Low, Medium, High

### For Doctors
- ✅ Admin panel access
- ✅ View all patient records
- ✅ Perform predictions for patients
- ✅ Role-based authentication

### ML Model Features
- ✅ Random Forest classifier
- ✅ 19 clinical features including:
  - Retinal features (exudates, hemorrhages, microaneurysms)
  - OCT measurements (macular thickness, RNFL thickness)
  - Patient demographics (age, diabetes duration)
  - Vital signs (blood pressure, glucose levels)
- ✅ Automatic model training with sample data
- ✅ Real-time predictions via REST API

## 🔌 API Endpoints

### Authentication (Node.js - Port 3001)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/patients` - Get all patients (Doctor only)

### ML Predictions (Flask - Port 6000)
- `POST /predict` - Get diabetic retinopathy prediction
- `POST /train` - Retrain ML model
- `GET /health` - Health check

## 📊 Input Features

The system accepts the following clinical parameters:

| Feature | Description | Type |
|---------|-------------|------|
| exudates_count | Number of exudates detected | Integer |
| hemorrhages_count | Number of hemorrhages detected | Integer |
| microaneurysms_count | Number of microaneurysms detected | Integer |
| vessel_tortuosity | Vessel tortuosity measurement | Float (0-1) |
| faz_area | Foveal avascular zone area | Float |
| macular_thickness | Macular thickness (μm) | Float |
| rnfl_thickness | Retinal nerve fiber layer thickness | Float |
| deep_feature_1-3 | Deep learning extracted features | Float (0-1) |
| age | Patient age | Integer |
| systolic_bp | Systolic blood pressure | Integer |
| diastolic_bp | Diastolic blood pressure | Integer |
| fasting_glucose | Fasting glucose level | Float |
| hba1c | HbA1c percentage | Float |
| diabetes_duration | Years with diabetes | Integer |
| history_hypertension | Hypertension history (0/1) | Binary |
| visual_acuity | Visual acuity measurement | Float (0-1) |
| retinal_disorder | Other retinal disorders (0/1) | Binary |

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ CORS protection
- ✅ Input validation

## 🚀 Deployment

### Local Development
Follow the installation steps above.

### Production Deployment
1. Set up MongoDB Atlas cluster
2. Deploy Node.js server to cloud platform (Heroku, AWS, etc.)
3. Deploy Flask app to Python hosting service
4. Deploy React frontend to static hosting (Netlify, Vercel)
5. Update API endpoints in frontend configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository.