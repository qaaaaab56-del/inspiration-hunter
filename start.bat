@echo off
chcp 65001 >nul 2>&1
title 灵感猎人 - Inspiration Hunter
cd /d "%~dp0"

echo.
echo   ╔══════════════════════════════════╗
echo   ║   灵感猎人  Inspiration Hunter   ║
echo   ╚══════════════════════════════════╝
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js:
node --version

:: Install dependencies if needed
if not exist "node_modules" (
    echo.
    echo [1/2] 首次运行，正在安装依赖（约需 1-2 分钟）...
    call npm install --ignore-scripts
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败，请检查网络连接后重试
        pause
        exit /b 1
    )
    echo 依赖安装完成
)

:: Run database migration
echo.
echo [2/2] 检查数据库...
call npm run migrate -w server 2>nul
if %errorlevel% neq 0 (
    echo 正在初始化数据库...
    node --import tsx/esm server/src/db/migrate.ts 2>nul
)

:: Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" 2^>nul') do set LOCAL_IP=%%a
set LOCAL_IP=%LOCAL_IP: =%

echo.
echo ═════════════════════════════════════
echo   前端: http://localhost:5173
if defined LOCAL_IP echo   局域网: http://%LOCAL_IP%:5173
echo   后端: http://localhost:3001
echo ═════════════════════════════════════
echo.
echo 电脑浏览器打开 http://localhost:5173
if defined LOCAL_IP echo 手机浏览器打开 http://%LOCAL_IP%:5173 （需同一WiFi）
echo 手机安装APP: 双击运行 share.bat
echo 按 Ctrl+C 停止所有服务
echo.

npm run dev
