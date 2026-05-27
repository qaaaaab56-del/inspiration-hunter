@echo off
chcp 65001 >nul 2>&1
title 停止灵感猎人

echo.
echo 正在停止 灵感猎人...

:: Kill process on port 5173 (Vite frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a 2>nul
)

:: Kill process on port 3001 (Express backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a 2>nul
)

echo 已停止所有服务。
timeout /t 1 >nul
exit
