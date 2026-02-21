@echo off
REM UI Redesign Testing Script (Windows PowerShell)
REM Usage: Run this script after making changes to capture screenshots

echo.
echo ====================================
echo  UI Redesign Testing Script
echo ====================================
echo.

if "%1"=="" (
    echo Usage: run-tests.bat [test-name]
    echo.
    echo Examples:
    echo   run-tests.bat                    (Run all UI redesign tests)
    echo   run-tests.bat Header             (Run only Header tests)
    echo   run-tests.bat Template           (Run only Template tests)
    echo   run-tests.bat Button             (Run only Button tests)
    echo.
    echo Starting all UI redesign tests...
    echo.
    npm run test:e2e -- e2e/ui-redesign.spec.ts
) else (
    echo Running test: %1
    npm run test:e2e -- e2e/ui-redesign.spec.ts --grep "%1"
)

echo.
echo ====================================
echo  Screenshots saved to:
echo  design-testing/current-v2-light/
echo ====================================
echo.
echo Opening screenshot folder...
explorer design-testing\current-v2-light\
