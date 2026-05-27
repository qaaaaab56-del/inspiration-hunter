@echo off
chcp 65001 >nul
title 灵感猎人 - Inspiration Hunter

cd /d "%~dp0"

echo.
echo   ╔══════════════════════════╗
echo   ║   灵感猎人  Inspiration Hunter   ║
echo   ╚══════════════════════════╝
echo.

if not exist "node_modules" (
    echo [1/2] 正在安装依赖...
    call npm install
    echo.
)

echo [2/2] 启动服务...
echo   前端: http://localhost:5173
echo   后端: http://localhost:3001
echo.
echo 按 Ctrl+C 停止所有服务
echo ─────────────────────────────────
echo.

npm run dev
