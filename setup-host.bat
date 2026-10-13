@echo off
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0""", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

echo =============================================
echo   JobTracker - Professional URL Setup
echo =============================================
echo.

:: Remove old entry if exists
findstr /v "jobtracker" C:\Windows\System32\drivers\etc\hosts > C:\Windows\System32\drivers\etc\hosts.tmp
move /y C:\Windows\System32\drivers\etc\hosts.tmp C:\Windows\System32\drivers\etc\hosts >nul

:: Add new entry
echo. >> C:\Windows\System32\drivers\etc\hosts
echo # JobTracker Application >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1    jobtracker.test >> C:\Windows\System32\drivers\etc\hosts

echo SUCCESS! Your professional URL is ready:
echo.
echo   Frontend:  http://jobtracker.test:3000
echo   Backend:   http://jobtracker.test:5000
echo.
echo Press any key to exit...
pause >nul
