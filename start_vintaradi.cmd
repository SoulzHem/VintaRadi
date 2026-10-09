@echo off
setlocal
cd /d "%~dp0"

where node.exe >nul 2>&1
if errorlevel 1 (
    echo [HATA] Node.js bulunamadi. Node.js 18 veya uzeri kurun.
    pause
    exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
    echo Bagimliliklar yukleniyor...
    call npm.cmd install --no-audit --no-fund
    if errorlevel 1 (
        echo [HATA] Bagimliliklar yuklenemedi.
        pause
        exit /b 1
    )
)

start "" "http://localhost:3000"
call npm.cmd run dev
endlocal
