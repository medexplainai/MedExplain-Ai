@echo off
title MetroHealth AI - Streamlit Launcher
echo =======================================================================
echo   METROHEALTH CLINICAL AI: Streamlit Version
echo =======================================================================
echo.

set "PY_CMD=python"
if exist "venv\Scripts\python.exe" (
    set "PY_CMD=venv\Scripts\python.exe"
    echo [OK] Using virtual environment: venv
) else if exist ".venv\Scripts\python.exe" (
    set "PY_CMD=.venv\Scripts\python.exe"
    echo [OK] Using virtual environment: .venv
)

echo Starting Streamlit on port 8501 ...
%PY_CMD% -m streamlit run app.py --server.port 8501
pause
