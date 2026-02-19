@echo off
REM Safe Commit Batch Wrapper
REM Usage: safe-commit "Your commit message"

if "%1"=="" (
    echo Usage: safe-commit "Your commit message"
    echo Example: safe-commit "Fixed icon system"
    exit /b 1
)

cd /d "%~dp0"
pwsh -NoProfile -ExecutionPolicy Bypass -File "safe-commit.ps1" -Message %*
