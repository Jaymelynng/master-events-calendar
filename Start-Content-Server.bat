@echo off
echo Starting local web server on port 9000...
echo.

REM Try Python's http.server first (preferred method)
python -c "import http.server; import socketserver; import os; os.chdir('.'); server = socketserver.TCPServer(('', 9000), http.server.SimpleHTTPRequestHandler); print('Server running at http://localhost:9000/'); server.serve_forever()" 2>nul

REM If Python fails, try Node's npx serve as fallback
if %errorlevel% neq 0 (
    echo Python server failed, trying Node serve...
    npx serve -s . -l 9000
)

REM If both fail, show error message
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Could not start server. Please ensure you have either:
    echo 1. Python installed, or
    echo 2. Node.js installed
    echo.
    pause
) 