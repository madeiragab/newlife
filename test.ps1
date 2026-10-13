& (Join-Path $PSScriptRoot 'build.ps1')
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe","$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$prof = Join-Path $env:TEMP "ov-edge-prof"
$url = "file:///" + ((Resolve-Path (Join-Path $PSScriptRoot 'outra-vida.html')).Path -replace '\\','/') + "#teste"
$out = Join-Path $env:TEMP 'ov-dom.txt'
Start-Process -FilePath $edge -ArgumentList @('--headless=new','--disable-gpu',"--user-data-dir=$prof",'--virtual-time-budget=120000','--dump-dom',$url) -RedirectStandardOutput $out -RedirectStandardError (Join-Path $env:TEMP 'ov-err.txt') -Wait
$dom = Get-Content $out -Raw -Encoding UTF8
if ($dom -match '(?s)<pre id="out"[^>]*>(.*?)</pre>') { $t=$matches[1] -replace '&gt;','>' -replace '&lt;','<' -replace '&amp;','&' -replace '&quot;','"'; $t.Substring(0,[Math]::Min([int]$args[0],$t.Length)) } else { 'SEM SAIDA DE TESTE' }
