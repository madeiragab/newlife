# Gera desktop\outra-vida.html e compila NewLife.exe (ambiente Python fica em %LOCALAPPDATA%\Temp\outravida-build)
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
& (Join-Path $root 'build.ps1') | Out-Null
$B = Join-Path $env:LOCALAPPDATA 'Temp\outravida-build'
if (-not (Test-Path "$B\env\Scripts\pyinstaller.exe")) { New-Item -ItemType Directory -Force $B | Out-Null; python -m venv "$B\env"; & "$B\env\Scripts\python.exe" -m pip install --quiet pywebview pyinstaller pillow }
Copy-Item (Join-Path $root 'desktop\app.py'),(Join-Path $root 'desktop\make_icon.py'),(Join-Path $root 'desktop\outra-vida.html') $B -Force
Push-Location $B
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe","$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$page = (Join-Path $root 'desktop\outra-vida.html') -replace '\\','/'
Start-Process -FilePath $edge -ArgumentList @('--headless=new','--disable-gpu',"--user-data-dir=$env:TEMP\ov-shot-prof",'--hide-scrollbars','--window-size=512,512','--default-background-color=00000000','--virtual-time-budget=9000',"--screenshot=$B\icon-src.png","file:///$page#demo-icone") -Wait -WindowStyle Hidden
& "$B\env\Scripts\python.exe" make_icon.py "$B\icon-src.png" "$B\icon.ico"
cmd /c "`"$B\env\Scripts\pyinstaller.exe`" --noconfirm --onefile --windowed --name NewLife --icon `"$B\icon.ico`" --add-data `"outra-vida.html;.`" app.py > build.log 2>&1"
Get-Content build.log -Tail 1
Pop-Location
Get-Process | Where-Object { $_.MainWindowTitle -eq 'NewLife' } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500
Copy-Item "$B\dist\NewLife.exe" (Join-Path $root 'NewLife.exe') -Force
"exe: " + [math]::Round((Get-Item (Join-Path $root 'NewLife.exe')).Length/1MB,1) + " MB"
