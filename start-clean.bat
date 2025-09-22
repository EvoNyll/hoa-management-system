@echo off
echo Cleaning up HOA Management System processes...

REM Kill any Python processes (backend servers)
echo Stopping backend servers...
taskkill /F /IM python.exe 2>nul

REM Kill any Node.js processes (frontend servers)
echo Stopping frontend servers...
taskkill /F /IM node.exe 2>nul

REM Wait a moment for processes to terminate
timeout /t 3 /nobreak >nul

echo Starting fresh servers...

REM Start backend on port 8000
echo Starting backend server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "python manage.py runserver 127.0.0.1:8000"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend on port 3000
echo Starting frontend server...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo HOA Management System Started!
echo ========================================
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul