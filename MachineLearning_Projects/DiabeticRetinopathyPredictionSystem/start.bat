@echo off
echo Starting Diabetic Retinopathy Prediction System...

echo.
echo Installing dependencies...
call npm install
cd frontend && call npm install && cd ..
cd backend && pip install -r requirements.txt && cd ..

echo.
echo Setting up database...
node database/mongo_setup.js

echo.
echo Starting services...
echo.
echo Please open 3 separate terminals and run:
echo 1. npm start                    (Node.js server - port 3001)
echo 2. cd backend && python app.py  (Flask ML API - port 5000)  
echo 3. cd frontend && npm start     (React app - port 3000)
echo.
pause