# Dev server manager for vtesitaly.Site (Astro)

$ProjectDir = $PSScriptRoot
$DevProcess = $null

function Start-Dev {
    Write-Host "Avvio Astro dev server..." -ForegroundColor Cyan
    $proc = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectDir'; npm run dev" -PassThru
    return $proc
}

function Stop-ProcessSafe {
    param($proc)
    if ($proc -and -not $proc.HasExited) {
        Write-Host "Terminazione processo $($proc.Id)..." -ForegroundColor Yellow
        taskkill /T /F /PID $proc.Id 2>$null | Out-Null
    }
}

# Install dependencies if needed
Push-Location $ProjectDir
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm ci
    if ($LASTEXITCODE -ne 0) { npm install }
}
Pop-Location

$DevProcess = Start-Dev
Start-Sleep -Seconds 2

while ($true) {
    Clear-Host
    Write-Host "==========================================" -ForegroundColor Magenta
    Write-Host "   VTES Italy Dev Server" -ForegroundColor Magenta
    Write-Host "==========================================" -ForegroundColor Magenta

    $status = if ($DevProcess -and -not $DevProcess.HasExited) { "IN ESECUZIONE ($($DevProcess.Id))" } else { "TERMINATO" }
    Write-Host "Astro: $status" -ForegroundColor $(if ($status -match "IN ESECUZIONE") { "Green" } else { "Red" })
    Write-Host "URL:   http://localhost:4322" -ForegroundColor Cyan
    Write-Host "------------------------------------------"

    $running = $DevProcess -and -not $DevProcess.HasExited

    Write-Host "Seleziona un'azione:" -ForegroundColor Yellow
    if ($running) {
        Write-Host " [R] Riavvia"
        Write-Host " [A] Arresta"
    } else {
        Write-Host " [S] Avvia"
    }
    Write-Host " [Q] Esci"
    Write-Host ""
    Write-Host "Premi un tasto..." -NoNewline

    $key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown").Character.ToString().ToUpper()
    Write-Host ""

    switch ($key) {
        "R" {
            if ($running) {
                Stop-ProcessSafe $DevProcess
                Start-Sleep -Seconds 1
                $DevProcess = Start-Dev
            }
        }
        "A" {
            if ($running) {
                Stop-ProcessSafe $DevProcess
                Write-Host "Dev server arrestato." -ForegroundColor Green
                Start-Sleep -Seconds 1
            }
        }
        "S" {
            if (-not $running) {
                $DevProcess = Start-Dev
            }
        }
        "Q" {
            Write-Host "Chiusura in corso..." -ForegroundColor Cyan
            Stop-ProcessSafe $DevProcess
            exit 0
        }
    }

    Start-Sleep -Milliseconds 500
}
