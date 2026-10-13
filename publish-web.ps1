# Atualiza a versão de navegador (GitHub Pages): monta o jogo e publica como index.html na branch gh-pages.
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
& (Join-Path $root 'build.ps1') | Out-Null
$remote = (git -C $root remote get-url origin)
$tmp = Join-Path $env:TEMP 'newlife-pages'
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
git clone -q --branch gh-pages --single-branch $remote $tmp
Copy-Item (Join-Path $root 'outra-vida.html') (Join-Path $tmp 'index.html') -Force
Push-Location $tmp
git add -A
git commit -q -m "Atualiza a versão do navegador"
git push -q origin gh-pages
Pop-Location
Remove-Item $tmp -Recurse -Force
"Publicado. Em alguns minutos a nova versão aparece no GitHub Pages."
