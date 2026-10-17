# Publica pelo workflow protegido; nunca envia HTML diretamente para gh-pages.
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
$dirty=git -C $root status --porcelain --untracked-files=no
if ($dirty) { throw 'Envie as alterações para main antes de solicitar a publicação.' }
$head=git -C $root rev-parse HEAD
$remoteLine=git -C $root ls-remote origin refs/heads/main
if ($LASTEXITCODE -ne 0 -or -not $remoteLine -or ($remoteLine -split '\s+')[0] -ne $head) { throw 'O commit local precisa estar no main remoto.' }
Push-Location $root
try {
 gh workflow run testes.yml --ref main
 if ($LASTEXITCODE -ne 0) { throw 'Não foi possível iniciar o workflow. Confira a autenticação do gh.' }
} finally { Pop-Location }
'Publicação solicitada ao Actions; o site só muda depois da aprovação dos testes remotos.'
