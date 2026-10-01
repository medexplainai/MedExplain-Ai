@echo off
title MetroHealth AI - Enterprise Clinical Station
echo =======================================================================
echo   METROHEALTH CLINICAL AI: EXPLAINABLE DECISION SUPPORT SYSTEM
echo   High-Speed Enterprise React + FastAPI AI Application
echo   NVIDIA NIM Accelerated (meta/llama-3.2-11b-vision-instruct)
echo   DeBERTa-v3 Closed-Loop NLI Guardrail Active
echo =======================================================================
echo.

:: Detect Python executable (prefer active venv if present)
set "PY_CMD=python"
if exist "venv\Scripts\python.exe" (
    set "PY_CMD=venv\Scripts\python.exe"
    echo [OK] Using virtual environment: venv
) else if exist ".venv\Scripts\python.exe" (
    set "PY_CMD=.venv\Scripts\python.exe"
    echo [OK] Using virtual environment: .venv
)

:: Verify critical dependencies (FastAPI, Uvicorn, PyPDF, Docx)
echo [*] Checking dependencies...
%PY_CMD% -c "import fastapi, uvicorn, pypdf, docx" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Missing dependencies detected.
    echo [*] Installing required packages from requirements.txt...
    echo.
    %PY_CMD% -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Automatic pip installation failed.
        echo Please manually run: pip install -r requirements.txt
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies successfully installed!
    echo.
) else (
    echo [OK] All dependencies verified!
)

echo.
echo Launching Production Enterprise Server on http://localhost:8000 ...
echo.
start http://localhost:8000
%PY_CMD% -m uvicorn server:app --host 0.0.0.0 --port 8000
pause
