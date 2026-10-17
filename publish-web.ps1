# Publica usando os bytes exatos do Git no manifesto.
param([switch]$ReuseTest,[switch]$PrepareOnly)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if (-not $ReuseTest) {
 & (Join-Path $root 'test.ps1') 400 | Out-Host
 if ($LASTEXITCODE -ne 0) { throw 'Teste falhou.' }
}
node (Join-Path $root 'tools/test-receipt.cjs') verify
if ($LASTEXITCODE -ne 0) { throw 'Fontes ou artefatos diferentes dos aprovados nos testes.' }
if ($PrepareOnly) {
 node (Join-Path $root 'tools/prepare-pages.cjs')
 if ($LASTEXITCODE -ne 0) { throw 'Preparação dos artefatos falhou.' }
 return
}
if ($env:GITHUB_ACTIONS -eq 'true') { throw 'No Actions, use -PrepareOnly e o job de deploy protegido pelos testes.' }
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
