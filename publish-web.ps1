# Publica usando os bytes exatos do Git no manifesto.
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if ($env:NL_TESTED -ne '1') {
 & (Join-Path $root 'test.ps1') 400 | Out-Host
 if ($LASTEXITCODE -ne 0) { throw 'Teste falhou.' }
}
& (Join-Path $root 'build.ps1') | Out-Null
$remote = git -C $root remote get-url origin
$tmp = Join-Path $env:TEMP ('newlife-pages-' + [guid]::NewGuid().ToString('N'))
git clone -q --branch gh-pages --single-branch $remote $tmp
if ($LASTEXITCODE) { throw 'Clone falhou.' }
Copy-Item (Join-Path $root 'outra-vida.html') (Join-Path $tmp 'index.html')
Copy-Item (Join-Path $root 'desktop/outra-vida.html') (Join-Path $tmp 'app.html')
Push-Location $tmp
try {
 git add index.html app.html
 node (Join-Path $root 'tools/update-manifest.cjs')
 if ($LASTEXITCODE) { throw 'Manifesto falhou.' }
 git add version.json
 git commit -m 'Publica jogo e manifesto de integridade'
 if ($LASTEXITCODE) { throw 'Commit falhou.' }
 git push origin gh-pages
 if ($LASTEXITCODE) { throw 'Publicação falhou.' }
} finally { Pop-Location }
"Publicado. Checkout preservado em $tmp."
