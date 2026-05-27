@echo off
chcp 65001 >nul
title 停止灵感猎人

echo.
echo 正在停止 灵感猎人...

:: Kill node processes on port 5173 (Vite)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)

:: Kill node processes on port 3001 (Express)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)

echo 已停止所有服务。
echo.

timeout /t 2 >nul
exit
