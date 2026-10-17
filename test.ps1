# Teste automático: monta o jogo, roda o #teste no Edge sem janela e mostra o relatório.
# Termina com código 1 (falha) se houver qualquer erro ou se o teste não rodar. Uso: .\test.ps1 [limite de caracteres do relatório]
$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'build.ps1')
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe","$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { 'FALHOU: Microsoft Edge não encontrado'; exit 1 }
$prof = Join-Path $env:TEMP "ov-edge-prof"
# usa a página com as fontes embutidas (a mesma dos apps): sem internet, o Edge não fica esperando a fonte do Google
$page = Join-Path $env:TEMP 'ov-teste.html'
$html = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'desktop\outra-vida.html'), [Text.Encoding]::UTF8).Replace('<script>window.DESKTOP=1</script>', '')
[IO.File]::WriteAllText($page, $html, (New-Object Text.UTF8Encoding $false))
$url = "file:///" + ($page -replace '\\','/') + "#teste"
$out = Join-Path $env:TEMP 'ov-dom.txt'
if (Test-Path $out) { Remove-Item $out -Force }
$p = Start-Process -FilePath $edge -ArgumentList @('--headless=new','--disable-gpu',"--user-data-dir=$prof",'--virtual-time-budget=120000','--dump-dom',$url) -RedirectStandardOutput $out -RedirectStandardError (Join-Path $env:TEMP 'ov-err.txt') -PassThru
# o Edge às vezes fica preso com a simulação ampliada: o limite de execução é de 6 minutos
if (-not $p.WaitForExit(360000)) { try { $p.Kill() } catch {} ; 'FALHOU: o teste não terminou em 6 minutos'; exit 1 }
$dom = if (Test-Path $out) { Get-Content $out -Raw -Encoding UTF8 } else { '' }
if ($dom -notmatch '(?s)<pre id="out"[^>]*>(.*?)</pre>') { 'FALHOU: SEM SAIDA DE TESTE (o jogo não chegou a rodar o teste)'; exit 1 }
$t = $matches[1] -replace '&gt;','>' -replace '&lt;','<' -replace '&quot;','"' -replace '&amp;','&'
if ($args.Count -gt 0 -and [int]$args[0] -gt 0) { $t.Substring(0,[Math]::Min([int]$args[0],$t.Length)) } else { $t }
$m = [regex]::Match($t, 'ERROS: (\d+)')
if (-not $m.Success) { 'FALHOU: relatório sem a linha ERROS'; exit 1 }
if ([int]$m.Groups[1].Value -gt 0) { "FALHOU: $($m.Groups[1].Value) erro(s)"; exit 1 }
'PASSOU: 0 erros'
exit 0
