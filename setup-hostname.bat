@echo off
echo =============================================
echo   JobTracker - Professional URL Setup
echo =============================================
echo.
echo Adding jobtracker.local to hosts file...
echo.

:: Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please run this file as RIGHT-CLICK > "Run as Administrator"
    echo.
    pause
    exit /b 1
)

:: Add entry to hosts file
echo 127.0.0.1    jobtracker.local >> C:\Windows\System32\drivers\etc\hosts

echo SUCCESS! Your professional URL is ready:
echo.
echo   Frontend:  http://jobtracker.local:3000
echo   Backend:   http://jobtracker.local:5000
echo.
echo Press any key to exit...
pause >nul
