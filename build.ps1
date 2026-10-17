$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$src = Join-Path $root 'src'
$enc = New-Object System.Text.UTF8Encoding $false
# carimbo de versão (UTC, aaMMddHHmm): os apps comparam com o version.json do site para se atualizar sozinhos
$ver = if ($env:NL_VER) { $env:NL_VER } else { (Get-Date).ToUniversalTime().ToString('yyMMddHHmm') }
function ReadSrc($f) { [IO.File]::ReadAllText((Join-Path $src $f), $enc) }
$css = ReadSrc 'style.css'
$js = (@('data.js','names_data.js','names_more.js','names.js','catalog.js','carsvg.js','icons.js','core.js','events.js','events2.js','events3.js','ev_dsl.js','ev_jobs.js','ev_life.js','ev_world.js','ev_more.js','ev_pets.js','quiz.js','systems.js','shop.js','modes.js','faces.js','ui.js','ui_extra.js','life.js','fight.js','prison.js','careers.js','social.js','seita.js','seita2.js','policia.js','golpe.js','paranormal.js','desistir.js','ev_seita.js','ev_policia.js','ev_policia2.js','ev_para.js','ev_para2.js','ev_golpe.js','ev_golpe2.js','ev_extra14.js','ev_extra14b.js','scen.js','isekai.js','vila.js','zumbi.js','romance.js','heroi.js','cursos.js','formacao.js','comerciantes.js','volta.js','inicios.js','prologo.js','epidemia.js','cadeias.js','cad_infancia.js','cad_adolescencia.js','cad_jovem.js','cad_trabalho.js','cad_amor.js','cad_dinheiro.js','cad_comunidade.js','cad_maturidade.js','cad_justica.js','cad_estudos.js','cad_familia.js','cad_sonhos.js','cad_vida.js','cad_mente.js','cad_extra.js','cad_extra2.js','cad_extra3.js','traicao.js','paranormal2.js','cad_para.js','saude.js','identidade.js','fertilidade.js','poligamia.js','amantes.js','empresas.js','morte_ficcao.js','cad_pg1.js','cad_pg2.js','cad_pg3.js','cad_pg4.js','cad_pg5.js','cad_vamp1.js','cad_vamp2.js','cad_vamp3.js','cad_lobo1.js','cad_lobo2.js','cad_lobo3.js','cad_lobo4.js','equipes.js','membros.js','ev_membros.js','ev_membros2.js','ev_membros3.js','ev_membros4.js','ev_membros5.js','ev_membros6.js','ev_z_base.js','ev_z_fac.js','ev_z_mundo.js','ev_z_vida.js','ev_cid_aurora.js','ev_cid_valmor.js','ev_cid_ferro.js','ev_cid_aerion.js','ev_vila1.js','ev_vila2.js','ev_vila3.js','ev_vila4.js','ev_sc_zumbi.js','ev_sc_zumbi2.js','ev_sc_ilha.js','ev_sc_ilha2.js','ev_sc_isekai.js','ev_sc_isekai2.js','ev_sc_heroi.js','ev_sc_heroi2.js','ev_sc_marte.js','ev_sc_marte2.js','ev_rom.js','ev_heroi3.js','sound.js','minigames.js','brand.js','update.js','atualizando.js','conquistas.js','economia.js','investigacao.js','convivencia.js','iniciativas.js','memorias.js','pessoas_busca.js','economia_limites.js','personalidades.js','criacao.js','mundo_dinamico.js','jornal.js','justica_publica.js','culto_justica.js','repercussao.js','npc_poder.js','origem_dinheiro.js','sucessao.js','opiniao_publica.js','idade_politica.js','estado_animais.js','idade_social.js','mercados.js','mundo_vida.js','empresa_calculo.js','empresas_operacao.js','comercio_mundial.js','jornal_mundial.js','test_economia_mundo.js','test_economia_regressao.js','test_estrategias.js','test_trajetorias.js','relatos.js','leitura.js','navegacao.js','carreira_npc.js','localizacao.js','decisoes_familia.js','cotidiano_idade.js','historico.js','aposentadoria.js','conquistas_familia.js','memoria_peso.js','encadeamentos.js','test_continuidade.js','test_localizacao.js','test_familia_financas.js','test_carreira_npc.js','test_evolucao_geracoes.js','organizar_telas.js','test_geracoes_naturais.js','test.js') | ForEach-Object { ReadSrc $_ }) -join "`n"
$body = ReadSrc 'body.html'
$fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;600;700;800&display=swap">'
$inner = "<title>NewLife</title><script>window.NL_VER='$ver'</script>`n$fonts`n<style>`n$css`n</style>`n$body`n<script>`n$js`nstartApp();`n</script>`n"
[IO.File]::WriteAllText((Join-Path $root 'artifact.html'), $inner, $enc)
$full = "<!doctype html>`n<html lang=`"pt-BR`">`n<head>`n<meta charset=`"utf-8`">`n<meta name=`"viewport`" content=`"width=device-width,initial-scale=1,viewport-fit=cover`">`n<meta name=`"theme-color`" content=`"#22305E`">`n<title>NewLife</title><script>window.NL_VER='$ver'</script>`n$fonts`n<style>`n$css`n</style>`n</head>`n<body>`n$body`n<script>`n$js`nstartApp();`n</script>`n</body>`n</html>`n"
[IO.File]::WriteAllText((Join-Path $root 'outra-vida.html'), $full, $enc)
$fontsInline = ReadSrc 'fonts-inline.css'
$desk = "<!doctype html>`n<html lang=`"pt-BR`">`n<head>`n<meta charset=`"utf-8`">`n<meta name=`"viewport`" content=`"width=device-width,initial-scale=1`">`n<title>NewLife</title><script>window.NL_VER='$ver'</script>`n<script>window.DESKTOP=1</script>`n<style>`n$fontsInline`n$css`n</style>`n</head>`n<body>`n$body`n<script>`n$js`nstartApp();`n</script>`n</body>`n</html>`n"
New-Item -ItemType Directory -Force (Join-Path $root 'desktop') | Out-Null
[IO.File]::WriteAllText((Join-Path $root 'desktop\outra-vida.html'), $desk, $enc)
"ok: " + (Get-Item (Join-Path $root 'outra-vida.html')).Length + " bytes"









