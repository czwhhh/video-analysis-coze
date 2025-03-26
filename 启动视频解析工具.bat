@echo off
chcp 65001 > nul
title 视频解析工具启动器
echo ========================================
echo        视频解析工具一键启动程序
echo ========================================
echo.
echo 正在启动视频解析工具...
echo 请不要关闭此窗口，应用程序正在运行中...
echo.

:: 设置项目目录
set "PROJECT_DIR=%~dp0"

:: 切换到项目目录
cd /d "%PROJECT_DIR%"

:: 检查是否已经安装依赖
if not exist "node_modules" (
  echo 首次运行，正在安装依赖...
  echo 这可能需要几分钟时间，请耐心等待...
  call npm install
  if %errorlevel% neq 0 (
    echo 安装依赖失败，请检查是否已安装Node.js
    echo 请访问https://nodejs.org/下载安装Node.js后再运行此程序
    pause
    exit /b 1
  )
)

:: 检查是否已经构建
if not exist ".next" (
  echo 正在构建项目...
  call npm run build
  if %errorlevel% neq 0 (
    echo 构建项目失败
    pause
    exit /b 1
  )
)

:: 设置默认端口
set "PORT=3000"
echo 正在使用端口: %PORT%

:: 启动应用
echo 正在启动应用服务器...
echo 启动命令: npm run start

:: 设置环境变量并启动应用
call npm run start

:: 如果运行失败，给出提示
if %errorlevel% neq 0 (
  echo.
  echo 应用启动失败，请尝试手动运行以下命令：
  echo npm run start
  echo.
  pause
  exit /b 1
)

:: 等待应用启动
echo 等待服务器启动...
timeout /t 5 /nobreak > nul

:: 打开浏览器
start http://localhost:%PORT%

:: 显示使用说明
echo.
echo =============================================
echo 视频解析工具已启动！
echo.
echo 请访问: http://localhost:%PORT%
echo.
echo 如需停止运行，请关闭此窗口
echo =============================================
echo 按任意键关闭应用...

:: 保持窗口开启直到用户按下任意键
pause > nul

:: 关闭所有npm进程
echo 正在关闭应用...
taskkill /f /im node.exe > nul 2>&1
echo 应用已关闭，感谢使用！
timeout /t 3 > nul 