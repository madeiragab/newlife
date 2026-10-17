# Build e simulação completa em Edge real, com progresso e relatório preservado.
$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'build.ps1')
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe","$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge não encontrado.' }
$results=Join-Path $PSScriptRoot 'test-results'
New-Item -ItemType Directory -Force $results | Out-Null
node (Join-Path $PSScriptRoot 'tools/test-receipt.cjs') prepare
if ($LASTEXITCODE -ne 0) { exit 1 }
$env:NL_REPORT_LIMIT=if($args.Count -gt 0){[string]$args[0]}else{'3000'}
node (Join-Path $PSScriptRoot 'tools/test-browser.cjs') $edge (Join-Path $PSScriptRoot 'desktop/outra-vida.html') (Join-Path $results 'relatorio.txt')
if ($LASTEXITCODE -ne 0) { exit 1 }
node (Join-Path $PSScriptRoot 'tools/test-receipt.cjs') write
if ($LASTEXITCODE -ne 0) { exit 1 }
exit 0
