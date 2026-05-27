@echo off
chcp 65001 >nul 2>&1
title 灵感猎人 - 手机访问模式
cd /d "%~dp0"

echo.
echo   ╔══════════════════════════════════╗
echo   ║   灵感猎人 - 手机安装模式        ║
echo   ╚══════════════════════════════════╝
echo.

:: Check if services are already running
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/2] 启动服务...
    start "InspirationHunter-Server" cmd /c "cd /d %~dp0 && node --import tsx/esm server/src/index.ts"
    timeout /t 3 >nul
    start "InspirationHunter-Client" cmd /c "cd /d %~dp0client && node ../node_modules/vite/bin/vite.js --host"
    echo 等待服务就绪...
    timeout /t 5 >nul
) else (
    echo [1/2] 服务已在运行
)

echo.
echo [2/2] 创建公网隧道...
echo.
echo 手机浏览器打开以下地址即可访问和安装:
echo.

:: Use localtunnel to expose port 5173
npx localtunnel --port 5173

echo.
echo 隧道已关闭。
pause
