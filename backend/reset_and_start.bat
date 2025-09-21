@echo off
echo ===============================================
echo HOA Management System - Complete Reset
echo ===============================================
echo.

cd /d "%~dp0"

echo Step 1: Resetting database...
python reset_database.py
if errorlevel 1 (
    echo Database reset failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting server...
python start_server.py

pause