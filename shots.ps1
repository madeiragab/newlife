param([string[]]$Views = @('demo'), [string]$Theme = 'light', [int]$H = 1400)
& (Join-Path $PSScriptRoot 'build.ps1') | Out-Null
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe","$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$page = (Resolve-Path (Join-Path $PSScriptRoot 'desktop\outra-vida.html')).Path -replace '\\','/'
$dir = Join-Path $env:LOCALAPPDATA 'Temp\outravida-build\shots'; New-Item -ItemType Directory -Force $dir | Out-Null
foreach ($v in $Views) {
  $png = Join-Path $dir "$v-$Theme.png"
  $args = @('--headless=new','--disable-gpu',"--user-data-dir=$env:TEMP\ov-shot-prof",'--hide-scrollbars',"--window-size=520,$H",'--virtual-time-budget=9000',"--screenshot=$png")
  if ($Theme -eq 'dark') { $args += '--force-dark-mode'; $args += '--blink-settings=preferredColorScheme=0' } else { $args += '--blink-settings=preferredColorScheme=1' }
  $args += "file:///$page#$v"
  Start-Process -FilePath $edge -ArgumentList $args -Wait -WindowStyle Hidden
  $png
}


