$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonExe = Join-Path $repoRoot "backend\venv\Scripts\python.exe"
$bunExe = Join-Path $env:USERPROFILE ".bun\bin\bun.exe"
$backendUrl = "http://127.0.0.1:17493/health"
$webUrl = "http://127.0.0.1:5173"

if (-not (Test-Path $pythonExe)) {
    throw "Python venv not found at $pythonExe. Run setup first."
}

if (-not (Test-Path $bunExe)) {
    throw "Bun not found at $bunExe."
}

$backendRunning = $false
try {
    $null = Invoke-WebRequest -Uri $backendUrl -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    $backendRunning = $true
} catch {
    $backendRunning = $false
}

if ($backendRunning) {
    Write-Host "Backend already running at http://localhost:17493"
} else {
    Write-Host "Starting backend in a new window..."
    Start-Process powershell.exe -WorkingDirectory $repoRoot -ArgumentList @(
        "-NoExit",
        "-Command",
        "& '$pythonExe' -m uvicorn backend.main:app --reload --port 17493"
    ) | Out-Null
}

Write-Host "Starting web app in a new window..."
Start-Process powershell.exe -WorkingDirectory (Join-Path $repoRoot "web") -ArgumentList @(
    "-NoExit",
    "-Command",
    "& '$bunExe' run dev --host 127.0.0.1 --port 5173 --strictPort"
) | Out-Null

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Voicebox launch started."
Write-Host "Backend: http://localhost:17493/docs"
Write-Host "Web UI:  $webUrl"
