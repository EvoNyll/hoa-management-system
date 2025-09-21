@echo off
echo ===============================================
echo HOA Management System - Quick Start
echo ===============================================
echo.

cd /d "%~dp0"

echo Starting server with automatic fixes...
python start_server.py

pause