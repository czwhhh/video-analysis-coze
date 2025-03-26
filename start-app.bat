@echo off
chcp 65001 > nul
title 视频解析工具
echo ========================================
echo         视频解析工具正在启动
echo ========================================
echo.

:: 切换到当前目录
cd /d "%~dp0"

:: 启动应用
echo 正在启动应用...
echo.
echo 请在浏览器中访问: http://localhost:3000
echo.
echo 完成后请按Ctrl+C终止程序
echo ========================================
echo.

npm run dev 