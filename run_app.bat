@echo off
title MetroHealth AI - Enterprise Clinical Station
echo =======================================================================
echo   METROHEALTH CLINICAL AI: EXPLAINABLE DECISION SUPPORT SYSTEM
echo   High-Speed Enterprise React + FastAPI AI Application
echo   NVIDIA NIM Accelerated (meta/llama-3.2-11b-vision-instruct)
echo   DeBERTa-v3 Closed-Loop NLI Guardrail Active
echo =======================================================================
echo.
echo Launching Production Enterprise Server on http://localhost:8000 ...
echo.
start http://localhost:8000
python -m uvicorn server:app --host 0.0.0.0 --port 8000
pause
