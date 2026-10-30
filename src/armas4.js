// ===== 3.6: 80 armas desenhadas, com o mesmo acabamento dos itens =====
// Entram no catálogo ARMAS (mesmas regras de lei por país). IDs permanentes.
const A4M={preto:'#2E2B33',aco:'#9AA3B0',inox:'#C9CED8',ouro:'#E0B44A',bronze:'#B07A3C',verde:'#55604A',areia:'#C8B48A',cinza:'#5E6470',azul:'#3E5A8A',rosa:'#E890B0',branco:'#E8EAEE'};
const A4G={madeira:'#8A5A32',clara:'#C08A52',preto:'#2A272E',borracha:'#3A3640',marfim:'#E8DCC0',verde:'#4E5A40',vermelho:'#8E2B2B',perola:'#F2EEE6'};
// formas: cada uma recebe metal (m), cabo (g) e opções
const A4S=(d,c,w=2)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const A4F={
 pist:(m,g,o)=>{ const L=o.l||1, xe=8+44*L, dk=bxD(m,.35), lt=bxL(m,.35);
  return (o.sup?I4R(xe,17.5,14,6,bxD(m,.15),2.5)+A4S(`M${xe+3} 18.5v4M${xe+6} 18.5v4M${xe+9} 18.5v4`,dk,.8):'')+(o.cano?I4R(xe-1,18,5,5,dk,1):'')
   +I4P(`M12 25H${xe-4}V29H34L30 31Z`,bxD(m,.1))
   +I4P(`M13 25L30 25L31 29Q31 31.5 29 33L25 51Q24.5 55 20.5 55H12.5Q9 55 9.6 51.5L13.5 33Q11.5 29 13 25Z`,g)
   +[[15,36],[18,36],[21,36],[14.5,41],[17.5,41],[20.5,41],[14,46],[17,46],[20,46]].map(([x,y])=>I4C(x,y,.7,bxD(g,.35))).join('')
   +I4R(9.5,52.5,13,3,dk,1)
   +A4S('M30 29.5Q30.5 38.5 37.5 38.5Q41.5 38.5 41.5 33.5V29.5',m,2.6)+A4S('M34.5 30Q32.5 33.5 34 36',dk,1.6)
   +I4P(`M8 15.5H${xe-1}Q${xe+1.5} 15.5 ${xe+1.5} 18V24.5H8Q6 24.5 6 22.5V17.5Q6 15.5 8 15.5Z`,m)
   +A4S('M11 17v6M13.2 17v6M15.4 17v6M17.6 17v6',dk,.9)+I4R(30,16.8,10,3.6,dk,1)+A4S(`M20 16.6H${xe-2}`,lt,.8)
   +I4R(8,13.6,4,2,dk,.5)+I4R(xe-4,13.6,2.2,2,dk,.5)
   +(o.mira?I4R(24,8,16,5,'#26232B',2.5)+I4C(39,10.5,2,'#6EC6FF')+I4R(28,13,3,2.6,'#26232B',.5)+I4R(34,13,3,2.6,'#26232B',.5):'')
   +(o.det?A4S(`M42 21.5H${xe-3}`,lt,.6):''); },
 rev:(m,g,o)=>{ const L=o.l||1, xe=30+26*L, dk=bxD(m,.35), lt=bxL(m,.35);
  return I4R(28,16,xe-28,6.5,m,1.5)+I4R(28,13.8,xe-28,2.4,bxD(m,.12),1)+I4R(xe-3,11.6,2.4,2.4,dk,.5)+I4R(28,22.5,Math.min(xe-28,18*L),3,bxD(m,.15),1.2)+A4S(`M30 18.5H${xe-2}`,lt,.7)
   +I4P('M15 15H29V30Q29 33 26 33H19L15 30Z',bxD(m,.08))
   +I4R(16.5,15.5,12,14,m,3)+A4S('M19 17v11M22.5 17v11M26 17v11',dk,1.1)+A4S('M17 21.5h11',lt,.5)
   +I4P('M15 16L9.5 10.5Q8.5 9.5 10 9L13 9.5L17 15Z',dk)
   +I4P('M16 30Q9 33 7.5 43Q6.5 52 10.5 54.5H16.5Q20 54 19 50Q17.5 41 23 33Z',g)+A4S('M11 41q3 1 6 0M10.5 46q3 1 6 0',bxD(g,.35),.8)+I4C(13.5,37,1.2,lt)
   +A4S('M20.5 33Q20.5 40.5 27 40.5Q30.5 40.5 30.5 35V32',m,2.4)+A4S('M25 33.5Q23.5 36 25 38',dk,1.5)
   +(o.mira?I4R(32,6.5,20,5,'#26232B',2.5)+I4C(51,9,2,'#6EC6FF')+I4R(36,11.5,3,2.4,'#26232B',.5)+I4R(45,11.5,3,2.4,'#26232B',.5):''); },
 esp:(m,g,o)=>{ const L=o.l||1, xe=Math.min(62,38+24*L), dk=bxD(m,.35), lt=bxL(m,.35);
  return I4P('M27 26L10 27.5Q3 28 2.5 33V41Q2.5 44 6 43L17 37L27 33.5Z',g)+I4R(1.5,28,3,15,'#26232B',1.2)+A4S('M8 31q6-1 14-2',bxL(g,.25),.7)
   +A4S('M29 32.5Q29 38.5 33.5 38.5Q36.5 38.5 36.5 33',m,2.2)+A4S('M32.5 33Q31.5 35.5 33 37',dk,1.3)
   +I4R(25,21.5,13,11,m,2)+I4R(29,23.5,6,3,dk,.8)+A4S('M26 23h11',lt,.6)
   +I4R(37,22.5,xe-37,3.6,m,1.2)+A4S(`M38 23.5H${xe-1}`,lt,.5)+I4C(xe-1.5,21.8,.9,'#E0B44A')
   +(o.duplo?I4R(37,26.4,xe-37,3.6,bxD(m,.08),1.2):I4R(37,26.4,(xe-37)*.82,2.8,bxD(m,.12),1.2))
   +(o.pump?I4R(41,25.6,13,6,g,2.4)+A4S('M44 26.5v4M47 26.5v4M50 26.5v4',bxD(g,.35),.8):I4P(`M37 26.4H${37+(xe-37)*.5}V30L37 32Z`,g))
   +(o.cx?I4P('M30 32.5H36L37 41H31Z',dk):''); },
 rif:(m,g,o)=>{ const L=o.l||1, dk=bxD(m,.35), lt=bxL(m,.35), tat=!!o.mag, xe=Math.min(62,44+18*L);
  let s='';
  if(tat){ s+=(o.coronha?I4P('M24 24.5L7 25V34L4 35V38L9 38L24 31Z',m)+A4S('M9 28h12',dk,1):I4P('M24 24L8 25.5Q3 26 3 30V37Q3 39.5 6 38.5L15 34L24 31Z',g)+I4R(2,26,3,12,'#26232B',1));
   s+=I4P('M26 31L31 31L29 42Q28.4 44.5 26 43.6L24.5 41Z',g)+A4S('M26 34.5l3 .4M25.6 37.5l3 .4',bxD(g,.35),.7);
   s+=A4S('M30 31Q30 36 34 36Q36 36 36 33',m,2)+A4S('M32.5 31.5Q31.5 33.5 33 35',dk,1.2);
   s+=I4P('M33 31H39Q40.5 37 43.5 41.5L38 44Q34.5 38.5 33 31Z',dk)+A4S('M35 33.5h4M35.8 36.5h4',bxL(dk,.2),.6);
   s+=I4R(23,21,20,10,m,1.5)+I4R(28,22.8,7,2.8,dk,.6)+A4S('M24 22.2h18',lt,.6);
   s+=I4R(42,21.6,xe-42-6,8.4,bxD(m,.05),2)+[0,1,2,3].map(i=>I4R(44.5+i*3.2,24.2,1.6,3.6,dk,.6)).join('');
   s+=I4R(xe-6,24,6,2.8,m,1)+I4R(xe-1.6,23.2,2.6,4.4,dk,.8);
   if(o.trilho) s+=A4S(`M24 20.2H${xe-8}`,dk,1.4)+A4S(`M25 20.2H${xe-9}`,lt,.4);
  } else {
   s+=I4P(`M2.5 31Q2.5 26 7 25.5L24 26.5L${xe-10} 27.4V31.4L30 32.4L21 34.4L8 39.5Q2.5 40.5 2.5 37.5Z`,g)+I4R(1.5,26.6,3,13,'#26232B',1)+A4S(`M9 30q10-1 ${xe-22} -1.6`,bxL(g,.25),.6);
   s+=A4S('M28 32Q28 37.5 32 37.5Q34.5 37.5 34.5 32.6',m,2)+A4S('M31 32.6Q30 34.6 31.5 36.4',dk,1.2);
   s+=I4R(24,22.6,14,5.4,m,1.6)+A4S('M30 22.6Q30 18.5 33 18.5',m,1.6)+I4C(33.5,18.4,1.6,dk);
   s+=I4R(37,23.4,xe-37,3,m,1)+A4S(`M38 24.2H${xe-1}`,lt,.45)+I4R(xe-3,21.6,1.6,1.8,dk,.4);
  }
  if(o.mira) s+=I4P('M24 13.5h4l2-1.5h12l2 1.5h4v5h-4l-2 1.5H30l-2-1.5h-4Z','#26232B')+I4C(47,16,2.2,'#6EC6FF')+I4C(46.6,15.4,.7,'#FFFFFF')+I4R(31,19.5,3,2.8,'#26232B',.5)+I4R(39,19.5,3,2.8,'#26232B',.5)+A4S('M31 14.2h10',bxL('#26232B',.3),.5);
  return s; },
 faca:(m,g,o)=>{ const L=o.l||1, xe=30+28*L, lt=bxL(m,.45), dk=bxD(m,.3);
  const blade=o.curva?`M29 25Q${xe-6} 16 ${xe} 26Q${xe-10} 24 ${xe-14} 31Q${xe-22} 34 29 32Z`:`M29 24H${xe-6}Q${xe-1} 24 ${xe+1} 28.5Q${xe-4} 32.5 ${xe-10} 33H29Z`;
  return I4P(blade,m)+A4S(o.curva?`M30 29Q${xe-12} 26 ${xe-2} 26.5`:`M30 29H${xe-8}Q${xe-3} 29 ${xe} 28.6`,lt,.8)+A4S(`M31 25.6H${xe-10}`,dk,.6)
   +(o.serr?A4S('M33 24l1.5-2 1.5 2 1.5-2 1.5 2 1.5-2 1.5 2 1.5-2 1.5 2',dk,.9):'')
   +I4R(25.5,20.5,4,15,bxD(m,.22),1.6)
   +I4P('M6.5 25Q4 28.5 6.5 32H25.5V25Z',g)+A4S('M11 25.4q1.5 3.3 0 6.4M16 25.4q1.5 3.3 0 6.4M21 25.4q1.5 3.3 0 6.4',bxD(g,.35),.7)+I4C(9,28.6,1,'#E8EAEE')+I4C(19,28.6,1,'#E8EAEE')+I4R(3,25.6,3.5,6,bxD(m,.22),1.4); },
 espada:(m,g,o)=>{ const lt=bxL(m,.45), gd=o.ouro?'#E0B44A':bxD(m,.25);
  return (o.curva?I4P('M22 32Q40 30 60 16Q50 30 24 35.5Z',m)+A4S('M24 33.5Q42 31 58 18',lt,.7):I4P('M22 29.5H56L61 32L56 34.5H22Z',m)+A4S('M24 32H55',bxD(m,.2),.8)+A4S('M24 30.6H55',lt,.5))
   +I4P('M18 24Q16 32 18 40H22Q20 32 22 24Z',gd)+I4R(6,29,12,6,g,2.4)+A4S('M8 29.5l2 5M11 29.5l2 5M14 29.5l2 5',bxD(g,.4),.7)+I4C(4.5,32,2.8,gd)+I4C(4,31.2,.9,'#FFFFFF'); },
 mach:(m,g,o)=>I4P('M8 46Q20 43 36 38L37 41.5Q21 46.5 9 49.5Q6 49 8 46Z',g)+A4S('M12 46.5q10-3 22-7',bxL(g,.25),.6)
   +(o.duplo?I4P('M34 22Q46 28 50 40Q44 50 36 52Q38 44 34 38Q30 44 26 50Q24 40 30 30Z',m)+A4S('M48 40Q44 47 38 50',bxL(m,.45),.8):I4P('M33 30H42Q52 32 54 44Q48 44 44 42L38 41L33 39Z',m)+A4S('M53 43Q50 36 45 33',bxL(m,.45),.8))+I4R(31,34,6,9,bxD(m,.25),1.5),
 taco:(m,g,o)=>I4P('M8 42Q7 39 10 38.5L46 30Q58 28 59 34Q60 40 48 40L11 44.5Q8 44.5 8 42Z',g)+A4S('M16 40q16-3 30-6M20 42q14-2 26-4',bxL(g,.3),.6)+I4R(5,37.5,4,8.5,bxD(g,.35),1.6)+I4P('M9 38.5L19 36.5L20 42.8L10 44.3Z','#2A272E')+A4S('M12 38v6M15 37.4v6M18 36.8v6',bxL('#2A272E',.25),.6),
 soco:(m,g,o)=>{ const dk=bxD(m,.4), lt=bxL(m,.45);
  return I4P('M8 26Q8 18 16 18H50Q58 18 58 26Q58 31 54 33Q52 46 32 48Q14 46 12 33Q8 31 8 26Z',m)+[16,26,36,46].map(x=>I4E(x+1,26,4.4,4.6,'#1E1A26')+A4S(`M${x-2} 23.5q3-2 6 0`,lt,.6)).join('')+A4S('M16 38q16 6 32 0',dk,1)+A4S('M12 21h40',lt,.6); },
 arco:(m,g,o)=>A4S('M20 5Q40 18 34 32Q40 46 20 59',bxD(g,.35),4.6)+A4S('M20 5Q40 18 34 32Q40 46 20 59',g,3.2)+A4S('M21.5 7Q37 18 33 28',bxL(g,.35),.8)+A4S('M20 5L22 32 20 59','#E8E4D8',.8)
   +I4R(31,27,6,10,'#2A272E',2.4)+(o.flecha?A4S('M8 32H58','#8A5A32',1.6)+I4P('M56 29.5L62 32L56 34.5Z','#9AA3B0')+I4P('M8 32L4 28.5H9L12 32L9 35.5H4Z','#E5484D'):''),
 besta:(m,g,o)=>I4P('M6 33Q4 33 4 36V40Q4 42 7 41L18 37H56V32H18Z',g)+A4S('M10 35h40',bxL(g,.25),.6)+I4R(14,37,6,9,g,2)+A4S('M22 37Q22 42 26 42Q28 42 28 38',bxD(m,.2),1.6)
   +A4S('M46 16Q54 33 46 50',bxD(m,.3),4)+A4S('M46 16Q54 33 46 50',m,2.6)+A4S('M46 16L26 33L46 50','#E8E4D8',.8)+I4R(24,27.5,18,3.2,bxD(m,.15),1)+I4P('M42 29L50 30.5L42 32Z','#9AA3B0')+(m!==A4M.aco?I4R(28,23,12,4,'#26232B',2)+I4C(40,25,1.4,'#6EC6FF'):''),
};
// nome:id:forma:tipo:cat:preço:poder:metal:cabo:opções(l=comprimento, flags)
const ARMAS4_TXT=`Pistola compacta 9 mm:p_compacta9:pist:fogo:curta:6500:58:preto:borracha:l=.8
Pistola de serviço 9 mm:p_servico9:pist:fogo:curta:7500:60:preto:borracha:l=1,det
Pistola .40 policial:p_policial40:pist:fogo:curta:8500:63:cinza:borracha:l=1,det
Pistola .45 clássica:p_classica45:pist:fogo:curta:9000:65:aco:madeira:l=1.1
Pistola .380 de bolso:p_bolso380:pist:fogo:curta:4500:50:inox:preto:l=.65
Pistola .22 de tiro esportivo:p_esporte22:pist:fogo:curta:4000:40:aco:clara:l=1.25,cano
Pistola com silenciador:p_silenc:pist:fogo:curta:14000:62:preto:borracha:l=.95,sup
Pistola de longo alcance:p_longo:pist:fogo:curta:12000:64:preto:borracha:l=1.3,mira
Pistola .50 pesada:p_pesada50:pist:fogo:curta:18000:75:inox:preto:l=1.35,det
Pistola dourada de colecionador:p_dourada:pist:fogo:curta:45000:60:ouro:perola:l=1.1,det
Pistola de polímero areia:p_areia:pist:fogo:curta:7000:58:areia:areia:l=.95
Pistola cromada:p_cromada:pist:fogo:curta:11000:62:inox:marfim:l=1.05,det
Pistola rosa:p_rosa:pist:fogo:curta:6500:56:rosa:preto:l=.85
Pistola verde militar:p_militar:pist:fogo:curta:8000:61:verde:verde:l=1,det
Pistola antiga de 1911:p_1911:pist:fogo:curta:15000:63:bronze:madeira:l=1.1
Pistola de competição:p_competicao:pist:fogo:curta:20000:66:azul:preto:l=1.2,cano,det
Pistola .25 de bolsa:p_bolsa25:pist:fogo:curta:3500:38:branco:perola:l=.55
Pistola 10 mm:p_10mm:pist:fogo:curta:9500:67:preto:vermelho:l=1.05
Pistola de treino com mira:p_treino:pist:fogo:curta:6000:50:cinza:borracha:l=1,mira
Pistola automática:p_auto:pist:fogo:curta:22000:70:preto:borracha:l=1.1,det,cano
Revólver .38 curto:r_38curto:rev:fogo:curta:4500:55:preto:madeira:l=.6
Revólver .38 de cano longo:r_38longo:rev:fogo:curta:5500:57:aco:madeira:l=1.2
Revólver .357:r_357:rev:fogo:curta:8000:66:inox:borracha:l=1
Revólver .44 magnum:r_44:rev:fogo:curta:12000:74:inox:madeira:l=1.4
Revólver .22 de oito tiros:r_22:rev:fogo:curta:3500:42:aco:clara:l=1
Revólver de faroeste:r_faroeste:rev:fogo:curta:9000:60:bronze:marfim:l=1.3
Revólver dourado:r_dourado:rev:fogo:curta:40000:62:ouro:perola:l=1.1
Revólver de caça com luneta:r_caca:rev:fogo:curta:14000:72:preto:borracha:l=1.5,mira
Revólver de bolso:r_bolso:rev:fogo:curta:4000:48:preto:preto:l=.45
Revólver .454 gigante:r_454:rev:fogo:curta:16000:80:inox:preto:l=1.55
Espingarda de caça calibre 12:e_caca12:esp:fogo:longa:9000:70:aco:madeira:l=1
Espingarda de dois canos:e_duplo:esp:fogo:longa:12000:72:aco:madeira:l=1,duplo
Espingarda de cano serrado:e_serrada:esp:fogo:longa:7000:74:preto:madeira:l=.45,duplo
Espingarda de bomba:e_pump:esp:fogo:longa:8500:71:preto:borracha:l=.95,pump
Espingarda tática:e_tatica:esp:fogo:longa:14000:74:preto:borracha:l=.9,pump,cx
Espingarda semiautomática:e_semi:esp:fogo:longa:16000:73:cinza:preto:l=1,cx
Espingarda calibre 20:e_c20:esp:fogo:longa:7000:64:aco:clara:l=.95
Espingarda calibre 28 de luxo:e_luxo:esp:fogo:longa:35000:62:ouro:madeira:l=1,duplo
Espingarda calibre .410:e_410:esp:fogo:longa:5000:55:aco:clara:l=.85
Espingarda de tiro ao prato:e_prato:esp:fogo:longa:22000:68:azul:madeira:l=1.1,duplo
Espingarda camuflada:e_camuflada:esp:fogo:longa:10000:70:verde:verde:l=1,pump
Espingarda de cartucho antiga:e_antiga:esp:fogo:longa:6000:60:bronze:madeira:l=1.05
Espingarda de policial:e_policia:esp:fogo:longa:11000:72:preto:preto:l=.9,pump
Espingarda de carregador:e_carreg:esp:fogo:longa:18000:75:preto:borracha:l=.9,cx
Espingarda de caça ao pato:e_pato:esp:fogo:longa:9500:66:areia:clara:l=1.2
Carabina .22:c_22:rif:fogo:longa:5000:45:aco:clara:l=.8
Carabina de alavanca:c_alavanca:rif:fogo:longa:9000:62:bronze:madeira:l=.9
Rifle de caça com luneta:c_caca:rif:fogo:longa:15000:76:aco:madeira:l=1,mira
Rifle de precisão:c_precisao:rif:fogo:fuzil:40000:85:verde:verde:l=1.2,mira,mag
Rifle de ferrolho clássico:c_ferrolho:rif:fogo:longa:12000:72:aco:madeira:l=1.05
Carabina de pressão:c_pressao:rif:fogo:longa:1500:20:preto:clara:l=.9
Fuzil semiautomático:c_fuzil:rif:fogo:fuzil:30000:80:preto:preto:l=.95,mag,trilho
Fuzil de assalto:c_assalto:rif:fogo:fuzil:45000:84:preto:borracha:l=.95,mag,coronha
Fuzil de areia do deserto:c_deserto:rif:fogo:fuzil:42000:82:areia:areia:l=.95,mag,trilho
Submetralhadora:c_sub:rif:fogo:fuzil:35000:76:preto:preto:l=.5,mag,coronha
Carabina compacta:c_compacta:rif:fogo:fuzil:28000:74:cinza:preto:l=.65,mag,trilho
Rifle antigo de guerra:c_guerra:rif:fogo:longa:18000:74:bronze:madeira:l=1.1
Rifle de colecionador dourado:c_dourado:rif:fogo:longa:90000:72:ouro:madeira:l=1,mira
Rifle de caça grossa:c_grossa:rif:fogo:fuzil:60000:90:aco:madeira:l=1.15,mira
Fuzil de batalha:c_batalha:rif:fogo:fuzil:50000:86:verde:verde:l=1.05,mag,trilho
Canivete suíço:b_suico:faca:branca::150:20:inox:vermelho:l=.4
Faca de cozinha:b_cozinha:faca:branca::80:22:inox:preto:l=.7
Faca tática:b_tatica:faca:branca::450:26:preto:borracha:l=.8,serr
Faca de caça:b_caca:faca:branca::600:28:aco:madeira:l=.9
Faca de sobrevivência:b_sobrev:faca:branca::700:28:aco:verde:l=.95,serr
Faca curva karambit:b_karambit:faca:branca::900:27:preto:preto:l=.6,curva
Facão:b_facao:faca:branca::300:30:aco:madeira:l=1.1
Adaga antiga:b_adaga:faca:branca::4000:27:bronze:marfim:l=.75
Katana de colecionador:b_katana:espada:branca::3500:34:inox:preto:curva
Espada medieval:b_medieval:espada:branca::5000:35:aco:madeira:ouro
Sabre de cavalaria:b_sabre:espada:branca::7000:33:inox:marfim:curva,ouro
Machado:b_machado:mach:branca::250:32:aco:madeira
Machado de guerra:b_machguerra:mach:branca::3000:36:preto:preto:duplo
Taco de beisebol:b_taco:taco:branca::200:24:aco:clara
Soco inglês:b_soco:soco:branca::120:18:aco:preto:proibido
Arco recurvo:o_recurvo:arco:branca::900:30:aco:madeira:flecha
Arco composto:o_composto:arco:branca::3500:36:preto:preto:flecha
Arco longo de madeira:o_longo:arco:branca::600:28:aco:clara:flecha
Besta:o_besta:besta:branca::2500:40:aco:madeira
Besta tática:o_bestat:besta:branca::5500:44:preto:preto`;
const ARMAS4=[];
(()=>{ ARMAS4_TXT.split('\n').forEach(l=>{ const [n,id,f,tipo,cat,preco,pow,m,g,ops]=l.split(':'); const o={}; (ops||'').split(',').filter(Boolean).forEach(x=>{ const [k,v]=x.split('='); o[k]=v==null?1:+v; });
  const a={n,id,f,tipo,cat:cat||undefined,preco:+preco,pow:+pow,kill:Math.round(Math.min(.5,(+pow)/180)*100)/100,proibido:o.proibido?1:undefined,dur:tipo==='fogo'?25:15,m:A4M[m]||m,g:A4G[g]||g,o};
  ARMAS4.push(a); })})();
const A4T={pist:'translate(4 1)',rev:'translate(4 2)',esp:'translate(0 8)',rif:'translate(0 10)',faca:'translate(0 8)',espada:'translate(0 8)',mach:'translate(2 2)',taco:'translate(0 6)',soco:'translate(0 4)',arco:'',besta:'translate(0 2)'};
const arma4SVG=a=>i4(`<g transform="${A4T[a.f]||''}">${A4F[a.f](a.m,a.g,a.o)}</g>`);
// entram no catálogo de armas (os ids antigos continuam valendo nos saves)
ARMAS4.forEach(a=>{ if(ARMAS[a.id]) return; ARMAS[a.id]={n:a.n,ic:arma4SVG(a),tipo:a.tipo,cat:a.cat,preco:a.preco,pow:a.pow,kill:a.kill,proibido:a.proibido,dur:a.dur,a4:1}; });
// armas antigas ganham desenho também
[['canivete','b_suico'],['faca','b_tatica'],['taco','b_taco'],['soco','b_soco'],['machete','b_facao'],['katana','b_katana'],['revolver','r_38curto'],['pistola','p_servico9'],['espingarda','e_caca12'],['fuzil','c_fuzil']].forEach(([v,n])=>{ const a=ARMAS4.find(x=>x.id===n); if(ARMAS[v]&&a){ ARMAS[v].ic=arma4SVG(a); ARMAS[v].velha=1; } });
// na loja, as antigas saem da lista (continuam no inventário de quem já tem) e as novas aparecem por categoria
V.armas=(o=>function(){ const r=o.apply(this,arguments); try{ const nomes=new Set(Object.values(ARMAS).filter(a=>a.velha).map(a=>a.n)); let sec='';
  r.items=r.items.filter(x=>{ if(x.sec){ sec=x.sec; return true; } return !(sec!=='Minhas armas'&&nomes.has(x.l)&&!/Comigo/.test(x.r||'')); });
  const grp={pist:'Pistolas',rev:'Revólveres',esp:'Espingardas',rif:'Rifles e carabinas',faca:'Armas brancas',espada:'Armas brancas',mach:'Armas brancas',taco:'Armas brancas',soco:'Armas brancas',arco:'Arcos e bestas',besta:'Arcos e bestas'};
  const i=r.items.findIndex(x=>x.sec==='Armas brancas'), novos=[];
  for(const g of ['Pistolas','Revólveres','Espingardas','Rifles e carabinas','Armas brancas','Arcos e bestas']){ novos.push({sec:g});
    ARMAS4.filter(a=>grp[a.f]===g).forEach(a=>{ const ok=armaLegal(a.id); novos.push({ic:ARMAS[a.id].ic,l:a.n,s:ok?`${fmt(a.preco)} · poder ${a.pow}`:`Proibida para mim aqui · mercado negro: ${fmt(Math.round(a.preco*2.5))}`,tone:ok?'':'bad',on:()=>act(()=>armaComprar(a.id,ok?'loja':'negro'),a.n)}); }); }
  const fim=i>=0?i:r.items.length; r.items=r.items.slice(0,fim).filter(x=>!(x.sec==='Armas de fogo')).concat(novos); }catch(e){} return r; })(V.armas);
function armas4SelfTest(){ const f=[], ids=new Set();
  ARMAS4.forEach(a=>{ if(ids.has(a.id)) f.push('id '+a.id); ids.add(a.id); const s=arma4SVG(a); if(!/^<svg/.test(s)||s.length<300) f.push('desenho '+a.id); if(!ARMAS[a.id]) f.push('catálogo '+a.id); });
  const c=t=>ARMAS4.filter(a=>a.f===t).length; if(ARMAS4.length<80) f.push('poucas armas '+ARMAS4.length); if(c('pist')<20||c('rev')<10||c('esp')<15||c('rif')<15) f.push('categorias');
  if(f.length) throw Error('Armas 3.6 · '+f.slice(0,5).join(' | ')); return {ok:true}; }
