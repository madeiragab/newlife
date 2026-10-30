// ===== 3.2: mais de 200 sons e trilhas por fase e carreira =====
// Cada tipo de cartão tem o seu som, cada tipo de acontecimento do diário também, e a interface (abrir, voltar,
// abas, envelhecer em cada fase, atributos subindo e descendo, ações dos menus) ganhou os seus. Tudo sintetizado.
// A música de fundo muda com a fase da vida e com o que eu sou: investigador, líder de culto, lobisomem,
// presidente, ditador, realeza, preso, criminoso, militar, atleta, músico, herói, zumbis, ilha, Marte…

// ---------- peças para montar sons ----------
const s3a=(t,ns,st,d,w='triangle',v=.06,o=12)=>ns.forEach((n,i)=>sT(N(n+o-12),t+i*st,d,{type:w,vol:v,attack:.004}));
const s3c=(t,ns,d,w='sine',v=.04,at=.02)=>ns.forEach(n=>sT(N(n),t,d,{type:w,vol:v,attack:at}));
const s3w=(t,f1,f2,d,w='sine',v=.06)=>sT(f1,t,d,{type:w,vol:v,slide:f2});
const s3n=(t,d,f,q=1,v=.08,ty='bandpass')=>sNoise(t,d,{vol:v,freq:f,q,type:ty});
const s3k=(t,v=.28)=>sTone(130,t,.2,{vol:v,slide:42});
const s3s=(t,v=.12)=>{ sNoise(t,.13,{vol:v,freq:1900,q:.6}); sTone(210,t,.07,{type:'triangle',vol:v*.4}); };
const s3h=(t,v=.04)=>sNoise(t,.035,{vol:v,freq:9000,q:1,type:'highpass'});
const s3b=(t,n,d=1.4,v=.06)=>[1,2.76,5.4,8.9].forEach((h,i)=>sT(N(n)*h,t,d/(i+1),{vol:v/(i+1.2),attack:.002}));
const s3p=(t,n,v=.07,d=.4)=>{ sT(N(n),t,d,{type:'triangle',vol:v,attack:.002}); sT(N(n)*2,t,d*.4,{type:'sine',vol:v*.25,attack:.002}); };
const s3r=(t,pat,step,fn)=>[...pat].forEach((ch,i)=>{ if(ch!=='.') fn(t+i*step,ch); });
const s3v=(t,d,pts,o)=>sVoz(t,d,pts,o);
const s3bat=(t,pat,step)=>s3r(t,pat,step,(tt,c)=>c==='k'?s3k(tt):c==='s'?s3s(tt):c==='h'?s3h(tt):c==='t'?sTone(180,tt,.15,{vol:.15,slide:90}):0);

Object.assign(SFX,{
 // ===== cartões por tema =====
 k_familia:t=>{ s3a(t,[60,64,67,72],.09,.7); s3c(t+.3,[48,55],1.2,'sine',.04,.2); },
 k_escola:t=>{ s3b(t,76,1.2,.07); s3b(t+.45,72,1.4,.06); },
 k_trabalho:t=>{ s3r(t,'xx.x.xx',.06,tt=>s3n(tt,.03,3200,4,.08)); s3b(t+.5,88,.8,.05); },
 k_religiao:t=>{ s3c(t,[55,62,67,71],2.2,'triangle',.03,.5); s3c(t,[43],2.2,'sine',.06,.5); },
 k_amor:t=>SFX.romance(t),
 k_lobisomem:t=>{ s3v(t,1.6,[[0,300],[.4,500],[1.1,520],[1.6,280]],{vol:.045,lp:1300,vib:8}); s3bat(t,'k..k..k.',.18); },
 k_vampiro:t=>{ s3c(t,[50,53,57,61],1.8,'sawtooth',.018,.3); s3r(t+.2,'xxxxxx',.05,tt=>s3n(tt,.04,1400,2,.05)); },
 k_maldicao:t=>{ s3w(t,200,900,.6,'sawtooth',.03); s3c(t+.5,[47,53],1.6,'square',.02,.1); },
 k_policia:t=>{ s3v(t,.5,[[0,700],[.25,1100],[.5,700]],{type:'square',vol:.03,lp:2600}); s3v(t+.5,.5,[[0,700],[.25,1100],[.5,700]],{type:'square',vol:.025,lp:2600}); },
 k_superpoderes:t=>{ s3w(t,200,2400,.5,'sawtooth',.035); s3a(t+.4,[72,79,84,91],.05,.5,'square',.03); },
 k_carreira:t=>{ s3a(t,[67,72,76,79],.08,.5,'square',.035); s3c(t+.35,[55,60,64],.9,'triangle',.04); },
 k_saude:t=>{ s3r(t,'x...x...x',.12,tt=>sTone(1000,tt,.08,{type:'sine',vol:.05})); SFX.heart(t+.1); },
 k_politica:t=>{ s3a(t,[60,67,72],.12,.5,'sawtooth',.03); s3c(t+.36,[48,55,60,64],1,'sawtooth',.018); },
 k_misterio:t=>s3v(t,1.6,[[0,500],[.5,640],[1,470],[1.6,600]],{type:'sine',vol:.05,lp:3000,vib:14,vibHz:6}),
 k_prisao:t=>{ s3n(t,.5,300,.8,.25,'lowpass'); s3b(t,40,1.2,.05); s3n(t+.05,.3,2500,8,.05); },
 k_infancia:t=>s3a(t,[72,76,79,76,84],.09,.3,'sine',.06),
 k_estudos:t=>{ s3r(t,'x.x.xx',.07,tt=>s3n(tt,.05,5000,1,.04)); s3p(t+.45,79); },
 k_empresa:t=>{ s3a(t,[64,67,71,74],.07,.4,'triangle',.05); SFX.cash(t+.35); },
 k_assombracao:t=>{ s3v(t,2,[[0,180],[1,140],[2,200]],{type:'sine',vol:.05,lp:800,vib:6}); s3n(t+.4,1.2,500,.4,.04); },
 k_paranormal:t=>{ s3r(t,'x.x..x.x',.1,tt=>s3n(tt,.05,2800,6,.05)); s3v(t,1.4,[[0,900],[1.4,600]],{type:'sine',vol:.03,vib:20,vibHz:9}); },
 k_internet:t=>s3r(t,'xxxx',.05,(tt,c)=>sTone(1200+Math.random()*900,tt,.04,{type:'square',vol:.03})),
 k_perigo:t=>{ s3c(t,[50,56],.8,'sawtooth',.03,.01); s3k(t,.3); s3k(t+.3,.25); },
 k_dinheiro:t=>SFX.cash(t),
 k_criatura:t=>{ s3v(t,1,[[0,120],[.5,90],[1,140]],{type:'sawtooth',vol:.06,lp:600,vib:10}); },
 k_bicho:t=>SFX.pet_cao(t),
 k_vida:t=>s3a(t,[65,69,72,77],.1,.6),
 k_realeza:t=>{ s3a(t,[72,79,76,84],.1,.4,'square',.03); s3c(t+.4,[60,64,67],1,'triangle',.04); },
 k_zumbi:t=>{ s3v(t,1.4,[[0,160],[.7,110],[1.4,130]],{type:'sawtooth',vol:.05,lp:700,vib:12,vibHz:3}); s3n(t,.8,400,.5,.05); },
 k_guerra:t=>{ s3bat(t,'s.ss.s.s',.09); s3n(t+.7,.6,140,.6,.3,'lowpass'); },
 k_casa:t=>{ s3n(t,.2,400,.8,.12); s3b(t+.25,79,.8,.04); },
 k_carro:t=>{ s3v(t,1,[[0,70],[.5,140],[1,110]],{type:'sawtooth',vol:.05,lp:900}); },
 k_rua:t=>{ s3n(t,.8,900,.3,.04); s3p(t+.3,67,.04); },
 k_fama:t=>{ s3n(t,.9,3000,.4,.08); s3a(t+.2,[72,76,79,84],.06,.4,'square',.03); },
 k_revolucao:t=>{ s3bat(t,'k.k.kkk.',.12); s3n(t,1,1200,.3,.06); },
 k_lutas:t=>{ SFX.punch(t); SFX.punch(t+.22); s3b(t+.45,64,.9,.05); },
 k_sorte:t=>{ s3a(t,[84,88,91,96],.05,.4,'sine',.05); s3n(t+.2,.3,8000,2,.03); },
 k_justica:t=>{ s3k(t,.3); s3k(t+.25,.3); s3c(t+.5,[45,52,57],1.2,'triangle',.04); },
 k_faculdade:t=>{ s3a(t,[67,71,74,79],.1,.5); s3b(t+.4,83,.8,.04); },
 k_vizinhanca:t=>{ SFX.door(t); s3p(t+.3,72,.05); },
 k_governo:t=>{ s3c(t,[48,55,60,64],1,'sawtooth',.02); s3a(t+.2,[67,72],.15,.6,'square',.03); },
 k_forcas:t=>{ s3bat(t,'s.s.sss.',.08); s3a(t+.6,[67,72,76],.12,.4,'square',.03); },
 k_filhos:t=>SFX.baby(t),
 k_cultura:t=>{ s3a(t,[62,66,69,74,78],.07,.6,'triangle',.05); },
 k_viagem:t=>{ s3w(t,300,900,1.2,'sawtooth',.02); s3n(t,1.2,600,.3,.05); s3b(t+.9,84,.6,.03); },
 k_submundo:t=>{ s3c(t,[38,45],1.3,'sawtooth',.03,.2); s3bat(t+.1,'k..k.k..',.13); },
 k_cinema:t=>{ s3r(t,'xxxxxxxx',.04,tt=>s3n(tt,.02,2500,3,.04)); s3a(t+.35,[60,67,72,79],.08,.6,'square',.03); },
 k_bairro:t=>{ s3p(t,64); s3p(t+.15,67); s3n(t,.6,800,.3,.03); },
 k_sonhos:t=>{ s3a(t,[76,83,88,95,88,83],.12,1,'sine',.035); },
 k_social:t=>{ s3n(t,.5,1500,.3,.05); s3a(t+.1,[69,72,76],.06,.3,'sine',.04); },
 k_noite:t=>{ s3bat(t,'k.h.k.h.',.12); s3c(t,[57,60,64],1,'sawtooth',.015,.2); },
 k_musica:t=>SFX.car_musico(t),
 k_vila:t=>{ s3a(t,[67,71,74],.15,.6,'triangle',.04); s3n(t,.6,3500,2,.02); },
 k_estilo:t=>{ s3n(t,.25,6000,1,.04); s3a(t+.1,[79,83,86],.05,.3,'sine',.05); },
 k_crime:t=>{ s3c(t,[40,46],1,'sawtooth',.03,.05); s3n(t,.15,3000,4,.06); },
 k_coracao:t=>{ SFX.heart(t); SFX.heart(t+.7); },
 k_heroi:t=>{ s3a(t,[60,67,72,76,79],.08,.6,'square',.035); s3c(t+.4,[48,55,60],1.2,'sawtooth',.02); },
 k_amizade:t=>s3a(t,[67,71,74,79],.08,.45,'triangle',.05),
 k_acaso:t=>{ s3w(t,600,1400,.3,'sine',.04); s3p(t+.3,81); },
 k_etica:t=>{ s3c(t,[55,61],1,'triangle',.04); s3c(t+.8,[55,60],1,'triangle',.04); },
 k_vicio:t=>{ s3v(t,1.3,[[0,400],[.6,300],[1.3,380]],{type:'triangle',vol:.04,vib:30,vibHz:2}); },
 k_transito:t=>{ s3r(t,'x.x',.18,tt=>sTone(420,tt,.12,{type:'square',vol:.04})); s3n(t,.8,500,.3,.04); },
 k_telefone:t=>s3r(t,'xx..xx',.08,tt=>{ sTone(1400,tt,.07,{vol:.04}); sTone(1750,tt,.07,{vol:.03}); }),
 k_ilha:t=>{ s3n(t,1.4,700,.3,.06,'lowpass'); s3a(t+.2,[67,71,74,79],.12,.5,'triangle',.04); },
 k_identidade:t=>{ s3w(t,400,1600,.4,'square',.03); s3c(t+.35,[60,66],1,'sawtooth',.02); },
 k_festa:t=>{ s3bat(t,'k.hsk.hs',.1); s3a(t+.1,[72,76,79,84],.1,.2,'square',.025); },
 k_faccao:t=>{ s3bat(t,'k..kk.s.',.11); s3c(t,[38],1,'sawtooth',.04,.05); },
 k_esporte:t=>{ s3r(t,'x.x',.12,tt=>sTone(2600,tt,.1,{type:'square',vol:.03})); s3n(t+.3,.8,1500,.3,.06); },
 k_eleicao:t=>{ s3n(t,1,1800,.3,.07); s3a(t+.3,[60,64,67,72],.1,.5,'square',.03); },
 k_diversao:t=>s3a(t,[72,74,76,79,81,84],.06,.25,'square',.03),
 k_deepweb:t=>s3r(t,'xx.xxx.x.xx',.04,()=>{}, sTone(80,t,1,{type:'sawtooth',vol:.03,slide:50})),
 k_bondade:t=>{ s3a(t,[72,76,79],.12,.8,'sine',.05); s3n(t+.2,.4,8000,2,.02); },
 k_arte:t=>s3a(t,[62,65,69,72,76],.1,.7,'triangle',.045),
 k_adolescencia:t=>{ s3bat(t,'k.s.k.s.',.11); s3a(t,[64,67,71],.11,.2,'square',.025); },
 k_velhice:t=>{ s3a(t,[60,64,67,72],.25,1.2,'triangle',.04); },
 k_tv:t=>{ s3n(t,.3,4000,.5,.05); s3a(t+.3,[72,79],.1,.3,'square',.03); },
 k_paixao:t=>{ SFX.romance(t); SFX.heart(t+.6); },
 k_oportunidade:t=>{ s3w(t,500,1500,.25,'triangle',.04); s3a(t+.25,[76,79,84],.07,.4); },
 k_negocios:t=>{ s3a(t,[62,66,69,73],.07,.4,'triangle',.05); s3r(t+.3,'xx',.07,tt=>s3n(tt,.03,4000,3,.05)); },
 k_mundo:t=>{ s3c(t,[43,50,55,59,62],2,'triangle',.03,.4); s3k(t,.25); },
 k_mente:t=>s3v(t,1.4,[[0,440],[.7,466],[1.4,440]],{type:'sine',vol:.04,vib:6,vibHz:3}),
 k_marte:t=>{ s3w(t,1800,300,1.2,'sine',.03); s3r(t,'x.x.x',.2,tt=>sTone(2200,tt,.05,{vol:.02})); },
 k_internacao:t=>{ s3r(t,'x.x.x.x',.15,tt=>sTone(880,tt,.07,{vol:.04})); },
 k_imperio:t=>{ s3bat(t,'t.t.ttt.',.12); s3c(t+.5,[43,50,55,59],1.4,'sawtooth',.025); },
 k_futebol:t=>{ s3r(t,'x.x.xxx',.11,tt=>sTone(2800,tt,.09,{type:'square',vol:.025})); s3n(t+.5,1.2,1400,.3,.08); },
 k_fantasia:t=>{ s3a(t,[69,72,76,81,84,88],.07,.7,'sine',.04); s3b(t+.4,93,.8,.025); },
 k_dilema:t=>{ s3c(t,[57,60],.6,'triangle',.04); s3c(t+.6,[57,61],.8,'triangle',.04); },
 k_copa:t=>{ s3n(t,1.5,1300,.3,.1); s3a(t+.2,[67,72,76,79],.12,.5,'square',.035); },
 k_complo:t=>{ s3c(t,[45,51],1.2,'sawtooth',.025,.3); s3r(t+.2,'x..x',.15,tt=>s3n(tt,.05,2000,5,.05)); },
 k_base:t=>{ s3n(t,.4,250,.5,.15,'lowpass'); s3r(t+.2,'xxx',.1,tt=>sTone(1500,tt,.05,{type:'square',vol:.025})); },
 k_lei:t=>{ s3k(t,.3); s3c(t+.15,[48,55],1,'triangle',.04); },
 k_generico:t=>SFX.card(t),
 // ===== acontecimentos do diário =====
 l_formatura:t=>{ s3a(t,[67,72,76,79,84],.1,.6,'square',.03); s3n(t+.4,1,2500,.3,.06); },
 l_aprovado:t=>{ s3a(t,[72,76,79,84],.06,.5); s3n(t+.2,.3,7000,2,.02); },
 l_reprovado:t=>{ s3a(t,[64,63,62,61],.18,.4,'triangle',.05); },
 l_demitido:t=>{ SFX.door(t); s3a(t+.3,[55,51,48],.2,.6,'sine',.06); },
 l_contratado:t=>{ s3a(t,[64,68,71,76],.08,.5,'triangle',.05); s3b(t+.35,88,.6,.03); },
 l_aposentado:t=>{ s3a(t,[60,64,67,72,76],.18,1,'triangle',.04); },
 l_casamento:t=>SFX.bells(t),
 l_divorcio:t=>{ s3c(t,[57,60],1,'sine',.04); s3c(t+.6,[56,59],1.2,'sine',.04); },
 l_termino:t=>{ s3a(t,[69,65,62],.25,.8,'sine',.05); },
 l_traicao:t=>{ s3c(t,[50,56],.4,'sawtooth',.03); s3c(t+.4,[49,55],1,'sawtooth',.03); },
 l_beijo:t=>{ s3n(t,.08,2500,3,.04); s3a(t+.1,[76,79,84],.08,.6,'sine',.04); },
 l_gravidez:t=>s3a(t,[72,79,76,84],.15,.8,'sine',.04),
 l_nascimento:t=>SFX.baby(t),
 l_adocao:t=>{ SFX.baby(t); s3c(t+.6,[60,64,67],1,'triangle',.03); },
 l_morte_familiar:t=>{ s3b(t,45,2.4,.07); s3c(t+.3,[57,60,64],2,'triangle',.03,.4); },
 l_morte_pet:t=>{ s3a(t,[72,69,65,62],.3,1,'sine',.04); },
 l_doenca:t=>{ s3c(t,[52,55,58],1.2,'triangle',.035,.2); },
 l_cura:t=>{ s3a(t,[64,68,71,76],.12,.8,'sine',.05); },
 l_hospital:t=>SFX.k_internacao(t),
 l_acidente:t=>{ s3n(t,.6,300,.6,.35,'lowpass'); s3n(t+.05,.4,3000,1,.12); s3r(t+.2,'xxx',.05,tt=>s3n(tt,.06,5000,3,.05)); },
 l_assalto:t=>{ s3n(t,.1,2000,2,.1); s3k(t+.1,.3); s3c(t+.2,[50,56],.8,'sawtooth',.03); },
 l_roubei:t=>{ s3r(t,'x.x.x',.07,tt=>sTone(1800,tt,.04,{type:'triangle',vol:.04})); s3w(t+.35,800,300,.3,'sine',.04); },
 l_fuga:t=>{ s3bat(t,'kkkkkkkk',.08); s3w(t,400,1200,.7,'sawtooth',.02); },
 l_solto:t=>{ s3n(t,.4,300,.8,.15,'lowpass'); s3a(t+.3,[67,72,76,79],.1,.6); },
 l_julgado:t=>{ s3k(t,.35); s3k(t+.3,.35); s3k(t+.6,.35); },
 l_absolvido:t=>{ s3k(t,.3); s3a(t+.3,[72,76,79,84],.08,.5); },
 l_tiro:t=>{ s3n(t,.25,800,.4,.4,'lowpass'); s3n(t,.08,4000,.5,.25); },
 l_briga:t=>{ SFX.punch(t); SFX.punch(t+.15); SFX.punch(t+.33); },
 l_ganhei_luta:t=>SFX.win(t),
 l_perdi_luta:t=>{ SFX.punch(t); s3a(t+.2,[60,56,53],.18,.5,'sine',.05); },
 l_viagem:t=>SFX.k_viagem(t),
 l_mudanca:t=>{ s3n(t,.3,300,.6,.12); s3n(t+.35,.3,300,.6,.1); s3a(t+.6,[67,72],.1,.4); },
 l_compra_casa:t=>{ SFX.cash(t); s3b(t+.3,79,1,.05); s3b(t+.6,84,1,.04); },
 l_compra_carro:t=>{ s3v(t,.9,[[0,80],[.4,180],[.9,120]],{type:'sawtooth',vol:.05,lp:1000}); s3r(t+.9,'x.x',.12,tt=>sTone(500,tt,.1,{type:'square',vol:.03})); },
 l_venda:t=>{ SFX.cash(t); s3p(t+.3,76); },
 l_divida:t=>{ s3a(t,[60,58,55],.2,.6,'square',.025); },
 l_falencia:t=>{ s3w(t,600,80,1.4,'sawtooth',.04); s3k(t+1.2,.3); },
 l_loteria:t=>{ s3r(t,'xxxxxxxxxxxx',.05,(tt)=>sTone(900+Math.random()*1200,tt,.05,{type:'square',vol:.025})); s3a(t+.7,[72,76,79,84,88],.07,.6); },
 l_heranca:t=>{ SFX.cash(t); s3c(t+.3,[57,60,64],1.2,'triangle',.03); },
 l_presente:t=>{ s3n(t,.2,5000,1,.05); s3a(t+.15,[79,83,86,91],.05,.4,'sine',.05); },
 l_fama_sobe:t=>{ s3n(t,1,2800,.3,.08); s3a(t+.3,[76,79,84],.06,.5,'square',.03); },
 l_viral:t=>{ s3r(t,'xxxxxx',.05,()=>{}); s3a(t,[84,86,88,91,93,96],.04,.2,'square',.025); },
 l_cancelado:t=>{ s3n(t,.8,1200,.3,.06); s3a(t+.2,[64,61,58],.2,.5,'sawtooth',.025); },
 l_eleito:t=>{ s3n(t,1.4,1500,.3,.1); s3a(t+.3,[60,67,72,76,79],.1,.8,'square',.035); },
 l_derrota_eleicao:t=>{ s3a(t,[67,63,60],.3,.9,'triangle',.05); },
 l_golpe:t=>{ s3bat(t,'t.t.t.tt',.1); s3c(t+.8,[38,45,50],1.6,'sawtooth',.03); },
 l_coroacao:t=>{ s3b(t,72,1.5,.06); s3a(t+.3,[60,67,72,76,79,84],.1,.8,'square',.03); },
 l_guerra_vence:t=>{ s3bat(t,'s.ss.s',.09); s3a(t+.55,[67,72,76,79],.12,.7,'square',.035); },
 l_guerra_perde:t=>{ s3n(t,1,140,.6,.3,'lowpass'); s3a(t+.4,[55,51,48,43],.3,1,'sawtooth',.025); },
 l_conquista:t=>{ s3a(t,[72,76,79,84,88],.06,.5,'square',.03); s3n(t+.3,.4,7000,2,.03); },
 l_pet_novo:t=>{ SFX.pet_cao(t); s3a(t+.4,[76,79,84],.07,.4); },
 l_amigo:t=>SFX.k_amizade(t),
 l_inimigo:t=>{ s3c(t,[52,58],.9,'sawtooth',.03); },
 l_mordida:t=>{ s3n(t,.12,900,1,.25); s3v(t+.1,1,[[0,250],[.4,420],[1,260]],{vol:.04,lp:1100,vib:6}); },
 l_transformacao:t=>{ s3w(t,80,600,1,'sawtooth',.04); SFX.howl(t+.6); },
 l_sangue:t=>{ s3c(t,[50,53,57],1.4,'sawtooth',.02,.3); s3n(t,.4,600,1,.05); },
 l_feitico:t=>{ s3a(t,[84,88,91,96,100],.04,.6,'sine',.035); s3w(t,300,1800,.6,'triangle',.03); },
 l_fantasma:t=>SFX.k_assombracao(t),
 l_exorcismo:t=>{ s3c(t,[55,62,67],1.4,'triangle',.03,.3); s3w(t+.3,1500,200,.8,'sawtooth',.03); },
 l_seita_cresce:t=>{ s3c(t,[45,52,57,60],1.6,'triangle',.03,.4); s3b(t,57,1.4,.04); },
 l_fiel:t=>s3c(t,[57,64,69],1.1,'triangle',.035,.3),
 l_milagre:t=>{ s3a(t,[72,76,79,84,88,91],.08,1,'sine',.04); s3c(t+.4,[60,64,67],1.6,'triangle',.03,.4); },
 l_investiga:t=>{ s3r(t,'x.x.x',.16,tt=>s3n(tt,.05,1800,4,.06)); s3c(t+.6,[50,53,57],.9,'triangle',.03); },
 l_pista:t=>{ s3p(t,76); s3p(t+.12,81); s3p(t+.24,88,.05); },
 l_caso_resolvido:t=>{ s3a(t,[62,65,69,74,77],.08,.6,'triangle',.045); },
 l_aniversario_filho:t=>SFX.birthday(t),
 l_neto:t=>{ SFX.baby(t); s3c(t+.5,[60,64,67,72],1.4,'triangle',.03,.3); },
 l_esporte_vitoria:t=>{ s3n(t,1.2,1500,.3,.09); s3a(t+.2,[67,72,76],.1,.5,'square',.035); },
 l_gol:t=>{ s3n(t,1.6,1300,.3,.12); s3r(t+.1,'x.x.x',.1,tt=>sTone(2800,tt,.08,{type:'square',vol:.025})); },
 l_show:t=>{ s3n(t,1.4,2600,.3,.09); s3bat(t,'k.s.k.s.',.12); },
 l_filme:t=>SFX.k_cinema(t),
 l_premio:t=>{ s3a(t,[67,72,76,79,84],.09,.7,'square',.03); s3n(t+.3,1,2500,.3,.07); },
 l_cirurgia:t=>{ s3r(t,'x...x...x...',.08,tt=>sTone(1050,tt,.05,{vol:.04})); },
 l_academia:t=>{ s3n(t,.15,200,.8,.2,'lowpass'); s3n(t+.35,.15,200,.8,.2,'lowpass'); s3p(t+.6,79); },
 l_fome:t=>s3v(t,.9,[[0,90],[.5,70],[.9,110]],{type:'sine',vol:.08,lp:400,vib:8,vibHz:4}),
 l_comida:t=>{ s3n(t,.2,2500,2,.05); s3a(t+.2,[72,76],.1,.3,'sine',.05); },
 l_chuva:t=>s3n(t,1.6,2000,.2,.05,'lowpass'),
 l_tempestade:t=>{ s3n(t,1.8,100,.5,.3,'lowpass'); s3n(t,1.6,2000,.2,.06,'lowpass'); },
 l_fogo:t=>{ s3r(t,'xxxxxxxxxx',.06,tt=>s3n(tt,.05,1200+Math.random()*1500,2,.05)); s3n(t,1,400,.3,.06); },
 // ===== bichos =====
 pet_cao:t=>{ s3v(t,.14,[[0,520],[.07,780],[.14,480]],{type:'sawtooth',vol:.06,lp:1800}); s3v(t+.22,.14,[[0,540],[.07,800],[.14,470]],{type:'sawtooth',vol:.05,lp:1800}); },
 pet_gato:t=>s3v(t,.6,[[0,500],[.2,820],[.6,600]],{type:'triangle',vol:.05,lp:2400,vib:10,vibHz:7}),
 pet_passaro:t=>s3r(t,'x.x.xx',.06,tt=>sTone(2600+Math.random()*900,tt,.05,{vol:.035,slide:3600})),
 pet_cavalo:t=>s3v(t,.9,[[0,700],[.2,1100],[.9,500]],{type:'sawtooth',vol:.035,lp:2000,vib:30,vibHz:14}),
 pet_peixe:t=>s3r(t,'x.x..x',.08,tt=>sTone(600+Math.random()*400,tt,.06,{vol:.04,slide:1200})),
 pet_cobra:t=>s3n(t,.9,5000,1.5,.06),
 pet_coelho:t=>s3r(t,'xx',.1,tt=>s3n(tt,.04,3500,3,.04)),
 // ===== carreiras e ações especiais =====
 car_musico:t=>{ s3bat(t,'k.s.k.s.',.13); s3a(t,[52,55,57,59,60],.13,.15,'sawtooth',.035,0); },
 car_atleta:t=>{ s3r(t,'x.x',.12,tt=>sTone(2700,tt,.09,{type:'square',vol:.03})); s3n(t+.3,.8,1500,.3,.06); },
 car_ator:t=>SFX.k_cinema(t),
 car_modelo:t=>{ s3r(t,'xxx',.1,tt=>s3n(tt,.05,6000,1,.06)); s3bat(t,'k.k.k.k.',.12); },
 car_militar:t=>SFX.k_forcas(t),
 car_lutador:t=>{ s3b(t,64,1,.06); SFX.punch(t+.3); },
 car_crime:t=>SFX.k_crime(t),
 car_detetive:t=>{ s3a(t,[50,53,57,60,63],.14,.5,'triangle',.04,12); s3h(t,.03); s3h(t+.28,.03); },
 car_medico:t=>SFX.k_saude(t),
 car_professor:t=>SFX.k_escola(t),
 car_chef:t=>{ s3n(t,.6,3000,.6,.06); s3r(t+.1,'x.x.x',.07,tt=>s3n(tt,.03,4500,4,.04)); },
 car_programador:t=>SFX.k_internet(t),
 car_piloto:t=>SFX.k_viagem(t),
 car_bombeiro:t=>{ s3v(t,1,[[0,500],[.5,900],[1,500]],{type:'square',vol:.03,lp:2000}); },
 car_advogado:t=>SFX.k_justica(t),
 car_politico:t=>SFX.k_politica(t),
 car_empresario:t=>SFX.k_negocios(t),
 car_paranormal:t=>SFX.k_paranormal(t),
 car_lider_culto:t=>SFX.l_seita_cresce(t),
 car_presidente:t=>SFX.l_eleito(t),
 car_ditador:t=>SFX.l_golpe(t),
 car_rei:t=>SFX.l_coroacao(t),
 car_heroi:t=>SFX.k_heroi(t),
 // ===== interface =====
 ui_abrir:t=>{ s3w(t,300,700,.12,'sine',.04); s3n(t,.12,2500,.6,.02); },
 ui_fechar:t=>{ s3w(t,700,300,.12,'sine',.035); },
 ui_entrar:t=>s3p(t,79,.035,.15),
 ui_voltar:t=>s3p(t,72,.03,.15),
 ui_aba:t=>{ sTone(1500,t,.04,{type:'triangle',vol:.04}); },
 ui_erro:t=>{ sTone(220,t,.12,{type:'square',vol:.03}); sTone(200,t+.13,.15,{type:'square',vol:.03}); },
 ui_bloqueado:t=>{ sTone(300,t,.08,{type:'triangle',vol:.04,slide:200}); },
 ui_salvar:t=>s3a(t,[79,84],.06,.2,'sine',.03),
 ui_novidade:t=>{ s3a(t,[84,88,91],.06,.3,'sine',.04); },
 ui_conquista:t=>{ s3a(t,[72,76,79,84,88,91],.06,.7,'square',.03); s3n(t+.3,.5,7000,2,.03); },
 ui_digitar:t=>sTone(2000+Math.random()*600,t,.02,{type:'square',vol:.012}),
 ui_moeda:t=>{ sTone(2000,t,.06,{type:'square',vol:.02}); sTone(2600,t+.05,.1,{type:'square',vol:.02}); },
 ui_marcar:t=>s3a(t,[76,83],.05,.15,'sine',.04),
 ui_desmarcar:t=>s3a(t,[83,76],.05,.15,'sine',.035),
 ui_comecar:t=>{ s3a(t,[60,64,67,72,76,79],.07,.9,'triangle',.04); s3n(t+.4,.5,7000,2,.02); },
 ui_tempo:t=>{ s3w(t,1400,200,.9,'sine',.04); s3r(t,'xxxxxx',.12,tt=>s3n(tt,.03,4000,3,.03)); },
 ui_deus:t=>{ s3c(t,[60,67,72,76,79],1.6,'triangle',.03,.3); s3n(t,1.2,6000,1,.03); },
 ui_provador:t=>{ s3n(t,.5,2500,.3,.05); s3a(t+.2,[79,83,86,91],.06,.4,'sine',.04); },
 ui_compra:t=>{ SFX.cash(t); },
 ui_rolar:t=>s3n(t,.05,3000,1,.015),
 // ===== envelhecer em cada fase =====
 idade_bebe:t=>s3a(t,[84,88,91],.12,.5,'sine',.045),
 idade_crianca:t=>s3a(t,[72,76,79,84],.08,.3,'triangle',.05),
 idade_adolescente:t=>{ s3bat(t,'k.s.',.1); s3a(t,[67,71,74],.1,.25,'square',.025); },
 idade_adulto:t=>s3a(t,[64,67,71,76],.09,.4,'triangle',.045),
 idade_meia:t=>s3a(t,[62,65,69,74],.11,.5,'triangle',.045),
 idade_idoso:t=>s3a(t,[60,64,67,72],.16,.8,'sine',.045),
 idade_redonda:t=>{ s3a(t,[67,72,76,79,84],.08,.6,'square',.03); s3n(t+.3,.6,2500,.3,.05); },
 // ===== atributos =====
 at_feliz_sobe:t=>s3a(t,[76,81],.07,.25,'sine',.04),
 at_feliz_desce:t=>s3a(t,[69,64],.09,.3,'sine',.04),
 at_saude_sobe:t=>s3a(t,[72,79],.07,.25,'triangle',.04),
 at_saude_desce:t=>{ sTone(180,t,.25,{type:'sine',vol:.08,slide:120}); },
 at_inteligencia_sobe:t=>s3a(t,[79,83,86],.05,.25,'sine',.035),
 at_aparencia_sobe:t=>{ s3n(t,.2,7000,2,.03); s3p(t+.1,88,.04); },
 at_dinheiro_muito:t=>{ SFX.cash(t); SFX.cash(t+.25); s3a(t+.5,[84,88,91],.06,.5); },
 at_dinheiro_perde:t=>{ s3a(t,[67,63,60],.12,.4,'square',.025); },
 at_karma_sobe:t=>s3c(t,[72,76,79],.9,'sine',.03,.2),
 at_karma_desce:t=>s3c(t,[49,55],.9,'sawtooth',.02,.1),
 at_fama_sobe:t=>SFX.l_fama_sobe(t),
});

// cartão → som pelo tema (kicker)
const NL_SOM_K={'Família':'k_familia','Escola':'k_escola','Trabalho':'k_trabalho','Religião':'k_religiao','Amor':'k_amor','Lobisomem':'k_lobisomem','Vampiro':'k_vampiro','Maldição':'k_maldicao','Polícia':'k_policia','Superpoderes':'k_superpoderes','Carreira':'k_carreira','Saúde':'k_saude','Política':'k_politica','Mistério':'k_misterio','Prisão':'k_prisao','Infância':'k_infancia','Estudos':'k_estudos','Empresa':'k_empresa','Assombração':'k_assombracao','Paranormal':'k_paranormal','Internet':'k_internet','Perigo':'k_perigo','Dinheiro':'k_dinheiro','Criatura':'k_criatura','Bicho':'k_bicho','Bichos':'k_bicho','Vida':'k_vida','Realeza':'k_realeza','Pesadelo zumbi':'k_zumbi','Guerra':'k_guerra','casa':'k_casa','Casa':'k_casa','carro':'k_carro','Rua':'k_rua','Fama':'k_fama','Revolução':'k_revolucao','Lutas':'k_lutas','Sorte':'k_sorte','Justiça':'k_justica','Faculdade':'k_faculdade','Vizinhança':'k_vizinhanca','Governo':'k_governo','Forças Armadas':'k_forcas','Filhos':'k_filhos','Cultura':'k_cultura','Viagem':'k_viagem','Submundo':'k_submundo','Cinema':'k_cinema','Bairro':'k_bairro','Sonhos':'k_sonhos','Social':'k_social','Noite':'k_noite','Música':'k_musica','Minha vila':'k_vila','Vila':'k_vila','Estilo':'k_estilo','Crime':'k_crime','Coração':'k_coracao','Carreira de herói':'k_heroi','Amizade':'k_amizade','Acaso':'k_acaso','Ética':'k_etica','Vício':'k_vicio','Trânsito':'k_transito','Telefone':'k_telefone','Ilha':'k_ilha','Identidade revelada':'k_identidade','Festa':'k_festa','Facção':'k_faccao','Esporte':'k_esporte','Eleição':'k_eleicao','Diversão':'k_diversao','Deep web':'k_deepweb','Bondade':'k_bondade','Arte':'k_arte','Adolescência':'k_adolescencia','Velhice':'k_velhice','TV':'k_tv','Paixão':'k_paixao','Oportunidade':'k_oportunidade','Negócios':'k_negocios','Mundo':'k_mundo','Mente':'k_mente','Marte':'k_marte','Internação':'k_internacao','Império':'k_imperio','Futebol':'k_futebol','Eldoria':'k_fantasia','Dilema':'k_dilema','Copa do Mundo':'k_copa','Complô':'k_complo','Base':'k_base','Lei de Registro':'k_lei','Diplomacia':'k_governo','Visual':'k_estilo','Formatura':'l_formatura','Casamento':'l_casamento','Julgamento':'k_justica','Revolta':'k_revolucao','Seita':'l_seita_cresce','Fé':'k_religiao'};

// frases do diário → som (a primeira que bater vence; prioridade decide quando várias linhas chegam juntas)
const NL_SOM_L=[[/formei|formatura|diploma/i,'l_formatura',3],[/passei (no|na|em)|fui aprovad|aprovad[oa] n/i,'l_aprovado',2],[/reprovei|fui reprovad|repeti de ano/i,'l_reprovado',2],
 [/fui demitid|me demitiram|perdi o emprego/i,'l_demitido',3],[/fui contratad|comecei a trabalhar|consegui o emprego|novo emprego/i,'l_contratado',2],[/me aposentei|aposentadoria/i,'l_aposentado',3],
 [/divorci|nos separamos|pediu o divórcio/i,'l_divorcio',3],[/terminei|terminou comigo|término/i,'l_termino',2],[/me traiu|traição|traí /i,'l_traicao',3],[/grávida|gravidez|vou ser (pai|mãe)/i,'l_gravidez',3],
 [/adotei|adoção/i,'l_adocao',3],[/(minha|meu) (mãe|pai|avó|avô|irmão|irmã|esposa|marido|filho|filha) morreu|faleceu/i,'l_morte_familiar',5],[/(cachorro|gato|bicho|pet) .{0,20}morreu/i,'l_morte_pet',4],
 [/diagnóstic|descobri que tenho|fiquei doente|câncer/i,'l_doenca',3],[/curad|me curei|recuperei/i,'l_cura',2],[/internad|hospital|UTI/i,'l_hospital',2],[/acidente|bati o carro|capotei|atropel/i,'l_acidente',4],
 [/fui assaltad|me assaltaram|levaram minha/i,'l_assalto',4],[/roubei|furtei|assaltei/i,'l_roubei',3],[/fugi da prisão|escapei|fuga/i,'l_fuga',4],[/saí da prisão|fui solt|liberdade condicional|cumpri a pena/i,'l_solto',4],
 [/fui condenad|sentença/i,'l_julgado',4],[/absolvid|inocente/i,'l_absolvido',3],[/tiro|disparo|baleado|atirei/i,'l_tiro',4],[/briguei|porrada|soco/i,'l_briga',2],[/venci a luta|ganhei a luta|nocaute/i,'l_ganhei_luta',3],
 [/perdi a luta|apanhei/i,'l_perdi_luta',2],[/viajei|viagem|aeroporto/i,'l_viagem',2],[/me mudei|mudança/i,'l_mudanca',2],[/comprei (uma |a )?(casa|apartamento|mansão)/i,'l_compra_casa',3],[/comprei (um |o )?(carro|moto)/i,'l_compra_carro',3],
 [/vendi/i,'l_venda',2],[/dívida|devendo|cobrança/i,'l_divida',2],[/faliu|falência|quebrou/i,'l_falencia',4],[/loteria|bilhete premiado|ganhei na/i,'l_loteria',4],[/herança|herdei/i,'l_heranca',3],[/presente|ganhei de presente/i,'l_presente',1],
 [/viralizou|viral|milhões de views/i,'l_viral',3],[/cancelad|cancelamento/i,'l_cancelado',3],[/fiquei famos|seguidores|famos[oa]/i,'l_fama_sobe',2],[/fui eleit|ganhei a eleição|venci a eleição/i,'l_eleito',4],[/perdi a eleição/i,'l_derrota_eleicao',3],
 [/golpe de estado|tomei o poder/i,'l_golpe',5],[/coroad|coroação|rei do mundo|rainha do mundo/i,'l_coroacao',5],[/vencemos a guerra|vitória na guerra/i,'l_guerra_vence',5],[/perdemos a guerra|derrota na guerra/i,'l_guerra_perde',5],
 [/conquista|desbloque/i,'l_conquista',2],[/adotei um|ganhei um (cachorro|gato|filhote)/i,'l_pet_novo',3],[/novo amigo|fizemos amizade|melhor amig/i,'l_amigo',1],[/inimig/i,'l_inimigo',1],
 [/me mordeu|mordida/i,'l_mordida',4],[/me transformei|transformação/i,'l_transformacao',5],[/sangue/i,'l_sangue',2],[/feitiço|magia|encantamento/i,'l_feitico',3],[/fantasma|espírito|assombr/i,'l_fantasma',3],[/exorcis/i,'l_exorcismo',4],
 [/fiéis|seguidores da fé|seita cresceu|novos membros/i,'l_seita_cresce',2],[/milagre/i,'l_milagre',4],[/investig|caso novo|cena do crime/i,'l_investiga',2],[/pista|evidência/i,'l_pista',1],[/resolvi o caso|caso resolvido|desvendei/i,'l_caso_resolvido',4],
 [/neto|neta/i,'l_neto',3],[/fizemos um gol|marquei um gol|gol!/i,'l_gol',4],[/vencemos|campeão|campeã|título/i,'l_esporte_vitoria',3],[/show|turnê|plateia/i,'l_show',2],[/filme|filmagem|estreia/i,'l_filme',2],[/prêmio|troféu|oscar/i,'l_premio',3],
 [/cirurgia|operação/i,'l_cirurgia',3],[/academia|malhei|treinei/i,'l_academia',1],[/fome|faminto/i,'l_fome',2],[/jantar|almoço|comi /i,'l_comida',1],[/tempestade|furacão|raio/i,'l_tempestade',3],[/chuva|choveu/i,'l_chuva',1],[/incêndio|fogo|pegou fogo/i,'l_fogo',4],
 [/cachorro|latiu/i,'pet_cao',1],[/gato|miou/i,'pet_gato',1],[/pássaro|papagaio|calopsita/i,'pet_passaro',1],[/cavalo/i,'pet_cavalo',1],[/peixe|aquário/i,'pet_peixe',1],[/cobra|serpente/i,'pet_cobra',1],[/coelho/i,'pet_coelho',1]];
// os sons do sons3/sound.js (morte, matar, sirene, uivo, romance, bebê, casamento…) continuam com prioridade maior
let nlSomL=null, nlSomLP=0, nlSomLTm=0;
soundForLine=(o=>function(t,tone){ const r=o(t,tone); if(r==='death'||r==='siren'||r==='baby'||r==='bells'||r==='promo') return r;
  if(!nlSomFila) for(const [re,s,p] of NL_SOM_L) if(re.test(t)){ if(!nlSomL||p>nlSomLP){ nlSomL=s; nlSomLP=p; } clearTimeout(nlSomLTm); nlSomLTm=setTimeout(()=>{ if(nlSomL) sfx(nlSomL,350); nlSomL=null; nlSomLP=0; },70); return null; }
  return r; })(soundForLine);

// cartões: som do tema; os que não estão na lista usam o som genérico
nlSomCartao=function(){ const md=document.getElementById('modal'); if(!md||document.getElementById('modalWrap').hidden) return;
  const k=(md.querySelector('.kick')?.textContent||'').replace(/^\S+\s/,'').trim(), h=md.querySelector('h2')?.textContent||'';
  let nm=NL_SOM_K[k]||Object.entries(NL_SOM_K).find(([kk])=>k.includes(kk))?.[1];
  if(!nm) nm=/Lobisomem|lua cheia/i.test(h)?'howl':/Polícia|preso/i.test(h)?'siren':md.classList.contains('res')?'card':'k_generico';
  sfx(nm,/howl|siren|k_lobisomem|k_policia/.test(nm)?2500:200); };

// interface
UI.open=(o=>function(){ sfx('ui_abrir',150); return o.apply(this,arguments); })(UI.open);
UI.push=(o=>function(){ sfx('ui_entrar',80); return o.apply(this,arguments); })(UI.push);
UI.back=(o=>function(){ sfx('ui_voltar',80); return o.apply(this,arguments); })(UI.back);
UI.close=(o=>function(){ if(document.getElementById('sheetWrap')&&!document.getElementById('sheetWrap').hidden) sfx('ui_fechar',150); return o.apply(this,arguments); })(UI.close);
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('#nav button,.pv3-abas button,.pv3-cats button'); if(b) sfx('ui_aba',60);
  const d=e.target.closest&&e.target.closest('[disabled],.dis'); if(d) sfx('ui_bloqueado',200);
  if(e.target.closest&&e.target.closest('#stCustom,#stRand')) sfx('ui_comecar',500);
  if(e.target.matches&&e.target.matches('input[type=checkbox]')) sfx(e.target.checked?'ui_marcar':'ui_desmarcar',60); },true);
document.addEventListener('keydown',e=>{ if(e.target&&e.target.matches&&e.target.matches('input[type=text],input:not([type]),textarea')) sfx('ui_digitar',30); },true);
if(typeof showErr==='function') showErr=(o=>function(){ sfx('ui_erro',400); return o.apply(this,arguments); })(showErr);
if(typeof pv3Abrir==='function') pv3Abrir=(o=>function(){ sfx('ui_provador',300); return o.apply(this,arguments); })(pv3Abrir);
if(V.god) V.god=(o=>function(){ sfx('ui_deus',1500); return o.apply(this,arguments); })(V.god);
if(V.time) V.time=(o=>function(){ sfx('ui_tempo',1500); return o.apply(this,arguments); })(V.time);

// envelhecer: som da fase (e um especial nos aniversários redondos) no lugar do parabéns de sempre
SFX.birthday=t=>{ const a=S&&S.me?S.me.age:20; SFX[a%10===0&&a>=10?'idade_redonda':a<3?'idade_bebe':a<12?'idade_crianca':a<18?'idade_adolescente':a<40?'idade_adulto':a<65?'idade_meia':'idade_idoso'](t); };

// atributos do personagem mudando muito de uma vez
st=(o=>function(k,d){ const r=o.apply(this,arguments); try{ if(Math.abs(d)>=8&&S&&S.me&&!/^#(teste|qualidade|demo)/.test(location.hash)){ const n={happy:d>0?'at_feliz_sobe':'at_feliz_desce',health:d>0?'at_saude_sobe':'at_saude_desce',smarts:d>0?'at_inteligencia_sobe':null,looks:d>0?'at_aparencia_sobe':null,karma:d>0?'at_karma_sobe':'at_karma_desce',fame:d>0?'at_fama_sobe':null}[k]; if(n) sfx(n,600); } }catch(e){} return r; })(st);

// ações dos menus: som pelo título da ação
const NL_SOM_ACAO=[[/academia|treino|malhar/i,'l_academia'],[/médico|hospital|saúde/i,'car_medico'],[/visual|salão|guarda-roupa|acessórios|corpo/i,'ui_provador'],[/provador/i,'ui_provador'],[/criar aparência/i,'ui_deus'],
 [/crime|roubo|assalto/i,'l_roubei'],[/luta|briga/i,'k_lutas'],[/festa|balada/i,'k_festa'],[/viagem|viajar/i,'l_viagem'],[/estudo|ler|biblioteca/i,'k_estudos'],[/cassino|aposta/i,'l_loteria'],
 [/namoro|encontro|paquera|romance/i,'romance'],[/pet|bicho/i,'pet_cao'],[/igreja|rezar|meditar|fé/i,'k_religiao'],[/trabalh|emprego/i,'k_trabalho'],[/compr/i,'ui_compra'],[/seita|culto/i,'car_lider_culto'],
 [/paranormal|investiga/i,'car_paranormal'],[/governo|presid|regime/i,'k_governo'],[/império|invadir|guerra/i,'k_imperio'],[/música|tocar|banda/i,'car_musico'],[/esporte|treinar|jogo/i,'car_atleta'],[/cozinh/i,'car_chef']];
act=(o=>function(fn,title){ try{ const hit=NL_SOM_ACAO.find(([re])=>re.test(title||'')); if(hit) sfx(hit[1],400); }catch(e){} return o.apply(this,arguments); })(act);

// ========== trilhas: música de fundo por fase da vida e por carreira ==========
// cada trilha: acordes (MIDI), escala da melodia, duração do compasso, timbres, baixo e bateria (k=bumbo s=caixa h=chimbal)
const NL_TRILHAS={
 bebe:{L:5.6,prog:[[60,64,67,72],[57,64,69,72],[53,60,65,69],[55,62,67,71]],esc:[84,86,88,91,93,96],mel:{w:'sine',v:.03,n:4,st:1.2},pad:{w:'sine',v:.035},bat:null,nome:'Ninar'},
 infancia:{L:3.6,prog:[[60,64,67],[65,69,72],[67,71,74],[60,64,67]],esc:[72,74,76,79,81,84],mel:{w:'triangle',v:.035,n:6,st:.45},pad:{w:'triangle',v:.03},baixo:{w:'triangle',v:.05,pat:'x...x...'},bat:{pat:'k...s...k.k.s...',v:.5},nome:'Recreio'},
 adolescencia:{L:3.2,prog:[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],esc:[69,72,74,76,79,81],mel:{w:'square',v:.02,n:6,st:.4},pad:{w:'sawtooth',v:.012},baixo:{w:'sawtooth',v:.04,pat:'x.x.x.x.'},bat:{pat:'k.h.s.h.k.k.s.h.',v:.6},nome:'Fone de ouvido'},
 jovem:{L:4.2,prog:[[62,65,69,72],[60,64,67,71],[57,60,64,67],[59,62,65,69]],esc:[74,76,77,79,81,84],mel:{w:'triangle',v:.028,n:4,st:.7},pad:{w:'sine',v:.04},baixo:{w:'sine',v:.06,pat:'x.....x.'},bat:{pat:'k...s..hk.h.s...',v:.35},nome:'Lo-fi da vida adulta'},
 adulto:{L:4.8,prog:[[48,55,64,71],[45,52,60,67],[41,48,57,64],[43,50,59,65]],esc:[72,74,76,79,81,84,86,88],mel:{w:'sine',v:.035,n:3,st:1.3},pad:{w:'sine',v:.05},bat:null,nome:'Dia a dia'},
 maturidade:{L:5,prog:[[50,57,60,65],[55,59,62,65],[48,55,59,64],[45,52,55,60]],esc:[69,71,72,74,76,79],mel:{w:'triangle',v:.03,n:4,st:1},pad:{w:'triangle',v:.035},baixo:{w:'sine',v:.05,pat:'x...x...'},bat:{pat:'h.h.h.h.',v:.2},nome:'Jazz de domingo'},
 velhice:{L:4.5,prog:[[53,57,60],[48,52,55],[50,53,57],[55,59,62]],esc:[65,67,69,72,74,77],mel:{w:'sine',v:.033,n:3,st:1.3},pad:{w:'sine',v:.04},baixo:{w:'triangle',v:.045,pat:'x..x..x..x..'},bat:null,nome:'Valsa das lembranças'},
 investigador:{L:4.4,prog:[[50,53,57,60],[46,50,53,57],[45,49,52,55],[50,53,56,60]],esc:[62,65,67,68,69,72,74],mel:{w:'triangle',v:.03,n:4,st:.9},pad:{w:'sawtooth',v:.01},baixo:{w:'triangle',v:.06,pat:'x.x.x.x.'},bat:{pat:'h.h.h.hh',v:.22},nome:'Noir'},
 paranormal:{L:6,prog:[[48,51,54],[47,50,53],[46,49,52],[45,48,51]],esc:[72,73,75,78,79,82],mel:{w:'sine',v:.03,n:3,st:1.6,vib:12},pad:{w:'triangle',v:.02},bat:null,nome:'Lanterna no escuro'},
 culto:{L:6.4,prog:[[45,52,57,60],[44,51,56,60],[41,48,53,57],[43,50,55,58]],esc:[57,60,62,64,67],mel:{w:'triangle',v:.025,n:2,st:2.4},pad:{w:'triangle',v:.045},baixo:{w:'sine',v:.06,pat:'x.......'},bat:{pat:'k.......k.......',v:.4},nome:'Coro da fé'},
 lobisomem:{L:3.6,prog:[[45,52,57],[45,52,56],[43,50,55],[44,51,56]],esc:[57,60,62,63,64,67],mel:{w:'sawtooth',v:.015,n:3,st:.8},pad:{w:'sawtooth',v:.012},baixo:{w:'sawtooth',v:.05,pat:'x..x..x.'},bat:{pat:'k..t..k.t.k.t...',v:.7},nome:'Tambores da lua'},
 vampiro:{L:5.2,prog:[[50,53,57,62],[49,52,55,61],[46,50,53,58],[45,49,52,57]],esc:[74,76,77,79,81,82,85],mel:{w:'square',v:.016,n:6,st:.35},pad:{w:'sawtooth',v:.014},bat:null,nome:'Cravo gótico'},
 presidente:{L:4,prog:[[48,55,60,64],[53,57,60,65],[55,59,62,67],[48,55,60,64]],esc:[67,72,74,76,79,84],mel:{w:'square',v:.02,n:4,st:.6},pad:{w:'sawtooth',v:.014},baixo:{w:'triangle',v:.055,pat:'x...x...'},bat:{pat:'s...s.s.s...s.ss',v:.3},nome:'Palácio'},
 ditador:{L:4,prog:[[45,52,57,60],[44,52,56,59],[41,48,53,57],[40,47,52,56]],esc:[57,59,60,62,64,65,68],mel:{w:'sawtooth',v:.014,n:3,st:.8},pad:{w:'sawtooth',v:.016},baixo:{w:'sawtooth',v:.055,pat:'x.x.x.x.'},bat:{pat:'s.s.sss.s.s.sss.',v:.45},nome:'Marcha de ferro'},
 realeza:{L:4.4,prog:[[55,59,62,67],[52,55,59,64],[48,52,55,60],[50,54,57,62]],esc:[79,81,83,84,86,88,91],mel:{w:'square',v:.018,n:7,st:.32},pad:{w:'triangle',v:.025},baixo:{w:'triangle',v:.045,pat:'x.x.x.x.'},bat:null,nome:'Corte barroca'},
 imperio:{L:4.8,prog:[[43,50,55,59],[41,48,53,57],[39,46,51,55],[38,45,50,54]],esc:[62,65,67,70,72,74],mel:{w:'sawtooth',v:.016,n:3,st:1},pad:{w:'sawtooth',v:.02},baixo:{w:'sawtooth',v:.06,pat:'x..x..x.'},bat:{pat:'k.t.k.t.k.ttk.t.',v:.6},nome:'Trono do mundo'},
 prisao:{L:5,prog:[[40,47,52],[41,48,53],[40,47,52],[38,45,50]],esc:[52,55,57,58,59],mel:{w:'triangle',v:.025,n:2,st:2},pad:{w:'sine',v:.03},baixo:{w:'sine',v:.05,pat:'x.......'},bat:{pat:'....k...........',v:.35},nome:'Cela'},
 crime:{L:3.4,prog:[[45,48,52],[45,48,53],[43,47,50],[44,48,51]],esc:[57,60,62,63,67,69],mel:{w:'square',v:.016,n:4,st:.5},pad:{w:'sawtooth',v:.012},baixo:{w:'sine',v:.08,pat:'x..x...x..x.....'},bat:{pat:'k..hs.hhk.h.s.hh',v:.55},nome:'Quebrada'},
 militar:{L:3.6,prog:[[48,55,60],[50,57,62],[47,55,59],[48,55,60]],esc:[67,72,74,76,79],mel:{w:'square',v:.02,n:4,st:.5},pad:{w:'triangle',v:.02},baixo:{w:'triangle',v:.05,pat:'x...x...'},bat:{pat:'s.ss.s.ss.ss.s.s',v:.45},nome:'Quartel'},
 atleta:{L:3,prog:[[57,61,64],[54,57,61],[50,54,57],[52,56,59]],esc:[69,71,73,76,78,81],mel:{w:'square',v:.02,n:6,st:.32},pad:{w:'sawtooth',v:.012},baixo:{w:'sawtooth',v:.045,pat:'x.x.x.x.x.x.x.x.'},bat:{pat:'k.h.s.h.k.h.s.h.',v:.6},nome:'Aquecimento'},
 musico:{L:3.2,prog:[[52,56,59,62],[57,61,64,67],[59,63,66,69],[52,56,59,62]],esc:[64,67,69,70,71,74,76],mel:{w:'sawtooth',v:.016,n:6,st:.3},pad:{w:'triangle',v:.02},baixo:{w:'sawtooth',v:.05,pat:'x..x.x..x..x.x.x'},bat:{pat:'k.hsk.hsk.hsk.hs',v:.55},nome:'Groove do palco'},
 fama:{L:3.4,prog:[[53,57,60,64],[55,59,62,65],[52,55,59,62],[57,60,64,67]],esc:[72,74,76,77,79,81,84],mel:{w:'square',v:.018,n:5,st:.4},pad:{w:'sawtooth',v:.013},baixo:{w:'sawtooth',v:.045,pat:'x.x.x.x.'},bat:{pat:'k.h.s.hkk.h.s.h.',v:.55},nome:'Tapete vermelho'},
 lutador:{L:3,prog:[[40,47,52],[40,47,53],[38,45,50],[39,46,51]],esc:[52,55,57,58,59,62],mel:{w:'sawtooth',v:.014,n:3,st:.6},pad:{w:'sawtooth',v:.014},baixo:{w:'sawtooth',v:.06,pat:'x.x.x.x.'},bat:{pat:'k.k.s.k.kks.k.s.',v:.7},nome:'Octógono'},
 empresario:{L:4,prog:[[50,54,57,61],[55,59,62,66],[52,55,59,62],[57,61,64,67]],esc:[74,76,78,81,83,86],mel:{w:'triangle',v:.028,n:4,st:.6},pad:{w:'sine',v:.04},baixo:{w:'sine',v:.055,pat:'x...x.x.'},bat:{pat:'k...h...k.h.h...',v:.3},nome:'Sala de reunião'},
 heroi:{L:3.6,prog:[[48,55,60,64],[46,53,58,62],[44,51,56,60],[46,53,58,62]],esc:[67,72,74,76,79,84],mel:{w:'square',v:.022,n:4,st:.55},pad:{w:'sawtooth',v:.016},baixo:{w:'sawtooth',v:.05,pat:'x.x.x.x.'},bat:{pat:'k.s.k.s.kks.k.s.',v:.6},nome:'Capa ao vento'},
 zumbi:{L:4.4,prog:[[40,46,52],[41,47,53],[40,46,52],[39,45,51]],esc:[52,53,55,58,59],mel:{w:'sawtooth',v:.015,n:2,st:1.4},pad:{w:'sawtooth',v:.014},baixo:{w:'sine',v:.07,pat:'x.......x.......'},bat:{pat:'k.......k..k....',v:.5},nome:'Fim do mundo'},
 ilha:{L:3.8,prog:[[55,59,62,67],[60,64,67,72],[62,66,69,74],[55,59,62,67]],esc:[67,69,71,74,76,79],mel:{w:'triangle',v:.03,n:5,st:.5},pad:{w:'sine',v:.03},baixo:{w:'triangle',v:.05,pat:'x..x..x.'},bat:{pat:'..h...h...h...h.',v:.25},nome:'Maré'},
 fantasia:{L:4.6,prog:[[50,57,62,66],[47,54,59,62],[43,50,55,59],[45,52,57,61]],esc:[74,76,78,81,83,86],mel:{w:'triangle',v:.03,n:5,st:.55},pad:{w:'triangle',v:.03},baixo:{w:'sine',v:.05,pat:'x...x...'},bat:null,nome:'Reino distante'},
 marte:{L:6,prog:[[45,52,59,64],[47,54,61,66],[43,50,57,62],[45,52,59,64]],esc:[76,79,81,83,88],mel:{w:'sine',v:.025,n:3,st:1.6,vib:5},pad:{w:'sawtooth',v:.012},bat:null,nome:'Poeira vermelha'},
};
function nlTrilhaAtual(){ const m=S&&S.me; if(!m||!m.alive) return 'adulto';
  if(S.scen) return {zumbi:'zumbi',ilha:'ilha',isekai:'fantasia',marte:'marte',heroi:'heroi'}[S.scen.id]||'fantasia';
  if(m.prison) return 'prisao';
  if(m.criatura==='lobisomem') return 'lobisomem'; if(m.criatura==='vampiro') return 'vampiro';
  const cargo=typeof chefeEstado==='function'?chefeEstado():null;
  if(m.c&&m.c.reiMundo&&cargo) return 'imperio';
  if(cargo==='reg') return 'ditador'; if(cargo==='pres') return 'presidente'; if(cargo==='rei'||(m.royal&&!m.royal.abd)) return 'realeza';
  try{ if(typeof seita==='function'){ const s=seita(); if(s&&!s.membro) return 'culto'; } }catch(e){}
  try{ if(typeof pn==='function'&&pn().ativa) return 'paranormal'; }catch(e){}
  const j=m.job; if(j){ if(j.spc) return {crime:'crime',militar:'militar',atleta:'atleta',musico:'musico',ator:'fama',modelo:'fama',lutador:'lutador'}[j.spc]||'adulto'; if(['poli','peri','perju'].includes(j.id)) return 'investigador'; }
  if(m.biz) return 'empresario'; if((m.fame||0)>=70) return 'fama';
  const a=m.age; return a<3?'bebe':a<12?'infancia':a<18?'adolescencia':a<30?'jovem':a<50?'adulto':a<68?'maturidade':'velhice'; }
let nlTrilhaUlt=null;
function nlMusicaCompasso(){ const c=SND.ctx; if(!c||!musOn()){ SND.timer=null; return; } const id=nlTrilhaAtual(), T=NL_TRILHAS[id]||NL_TRILHAS.adulto;
  if(id!==nlTrilhaUlt){ if(nlTrilhaUlt){ SND.mus.gain.setTargetAtTime(.05,c.currentTime,.3); SND.mus.gain.setTargetAtTime(.55,c.currentTime+.8,1.2); } nlTrilhaUlt=id; SND.step=0; }
  const t=c.currentTime+.05, L=T.L, ch=T.prog[SND.step%T.prog.length]; SND.step++;
  const d=SND.mus;
  ch.forEach((n,i)=>sTone(N(n),t+i*.04,L+.4,{type:T.pad.w,vol:T.pad.v*(i?1:1.3),dest:d,attack:Math.min(1.4,L*.25),release:L+.4}));
  if(T.baixo){ const st=L/T.baixo.pat.length; [...T.baixo.pat].forEach((x,i)=>{ if(x==='x') sTone(N(ch[0]-12),t+i*st,st*1.8,{type:T.baixo.w,vol:T.baixo.v,dest:d,attack:.01,release:st*1.8}); }); }
  if(T.bat){ const p=T.bat.pat, st=L/p.length, v=T.bat.v; [...p].forEach((x,i)=>{ const tt=t+i*st; if(x==='k') sTone(120,tt,.18,{vol:.16*v,slide:45,dest:d}); else if(x==='s'){ sNoiseD(tt,.1,1900,.6,.07*v,d); } else if(x==='h') sNoiseD(tt,.03,9000,1,.03*v,d,'highpass'); else if(x==='t') sTone(170,tt,.18,{vol:.12*v,slide:90,dest:d}); }); }
  const M=T.mel; for(let k=0;k<M.n;k++) if(Math.random()<.7){ const tt=t+.2+k*M.st+Math.random()*.08; sTone(N(R.pick(T.esc)),tt,M.st*1.6,{type:M.w,vol:M.v,dest:d,attack:.015,release:M.st*1.6}); }
  SND.timer=setTimeout(nlMusicaCompasso,L*1000); }
function sNoiseD(t0,dur,freq,q,vol,dest,type='bandpass'){ const c=SND.ctx, b=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate), dd=b.getChannelData(0); for(let i=0;i<dd.length;i++) dd[i]=Math.random()*2-1;
  const s=c.createBufferSource(); s.buffer=b; const f=c.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q; const g=c.createGain(); g.gain.setValueAtTime(vol,t0); g.gain.exponentialRampToValueAtTime(.0001,t0+dur); s.connect(f); f.connect(g); g.connect(dest); s.start(t0); s.stop(t0+dur+.02); }
startMusic=function(){ const c=audio(); if(!c||!musOn()||SND.timer) return; if(c.state==='suspended') c.resume();
  SND.mus.gain.cancelScheduledValues(c.currentTime); SND.mus.gain.setTargetAtTime(.55,c.currentTime,1.5); nlMusicaCompasso(); };
stopMusic=function(){ if(SND.timer){ clearTimeout(SND.timer); SND.timer=null; } if(SND.ctx) SND.mus.gain.setTargetAtTime(0,SND.ctx.currentTime,.4); };

function sons200SelfTest(){ const erros=[], ok=(c,x)=>{ if(!c) erros.push(x); };
  ok(Object.keys(SFX).length>=200,'menos de 200 sons: '+Object.keys(SFX).length);
  for(const n of Object.values(NL_SOM_K).concat(NL_SOM_L.map(x=>x[1]),NL_SOM_ACAO.map(x=>x[1]))) ok(SFX[n],'som que não existe: '+n);
  // toca cada som num contexto de áudio desligado para ver se nenhum quebra
  const OC=window.OfflineAudioContext||window.webkitOfflineAudioContext;
  if(OC){ const salvo={ctx:SND.ctx,fx:SND.fx,rev:SND.rev,mus:SND.mus}; try{ const c=new OC(1,44100,44100); SND.ctx=c; SND.fx=c.destination; SND.mus=c.destination; SND.rev=null;
     for(const [n,fn] of Object.entries(SFX)){ try{ fn(0); }catch(e){ erros.push('som '+n+' quebrou: '+e.message); } }
     for(const id of Object.keys(NL_TRILHAS)){ const T=NL_TRILHAS[id]; ok(T.prog&&T.esc&&T.pad&&T.mel,'trilha incompleta: '+id); }
   }finally{ Object.assign(SND,salvo); } }
  ok(Object.keys(NL_TRILHAS).length>=25,'poucas trilhas');
  if(erros.length) throw Error('Sons 3.2 · '+erros.slice(0,6).join(' | ')); return {ok:true,sons:Object.keys(SFX).length,trilhas:Object.keys(NL_TRILHAS).length}; }
