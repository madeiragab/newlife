# Atualiza a versão de navegador (GitHub Pages): monta o jogo e publica como index.html na branch gh-pages.
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
& (Join-Path $root 'build.ps1') | Out-Null
$remote = (git -C $root remote get-url origin)
$tmp = Join-Path $env:TEMP 'newlife-pages'
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
git clone -q --branch gh-pages --single-branch $remote $tmp
Copy-Item (Join-Path $root 'outra-vida.html') (Join-Path $tmp 'index.html') -Force
# os apps (Android e Windows) baixam app.html quando version.json mostra uma versão mais nova que a deles
Copy-Item (Join-Path $root 'desktop\outra-vida.html') (Join-Path $tmp 'app.html') -Force
$nlv = [regex]::Match([IO.File]::ReadAllText((Join-Path $root 'outra-vida.html')), "NL_VER='(\d+)'").Groups[1].Value
[IO.File]::WriteAllText((Join-Path $tmp 'version.json'), "{`"v`":`"$nlv`"}", (New-Object System.Text.UTF8Encoding $false))
Push-Location $tmp
git add -A
$msg = Join-Path $env:TEMP 'newlife-msg.txt'
[IO.File]::WriteAllText($msg, "Atualiza a vers$([char]0xE3)o do navegador`n", (New-Object System.Text.UTF8Encoding $false))
git commit -q -F $msg
git push -q origin gh-pages
Pop-Location
Remove-Item $tmp -Recurse -Force
"Publicado. Em alguns minutos a nova vers$([char]0xE3)o aparece no GitHub Pages."
