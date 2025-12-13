@echo off
echo Starting Diabetic Retinopathy Prediction System...
echo.

echo Starting Node.js server (Port 3001)...
start "Node.js Server" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo Starting Flask ML Backend (Port 6000)...
start "Flask ML Backend" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak >nul

echo Starting React Frontend (Port 3000)...
start "React Frontend" cmd /k "cd frontend-new && npm start"

echo.
echo All services are starting...
echo - Node.js Server: http://localhost:3001
echo - Flask ML API: http://localhost:6000  
echo - React Frontend: http://localhost:3000
echo.
echo Default Doctor Login:
echo Email: doctor@example.com
echo Password: password
echo.
pause