// Acontecimentos grandes puxam a história certa, em vez de esperar o sorteio anual das cadeias.
chain('tratamento_cancer',{k:'Saúde',min:18,max:110,when:m=>m.dis.some(d=>d.k!==false&&CANCERS.has(d.id)),gap:[1,1]},{
 a:['A notícia','O médico falou devagar, como quem já disse aquilo muitas vezes. Saí do consultório com um papel na mão e o mundo girando.',['Contar para a família na mesma noite|h-4 >b|Ninguém sabia o que dizer. Só nos abraçamos.','Guardar só para mim por enquanto|h-8 >c|Fingi que estava tudo bem no jantar.']],
 b:['Não estou sozinh{o}','A família se organizou: um leva às consultas, outro faz a comida, outro só fica do lado.',['Aceitar a ajuda|h+8 >d|Aprendi que deixar cuidarem de mim também é coragem.','Insistir em fazer tudo sozinh{o}|h-3 >d|Orgulho pesa mais que a quimioterapia.']],
 c:['O segredo pesa','Esconder o diagnóstico está ficando mais difícil que o tratamento.',['Contar finalmente|h+6 >b|Choraram, brigaram comigo por ter escondido e depois não saíram mais do meu lado.','Procurar um grupo de apoio|$-200 h+6 >d|Gente desconhecida que entende tudo sem eu explicar.']],
 d:['O espelho','O cabelo caiu de vez. Olhei no espelho por muito tempo.',['Raspar o resto e rir disso|h+6|Comprei um lenço colorido e um boné engraçado.','Chorar e seguir|h+2|Cabelo cresce. Eu estou aqui.']],
});
function encadear(id,chance=1){const m=S.me;if(!CHAINS[id]||S.scen||!m.alive||!R.chance(chance)||!cadStart(id))return false;const eid=cadEv(id,'a'),ev=EVENTS[eid];if(ev.when(m)&&!S.pending.some(e=>e.id===eid))queue(eid,ev.prep(m));return true;}
retire=(o=>function(){const r=o.apply(this,arguments);if(S.me.ret)encadear('hobby_velhice',.7);return r;})(retire);
divorce=(o=>function(p){const r=o.apply(this,arguments);encadear('terapia',.3);return r;})(divorce);
NL_GANCHOS_ANO.push(()=>{const m=S.me,e=m.encadeados||(m.encadeados={});
 for(const p of S.people.filter(p=>!p.alive&&p.rel==='conjuge'&&!e['viuvez'+p.id])){e['viuvez'+p.id]=S.year;encadear('viuvez');}
 for(const p of S.people.filter(p=>p.alive&&p.rel==='neto'&&p.age<=1&&!e['neto'+p.id])){e['neto'+p.id]=S.year;encadear('neto',.6);}
 for(const d of m.dis.filter(d=>d.k!==false&&CANCERS.has(d.id)&&!e['cancer'+d.id])){e['cancer'+d.id]=S.year;encadear('tratamento_cancer');}
});
function encadeamentosSelfTest(){const s0=S,meta0=JSON.stringify(META),snaps0=SNAPS,rf=R.f,ns=window.NO_SAVE;let seed=515;R.f=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const ok=(v,t)=>{if(!v)throw new Error(t);};try{window.NO_SAVE=true;newLife({country:'BR'});const m=S.me;m.age=60;m.born=S.year-60;S.pending=[];
 const c=mkPerson({rel:'conjuge',gender:m.gender==='M'?'F':'M',age:60,bond:80});c.alive=false;S.people.push(c);for(const f of NL_GANCHOS_ANO)f();ok(cadState().on.viuvez&&S.pending.some(x=>x.id===cadEv('viuvez','a')),'viuvez não encadeou');
 const antes=S.pending.length;for(const f of NL_GANCHOS_ANO)f();ok(S.pending.filter(x=>x.id===cadEv('viuvez','a')).length===1&&S.pending.length>=antes,'viuvez repetida');
 ok(encadear('nao_existe')===false,'cadeia inexistente');S.scen={id:'zumbi'};ok(encadear('hobby_velhice')===false,'encadeou em modo fictício');S.scen=null;
 ok(!cadLigacoesAudit().length,'ligação para história inexistente: '+cadLigacoesAudit().join(', '));cadState().done.primeiro_amor=1;cadLigar('primeiro_amor');ok(cadState().prox&&cadState().prox.app_namoro,'ligação não registrada');
 return {viuvez:true,ligacoes:Object.keys(CAD_LIGACOES).length};}finally{S=s0;META=JSON.parse(meta0);SNAPS=snaps0;R.f=rf;window.NO_SAVE=ns;}}
// Uma história terminada deixa as continuações naturais mais prováveis nos anos seguintes.
// Elas só começam quando a idade e a situação permitem (as mesmas regras do sorteio normal).
const CAD_LIGACOES={
 primeiro_amor:['ex_volta','amor_antigo','app_namoro'],festa_proibida:['cigarro_turma','alcool_social'],canal_video:['amizade_online','celebridade_encontro','stand_up'],
 professor_mentor:['vestibular','feira_ciencias','bolsa_faculdade'],cola_prova:['vestibular','mentira_curriculo'],primeiro_emprego:['bico_entrega','divida_cartao','startup'],
 rival_notas:['vestibular','intercambio_escola'],cigarro_turma:['alcool_social','dieta','academia'],irmao_problema:['irmao_divida','amigo_trafico'],grafite:['fotografia','tatuagem'],
 banda_igreja:['coral_adulto','violao_velho'],app_namoro:['pedido','golpe_internet'],pedido:['casamento_simples','sogra','bebe_planejado'],sogra:['crise_casamento','natal_familia'],
 crise_casamento:['terapia','traicao_parceiro','casa_propria'],bebe_planejado:['filho_pequeno','noite_hospital'],amor_antigo:['casamento_simples'],amizade_rachada:['padrinho_casamento','startup'],
 filho_adolescente:['filho_volta'],filho_volta:['neto'],cuidar_pai:['segredo_familia','terapia'],irmao_divida:['agiota','casamento_irmao'],segredo_familia:['reencontro_pai','terapia'],
 horta:['associacao','jardim'],abrigo:['pet_adulto','animal_perdido'],maratona:['academia','dieta'],livro:['idioma','fotografia'],exame_alerta:['dieta','maratona','cirurgia_risco'],
 associacao:['ponte_bairro','voluntariado_enchente'],incendio:['heroi_acidental','voluntario_hospital'],coral_adulto:['stand_up'],voluntario_hospital:['doacao_sangue','doacao_medula'],
 mudar_cidade:['vizinho_misterioso','casa_propria'],food_truck:['restaurante','concurso_culinaria'],agiota:['policial_corrupto','testemunha'],carteira_achada:['testemunha'],
 loteria:['cripto','bolsa_valores'],piramide:['golpe_internet','bolsa_valores'],testemunha:['jurado'],heranca_tio:['imovel','casa_propria'],imovel:['casa_praia'],
 bico_entrega:['emprego_sonho','negocio_lado'],cripto:['bolsa_valores','golpe_internet'],gremio:['associacao'],vestibular:['republica_estudantil','bolsa_faculdade'],
 republica_estudantil:['tcc','intercambio_escola'],tcc:['emprego_sonho','mentor_carreira'],intercambio_escola:['intercambio_trabalho','idioma'],bolsa_faculdade:['tcc'],
 bilhete_errado:['pedido'],emprego_sonho:['headhunter','sindrome_impostor'],bolsa_valores:['imovel'],cirurgia_risco:['maratona'],mentira_curriculo:['emprego_sonho'],
 noite_hospital:['filho_pequeno'],filho_pequeno:['filho_adolescente'],casamento_irmao:['padrinho_casamento','natal_familia'],avos_historias:['espelho_avo'],gemeos:['filho_pequeno'],
 mudanca_familia:['valentao'],cao_rua:['abrigo','pet_adulto'],vizinho_oficina:['carro_velho'],valentao:['rival_notas'],feira_ciencias:['professor_mentor','vestibular'],
 amigo_infancia:['padrinho_casamento'],violao_velho:['banda_igreja','coral_adulto'],cofrinho:['primeiro_emprego','bolsa_valores'],arvore_avo:['jardim','horta'],
 time_bairro:['maratona','academia'],biblioteca:['livro'],acampamento:['trilha'],briga_pais:['divorcio_pais_adulto'],republica:['startup','casa_propria'],startup:['negocio_lado','headhunter'],
 mochilao:['intercambio_trabalho','aurora_boreal'],divida_cartao:['agiota','bolsa_valores'],academia:['maratona'],golpe_internet:['golpe_idoso'],vizinho_barulhento:['associacao'],
 carro_velho:['acidente_carro'],ex_volta:['pedido'],pet_adulto:['abrigo'],intercambio_trabalho:['emprego_exterior','idioma'],amigo_trafico:['policial_corrupto'],briga_bar:['alcool_social'],
 heroi_acidental:['doacao_sangue'],meia_idade:['faculdade_tardia','hobby_velhice','casa_praia'],aposentadoria:['hobby_velhice','golpe_idoso'],reencontro_turma:['amor_antigo'],
 viuvez:['hobby_velhice','visita_sonho','sessao_espirita'],amigo_doente:['sessao_espirita'],alcool_social:['terapia'],celular_vicio:['meditacao'],dieta:['academia'],sindrome_impostor:['terapia'],
 restaurante:['concurso_culinaria'],aurora_boreal:['fotografia'],jardim:['horta'],idioma:['intercambio_trabalho'],casa_propria:['casa_praia','vizinho_barulhento'],trilha:['lenda_curupira'],
 chefe_abusivo:['processo_trabalhista','terapia','mudar_carreira'],fraude_empresa:['testemunha'],headhunter:['emprego_exterior'],romance_trabalho:['pedido'],erro_grave:['sindrome_impostor'],
 estagiario:['mentor_carreira'],negocio_lado:['startup','food_truck'],demissao_massa:['mudar_carreira','bico_entrega'],acidente_trabalho:['processo_trabalhista'],emprego_exterior:['idioma'],
 terapia:['meditacao'],casamento_simples:['bebe_planejado','sogra'],caso_extra:['crise_casamento'],traicao_parceiro:['terapia'],tratamento_cancer:['terapia','voluntario_hospital'],
 casa_assombrada:['poltergeist','investigador_podcast'],tabuleiro_ouija:['sessao_espirita'],cemiterio_aposta:['estrada_fantasma'],sonho_premonitorio:['medium'],casa_bruxa:['maldicao_cigana'],
 anel_maldito:['pacto_encruzilhada'],medium:['sessao_espirita'],poltergeist:['investigador_podcast'],investigador_podcast:['ninho_vampiros'],
 vamp_noite:['vamp_banco_sangue','vamp_doador'],vamp_doador:['vamp_sede_crise'],vamp_amor_humano:['vamp_casamento','vamp_bebe'],vamp_espelho:['vamp_identidade'],vamp_identidade:['vamp_colecao'],
 vamp_cria:['vamp_ensinar'],vamp_cacadora:['vamp_policia'],vamp_tedio:['vamp_alma'],cla_vampiro:['vamp_ancestral'],
 lobo_trabalho:['lobo_controle'],lobo_par:['lobo_casamento_lua'],lobo_alcateia_lider:['lobo_ritual_alcateia'],alcateia:['lobo_alcateia_lider'],lobo_filhote:['lobo_filho'],
 lobo_prata:['lobo_cacadores_familia'],lobo_vizinho_desconfia:['lobo_policia_suspeito'],lobo_cura:['lenda_cura']};
function cadLigar(id){const st=cadState(),l=(CAD_LIGACOES[id]||[]).filter(x=>CHAINS[x]&&!st.on[x]&&(!st.done[x]||CHAINS[x].o.rep));if(!l.length)return;st.prox||(st.prox={});for(const x of l)st.prox[x]=S.year;}
function cadLigacoesAudit(){const erros=[];for(const [a,l] of Object.entries(CAD_LIGACOES)){if(!CHAINS[a])erros.push('origem '+a);for(const b of l)if(!CHAINS[b])erros.push(a+' → '+b);}return erros;}
