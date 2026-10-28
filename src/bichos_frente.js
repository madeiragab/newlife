// ===== 3.3: bichos de frente para a câmera =====
// Desenho de corpo inteiro visto de frente, com volume (sombreado por parte do corpo), contorno fino, pelagem
// marcada nas bordas e olhos com íris e pupila da espécie (fenda no gato, horizontal na cabra e no cavalo).
const BXF_G=95;
// pose: sit = sentado (cães, gatos, felinos), stand = em pé de frente (cavalo, lhama, cabra, porco, capivara),
// blob = corpo redondo (roedores, ouriço). Medidas em unidades da tela (100 x 100).
const BXF={
 Cachorro:{pose:'sit',earH:.36,bw:40,bh:44,lw:8,hw:30,hh:26,mw:17,mh:13,nose:'cao',pup:'r'},
 Gato:{pose:'sit',bw:34,bh:40,lw:6.5,hw:29,hh:24,mw:12,mh:8,nose:'gato',pup:'v',tufo:1,whisk:1},
 Raposa:{pose:'sit',bw:32,bh:40,lw:6,hw:31,hh:25,mw:9,mh:12,nose:'cao',pup:'v',tri:1,tufo:1},
 Lobo:{pose:'sit',earH:.5,bw:42,bh:48,lw:8.5,hw:32,hh:28,mw:15,mh:15,nose:'cao',pup:'r',tufo:1},
 Tigre:{pose:'sit',bw:46,bh:46,lw:10,hw:34,hh:30,mw:18,mh:13,nose:'felino',pup:'r',tufo:1,whisk:1},
 Leão:{pose:'sit',bw:46,bh:46,lw:10,hw:32,hh:30,mw:18,mh:14,nose:'felino',pup:'r',whisk:1},
 Coelho:{pose:'sit',bw:40,bh:34,lw:7,hw:27,hh:24,mw:12,mh:9,nose:'roedor',pup:'r',whisk:1},
 Furão:{pose:'sit',bw:26,bh:44,lw:6,hw:24,hh:20,mw:11,mh:9,nose:'roedor',pup:'r',whisk:1},
 Macaco:{pose:'sit',bw:36,bh:40,lw:6,hw:28,hh:28,mw:16,mh:12,nose:'macaco',pup:'r'},
 Hamster:{pose:'blob',bw:54,bh:48,hw:38,hh:32,mw:14,mh:10,nose:'roedor',pup:'r',whisk:1},
 'Porquinho-da-índia':{pose:'blob',bw:60,bh:44,hw:40,hh:32,mw:16,mh:11,nose:'roedor',pup:'r'},
 Chinchila:{pose:'blob',bw:50,bh:50,hw:38,hh:34,mw:12,mh:9,nose:'roedor',pup:'r',whisk:1},
 Ouriço:{pose:'blob',bw:56,bh:40,hw:30,hh:26,mw:14,mh:12,nose:'ourico',pup:'r'},
 Capivara:{pose:'stand',bw:46,bh:36,leg:14,lw:9,neck:0,hw:32,hh:30,mw:24,mh:16,nose:'capivara',pup:'r'},
 Cavalo:{pose:'stand',bw:34,bh:30,leg:26,lw:7,neck:8,hw:18,hh:30,mw:18,mh:12,nose:'cavalo',pup:'h'},
 Lhama:{pose:'stand',bw:34,bh:28,leg:24,lw:7,neck:16,hw:17,hh:20,mw:12,mh:9,nose:'lhama',pup:'r'},
 Cabra:{pose:'stand',bw:34,bh:32,leg:28,lw:6,neck:8,hw:20,hh:26,mw:13,mh:10,nose:'lhama',pup:'h'},
 Porco:{pose:'stand',bw:54,bh:40,leg:14,lw:9,neck:0,hw:38,hh:32,mw:16,mh:12,nose:'porco',pup:'r'},
};
BXF['Macaco-prego']=BXF.Macaco;
let BXF_UID=0;
const bxfShade=id=>`<radialGradient id="${id}s" cx=".36" cy=".28" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient>`;
const bxfF=(sh,c)=>sh.replace(/\/>$/,` fill="${c}"/>`);
// desenha um conjunto de partes {s: forma, c: cor}: contorno, cor, padrão recortado, volume
function bxfMonta(id,parts,pads,ow){ const all=parts.map(x=>x.s).join('');
  return `<defs>${bxfShade(id)}<clipPath id="${id}c">${all}</clipPath></defs>`+
   `<g fill="${ow}" stroke="${ow}" stroke-width="1.5" stroke-linejoin="round">${all}</g>`+parts.map(x=>bxfF(x.s,x.c)).join('')+
   `<g clip-path="url(#${id}c)">${pads}</g><g fill="url(#${id}s)">${all}</g>`; }
// olho realista: amêndoa com íris, pupila da espécie, contorno escuro e um brilho pequeno
function bxfOlho(x,y,r,cor,pup,lado){ const a=r*.62, iris=`<radialGradient id="i${++BXF_UID}" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="${bxL(cor,.25)}"/><stop offset="1" stop-color="${bxD(cor,.3)}"/></radialGradient>`, gi='i'+BXF_UID;
  const am=`M${x-r} ${y} Q${x-r*.2} ${y-a*1.25} ${x+r} ${y-a*.15} Q${x+r*.1} ${y+a*1.1} ${x-r} ${y}Z`.replace(/(-?\d+\.\d{2})\d+/g,'$1');
  const sh=lado<0?` transform="translate(${2*x} 0) scale(-1 1)"`:'';
  const pp=pup==='v'?bxE(x,y,r*.16,a*.82,` fill="#0B0806"`):pup==='h'?bxE(x,y,r*.5,a*.26,` fill="#0B0806"`):bxC(x,y,r*.4,` fill="#0B0806"`);
  return `<defs>${iris}</defs><g${sh}><path d="${am}" fill="url(#${gi})" stroke="#1A120E" stroke-width="${(r*.28).toFixed(2)}" stroke-linejoin="round"/>${pp}${bxC(x+r*.28,y-a*.32,r*.17,` fill="#fff" opacity=".85"`)}</g>`; }
// pelos nas bordas: pequenos traços para não ficar liso como desenho infantil
function bxfPelo(cx,cy,rx,ry,c,n,rd,a0=0,a1=Math.PI*2,len=2.2){ let s=''; for(let i=0;i<n;i++){ const a=a0+(a1-a0)*(i+rd()*.6)/n, x=cx+Math.cos(a)*rx, y=cy+Math.sin(a)*ry; s+=`M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a)*len+(rd()-.5)).toFixed(1)} ${(Math.sin(a)*len+(rd()-.5)).toFixed(1)}`; }
  return `<path d="${s}" stroke="${c}" stroke-width=".7" stroke-linecap="round" fill="none" opacity=".55"/>`; }

function bxfMamifero(def,f,lk,p){ const G=BXF_G, cx=50, rc=lk.rc||{}, [c1,c2,c3]=lk.c, rd=bxRng(lk.seed), id='bf'+(++BXF_UID), ow=bxD(c1,.6), pad=lk.pad;
  const k=lk.gord, hs=lk.hs||1, bw=(rc.L?f.bw*(rc.L/def.L)**.35:f.bw)*k, bh=f.bh*(rc.H?rc.H/def.H:1)**.6*(.94+(k-1)*.4), lw=(f.lw||7)*(.9+(k-.85)*.4), hw=f.hw*(rc.hr?rc.hr/def.hr:1)*hs, hh=f.hh*(rc.hr?rc.hr/def.hr:1)*hs;
  const sn=rc.sn||def.sn, mw=f.mw*(sn[1]/def.sn[1])**.5*(lk.ms||1)**.5, mh=f.mh*Math.max(.55,(sn[0]/def.sn[0]))**.45*(lk.ms||1), fofo=lk.pelo!=null?lk.pelo:(rc.fofo||def.fofo||0), mk=lk.marcas||{};
  const parts=[], A=(s,c=c1)=>parts.push({s,c}), pads=[], P=(s)=>pads.push(s), top=[], back=[];
  let hx=cx, hy;
  // ----- corpo -----
  if(f.pose==='sit'){
    const ty=G-bh*.5; hy=G-bh-hh*.18;
    back.push(bxfTail(lk,def,cx+bw*.42,G-3,c1,pad==='pontas'?c3:c1,mk.rabo?c2:bxD(c1,.08),ow,rd));
    A(bxE(cx-bw*.36,G-bh*.24,bw*.27,bh*.26)); A(bxE(cx+bw*.36,G-bh*.24,bw*.27,bh*.26));
    A(bxE(cx,G-bh*.34,bw*.5,bh*.34)); A(bxE(cx,G-bh*.66,bw*.4,bh*.36));
    A(bxE(cx-bw*.5,G-1.8,bw*.13,2.6)); A(bxE(cx+bw*.5,G-1.8,bw*.13,2.6));
    if(def.macaco){ A(bxP(`M${cx-bw*.42} ${G-bh*.78} Q${cx-bw*.62} ${G-bh*.3} ${cx-bw*.3} ${G-3} L${cx-bw*.2} ${G-5} Q${cx-bw*.4} ${G-bh*.4} ${cx-bw*.26} ${G-bh*.72}Z`)); A(bxP(`M${cx+bw*.42} ${G-bh*.78} Q${cx+bw*.62} ${G-bh*.3} ${cx+bw*.3} ${G-3} L${cx+bw*.2} ${G-5} Q${cx+bw*.4} ${G-bh*.4} ${cx+bw*.26} ${G-bh*.72}Z`)); }
    else [-1,1].forEach(s=>{ const x=cx+s*bw*.18; A(bxP(`M${x-lw/2} ${G-bh*.66} L${x-lw*.55} ${G-2} L${x+lw*.55} ${G-2} L${x+lw/2} ${G-bh*.66}Z`)); A(bxE(x,G-2,lw*.66,2.6)); });
    if(fofo) for(let i=0;i<9;i++){ const a=Math.PI*(.85+i*.16); A(bxC(cx+Math.cos(a)*bw*.46,G-bh*.5+Math.sin(a)*bh*.42,fofo>1?4.4:3.4)); }
    if(rc.saia) A(bxP(`M${cx-bw*.46} ${G-bh*.5} Q${cx-bw*.55} ${G-2} ${cx-bw*.3} ${G-1.5} L${cx+bw*.3} ${G-1.5} Q${cx+bw*.55} ${G-2} ${cx+bw*.46} ${G-bh*.5}Z`));
  } else if(f.pose==='stand'){
    const leg=f.leg*(lk.legK||1), by=G-leg-bh*.36, nk=f.neck; hy=by-bh*.42-nk-hh*.28;
    [-1,1].forEach(s=>{ const x=cx+s*bw*.24; back.push(bxP(`M${x-lw*.45} ${by} L${x-lw*.42} ${G-4} L${x+lw*.42} ${G-4} L${x+lw*.45} ${by}Z`,` fill="${bxD(c1,.3)}" stroke="${ow}" stroke-width="1.2"`)+(def.hoof?bxP(`M${x-lw*.45} ${G-7} h${lw*.9} v3 h-${lw*.9}Z`,` fill="#2A221E"`):'')); });
    if(def.porco) back.push(bxfTail(lk,def,cx+bw*.42,by-bh*.1,c1,c1,c2,ow,rd));
    A(bxE(cx,by,bw*.5,bh*.5)); A(bxE(cx,by-bh*.18,bw*.4,bh*.42));
    if(nk) A(bxP(`M${cx-bw*.3} ${by-bh*.25} Q${cx-hw*.45} ${hy+hh*.2} ${cx-hw*.38} ${hy} L${cx+hw*.38} ${hy} Q${cx+hw*.45} ${hy+hh*.2} ${cx+bw*.3} ${by-bh*.25}Z`));
    if(fofo&&nk) for(let i=0;i<8;i++){ const t=i/7; A(bxC(cx+(i%2?1:-1)*bw*(.32-.1*t),by-bh*.2-t*(by-bh*.2-hy-hh*.1),4.2)); }
    if(fofo) for(let i=0;i<8;i++){ const a=Math.PI*(.15+i*.1); A(bxC(cx+Math.cos(a)*bw*.48,by+Math.sin(a)*bh*.46,3.6)); }
    [-1,1].forEach(s=>{ const x=cx+s*bw*.3; A(bxP(`M${x-lw/2} ${by} L${x-lw*.46} ${G-2} L${x+lw*.46} ${G-2} L${x+lw/2} ${by}Z`)); if(!def.hoof) A(bxE(x,G-2,lw*.62,2.4)); });
  } else { // blob
    hy=G-f.bh*.6;
    if(def.esp) back.push(bxfEspinhos(cx,G-f.bh*.5,f.bw*.56,f.bh*.6,c3,c2,rd));
    A(bxE(cx,G-f.bh*.42,f.bw*.5*k,f.bh*.44));
    [-1,1].forEach(s=>A(bxE(cx+s*f.bw*.3,G-2,5,2.8)));
  }
  // ----- cabeça e orelhas -----
  const ear=lk.ear, ec=['pontas','mascara','tricolor'].includes(pad)?c3:c1;
  const ex=hw*.36, ey=hy-hh*.36, earIn=rc.sphynx?'#D98E8E':mixHex(c1,'#E8A4A0',.55);
  const ears=[], earsIn=[], hangs=[];
  [-1,1].forEach(s=>{ const x=cx+s*ex, X=(dx)=>(cx+s*(ex+dx)).toFixed(1);
    if(ear==='pont'){ ears.push(bxP(`M${X(-hw*.2)} ${ey+hh*.12} L${X(hw*.06)} ${ey-hh*(f.earH||.62)} L${X(hw*.2)} ${ey+hh*.18}Z`)); earsIn.push(bxP(`M${X(-hw*.1)} ${ey+hh*.06} L${X(hw*.05)} ${ey-hh*(f.earH||.62)*.65} L${X(hw*.12)} ${ey+hh*.1}Z`)); }
    else if(ear==='semi'){ ears.push(bxP(`M${X(-hw*.2)} ${ey+hh*.12} L${X(0)} ${ey-hh*.36} L${X(hw*.24)} ${ey-hh*.12} L${X(hw*.22)} ${ey+hh*.2}Z`)); }
    else if(ear==='morcego'){ ears.push(bxE(cx+s*(ex+hw*.05),ey-hh*.2,hw*.16,hh*.3,` transform="rotate(${s*18} ${cx+s*ex} ${ey})"`)); earsIn.push(bxE(cx+s*(ex+hw*.05),ey-hh*.17,hw*.08,hh*.2,` transform="rotate(${s*18} ${cx+s*ex} ${ey})"`)); }
    else if(ear==='cai') hangs.push(bxP(`M${X(-hw*.12)} ${ey-hh*.04} Q${X(hw*.34)} ${ey-hh*.12} ${X(hw*.3)} ${hy+hh*.42} Q${X(hw*.18)} ${hy+hh*.6} ${X(hw*.06)} ${hy+hh*.3}Z`));
    else if(ear==='redonda'){ ears.push(bxC(cx+s*(ex+hw*.06),ey,hw*.16)); earsIn.push(bxC(cx+s*(ex+hw*.06),ey+.4,hw*.09)); }
    else if(ear==='grande'){ ears.push(bxC(cx+s*(ex+hw*.06),ey-hh*.12,hw*.27)); earsIn.push(bxC(cx+s*(ex+hw*.06),ey-hh*.1,hw*.17)); }
    else if(ear==='longa'){ const r=` transform="rotate(${s*10} ${x} ${ey})"`; ears.push(bxE(cx+s*(ex-hw*.1),ey-hh*.9,hw*.15,hh*.85,r)); earsIn.push(bxE(cx+s*(ex-hw*.1),ey-hh*.86,hw*.07,hh*.66,r)); }
    else if(ear==='caida') hangs.push(bxE(cx+s*(ex+hw*.12),hy+hh*.12,hw*.16,hh*.62,` transform="rotate(${-s*10} ${x} ${hy})"`));
    else if(ear==='lhama'){ const r=` transform="rotate(${s*14} ${x} ${ey})"`; ears.push(bxE(x,ey-hh*.42,hw*.12,hh*.5,r)); earsIn.push(bxE(x,ey-hh*.38,hw*.05,hh*.36,r)); }
    else if(ear==='cavalo'){ ears.push(bxP(`M${X(-hw*.15)} ${ey+2} L${X(hw*.02)} ${ey-hh*.3} L${X(hw*.16)} ${ey+2}Z`)); earsIn.push(bxP(`M${X(-hw*.07)} ${ey+1} L${X(hw*.02)} ${ey-hh*.2} L${X(hw*.09)} ${ey+1}Z`)); }
    else if(ear==='porco'){ hangs.push(bxP(`M${X(-hw*.08)} ${ey+1} L${X(hw*.26)} ${ey-hh*.2} L${X(hw*.2)} ${ey+hh*.28}Z`)); }
    else if(ear==='cabra'){ hangs.push(bxE(cx+s*(ex+hw*.32),ey+hh*.18,hw*.3,hh*.1,` transform="rotate(${s*28} ${cx+s*(ex+hw*.32)} ${ey+hh*.18})"`)); }
    else if(ear==='macaco'){ ears.push(bxC(cx+s*hw*.52,hy,hw*.15)); earsIn.push(bxC(cx+s*hw*.52,hy,hw*.08)); }
  });
  const eS=lk.earS||1, eTr=`translate(${cx} ${(ey+hh*.1).toFixed(1)}) scale(${eS.toFixed(2)}) translate(${-cx} ${(-(ey+hh*.1)).toFixed(1)})`, eG=sh=>/ transform="/.test(sh)?sh.replace(/ transform="/,` transform="${eTr} `):sh.replace(/\/>$/,` transform="${eTr}"/>`);
  ears.forEach(s=>A(eG(s),ec));
  // juba atrás da cabeça
  if(def.juba&&p&&p.gender!=='F'){ const jc=bxD(c1,.3); let j=''; for(let i=0;i<22;i++){ const a=i/22*Math.PI*2, r=hw*.72+rd()*3; j+=bxE(hx+Math.cos(a)*r*.86,hy+hh*.08+Math.sin(a)*r,5.4,7.4,` transform="rotate(${(a*57.3+90).toFixed(0)} ${(hx+Math.cos(a)*r*.86).toFixed(1)} ${(hy+hh*.08+Math.sin(a)*r).toFixed(1)})" fill="${i%2?jc:bxD(jc,.15)}"`); }
    back.push(bxE(hx,hy+hh*.1,hw*.82,hh*.9,` fill="${bxD(jc,.1)}" stroke="${bxD(jc,.5)}" stroke-width="1.2"`)+j); }
  // crânio
  if(f.tri) A(bxP(`M${hx-hw*.52} ${hy-hh*.3} Q${hx} ${hy-hh*.62} ${hx+hw*.52} ${hy-hh*.3} Q${hx+hw*.48} ${hy+hh*.3} ${hx} ${hy+hh*.55} Q${hx-hw*.48} ${hy+hh*.3} ${hx-hw*.52} ${hy-hh*.3}Z`));
  else if(def.nose==='cavalo'||f.nose==='cavalo') A(bxP(`M${hx-hw*.5} ${hy-hh*.35} Q${hx} ${hy-hh*.62} ${hx+hw*.5} ${hy-hh*.35} Q${hx+hw*.42} ${hy+hh*.2} ${hx+hw*.46} ${hy+hh*.42} Q${hx} ${hy+hh*.62} ${hx-hw*.46} ${hy+hh*.42} Q${hx-hw*.42} ${hy+hh*.2} ${hx-hw*.5} ${hy-hh*.35}Z`));
  else A(bxE(hx,hy,hw*.5,hh*.5));
  if(f.tufo) [-1,1].forEach(s=>A(bxP(`M${hx+s*hw*.38} ${hy-hh*.05} L${hx+s*hw*.62} ${hy+hh*.22} L${hx+s*hw*.44} ${hy+hh*.2} L${hx+s*hw*.58} ${hy+hh*.38} L${hx+s*hw*.3} ${hy+hh*.36}Z`)));
  // focinho
  const my=hy+hh*(f.nose==='cavalo'?.3:.2), mc=['peito','malhado','tricolor','meias','pontas','listra','topete','sela'].includes(pad)?c2:mixHex(c1,c2,.35);
  const ROTT='#A65A24';
  if(f.nose!=='gato'&&f.nose!=='roedor') A(bxE(hx,my,mw*.5,mh*.5),pad==='rott'?ROTT:pad==='mascara'||pad==='pontas'?c3:mc);
  else A(bxE(hx,my,mw*.5,mh*.5),mixHex(c1,c2,.55));
  hangs.forEach(s=>A(s,pad==='tricolor'||pad==='malhado'&&rd()<.5?c3:ec));
  // ----- padrões -----
  const E=(x,y,rx,ry,c)=>P(bxE(x,y,rx,ry,` fill="${c}"`));
  const bodyY=f.pose==='blob'?G-f.bh*.42:f.pose==='sit'?G-bh*.5:G-f.leg-bh*.36;
  if(['peito','malhado','tricolor','meias','pontas','topete','estrela','sela','manchas'].includes(pad)&&!def.porco) E(cx,bodyY-bh*.05,bw*.2,bh*.38,c2);
  if(pad==='peito'||pad==='tricolor') E(hx,hy+hh*.3,hw*.22,hh*.3,c2);
  if(pad==='tricolor'){ E(hx-hw*.3,hy-hh*.1,hw*.24,hh*.38,c3); E(hx+hw*.3,hy-hh*.1,hw*.24,hh*.38,c3); P(bxP(`M${hx-2} ${hy-hh*.5} L${hx+2} ${hy-hh*.5} L${hx+mw*.3} ${my} L${hx-mw*.3} ${my}Z`,` fill="${c2}"`)); E(cx-bw*.44,bodyY,bw*.18,bh*.4,c3); E(cx+bw*.44,bodyY,bw*.18,bh*.4,c3); }
  if(pad==='malhado'){ for(let i=0;i<4;i++) E(cx+(rd()-.5)*bw*.9,bodyY+(rd()-.4)*bh*.6,bw*(.1+rd()*.1),bh*(.12+rd()*.12),rd()<.5?c2:c3); E(hx+(rd()<.5?-1:1)*hw*.22,hy-hh*.08,hw*.2,hh*.22,c3===c1?c2:c3); }
  if(pad==='manchas') for(let i=0;i<16;i++){ const big=rd()<.4; E(cx+(rd()-.5)*bw*1.05,bodyY+(rd()-.55)*bh*.95,big?2.6:1.5,big?2.1:1.3,c3); }
  if(pad==='manchas') for(let i=0;i<6;i++) E(hx+(rd()-.5)*hw*.7,hy-hh*.25+(rd()-.5)*hh*.2,1.1,1,c3);
  if(pad==='sela'){ E(cx-bw*.46,bodyY-bh*.1,bw*.2,bh*.44,c3); E(cx+bw*.46,bodyY-bh*.1,bw*.2,bh*.44,c3); E(hx,hy-hh*.42,hw*.36,hh*.22,c3); E(hx,my+mh*.1,mw*.32,mh*.35,c3); }
  if(pad==='rott'){ [-1,1].forEach(s=>{ E(hx+s*hw*.2,hy-hh*.2,2.6,1.9,ROTT); E(hx+s*hw*.3,hy+hh*.2,hw*.12,hh*.14,ROTT); P(bxP(`M${cx+s*1.2} ${bodyY-bh*.32} L${cx+s*bw*.2} ${bodyY-bh*.42} L${cx+s*bw*.12} ${bodyY-bh*.05}Z`,` fill="${ROTT}"`)); E(cx+s*bw*.18,G-3.5,lw*.75,5,ROTT); E(cx+s*bw*.5,G-2,bw*.14,3,ROTT); }); }
  if(pad==='mascara'){ E(hx-hw*.2,hy-hh*.05,hw*.18,hh*.18,c3); E(hx+hw*.2,hy-hh*.05,hw*.18,hh*.18,c3); }
  if(pad==='pontas'){ E(hx,hy+hh*.12,hw*.3,hh*.34,c3); E(cx-bw*.18,G-4,lw,7,c3); E(cx+bw*.18,G-4,lw,7,c3); E(cx-bw*.5,G-2,bw*.14,3.4,c3); E(cx+bw*.5,G-2,bw*.14,3.4,c3); }
  if(pad==='meias'||pad==='estrela'){ [-1,1].forEach(s=>{ E(cx+s*bw*.18,G-3,lw*.7,4.4,c2); E(cx+s*bw*.3,G-3,lw*.7,4,c2); E(cx+s*bw*.5,G-2,bw*.14,3,c2); }); }
  if(pad==='estrela') P(bxP(`M${hx} ${hy-hh*.38} l1.6 3.2 l3.4 .3 l-2.6 2.2 l.9 3.4 l-3.3 -1.9 l-3.3 1.9 l.9 -3.4 l-2.6 -2.2 l3.4 -.3Z`,` fill="${c2}"`));
  if(pad==='topete') E(hx,hy-hh*.4,hw*.26,hh*.18,c2);
  if(pad==='listra') P(bxP(`M${hx} ${hy-hh*.55} L${hx} ${hy-hh*.1}`,` stroke="${c3}" stroke-width="2.4" stroke-linecap="round"`));
  if(/^listras|tigrado/.test(pad)){ const w=pad==='tigrado'?1.1:1.8, n=pad==='listras2'?6:pad==='listras3'?3:4;
    P(bxP(`M${hx-3.2} ${hy-hh*.42} l1.4 4 l1.8 -3 l1.8 3 l1.4 -4`,` fill="none" stroke="${c3}" stroke-width="${w}" stroke-linejoin="round"`));
    [-1,1].forEach(s=>{ for(let i=0;i<3;i++) P(bxP(`M${hx+s*hw*.5} ${hy+i*2.6-1} q${-s*4} ${.6} ${-s*7} ${-.4}`,` fill="none" stroke="${c3}" stroke-width="${w*.8}" stroke-linecap="round"`));
      for(let i=0;i<n;i++){ const y=bodyY-bh*.4+i*bh*.8/(n-.5); P(bxP(`M${cx+s*bw*.56} ${y} q${-s*bw*.12} ${2+rd()*2} ${-s*bw*(.2+rd()*.08)} ${.5+rd()*2}`,` fill="none" stroke="${c3}" stroke-width="${w*1.25}" stroke-linecap="round"`)); } }); }
  if(rc.husky){ E(hx,hy+hh*.15,hw*.42,hh*.32,c2); E(hx-hw*.18,hy-hh*.2,2.2,1.6,c2); E(hx+hw*.18,hy-hh*.2,2.2,1.6,c2); E(cx,bodyY-bh*.05,bw*.24,bh*.42,c2); }
  if(def.macaco){ E(hx,hy+hh*.12,hw*.34,hh*.4,c2); }
  const mkc=c3===c1?c2:c3;
  if(mk.testa) P(bxP(`M${hx-1.8} ${hy-hh*.5} L${hx+1.8} ${hy-hh*.5} L${hx+1} ${hy-hh*.05} L${hx-1} ${hy-hh*.05}Z`,` fill="${c2}"`));
  if(mk.sobr) [-1,1].forEach(s=>E(hx+s*hw*.2,hy-hh*.22,2,1.4,pad==='tricolor'?c1:mixHex(c1,c2,.6)));
  if(mk.orelhaE) E(hx+(lk.seed%2?-1:1)*hw*.34,hy-hh*.36,hw*.2,hh*.22,mkc);
  if(mk.queixo) E(hx,hy+hh*.42,mw*.32,mh*.25,c2);
  if(mk.velho){ const gr=mixHex(c1,'#ECEAE6',.72); E(hx,my,mw*.56,mh*.56,gr); E(hx,hy+hh*.42,mw*.4,mh*.32,gr); [-1,1].forEach(s=>{ E(hx+s*hw*.22,hy-hh*.2,3.2,1.6,gr); E(hx+s*hw*.24,hy+hh*.02,hw*.13,hh*.1,mixHex(c1,'#ECEAE6',.4)); });
    const rv=bxRng(lk.seed+7);
    for(let i=0;i<9;i++) P(bxP(`M${(hx+(rv()-.5)*hw*.8).toFixed(1)} ${(hy-hh*(.1+rv()*.35)).toFixed(1)} l${(rv()-.5).toFixed(2)} 2.2`,` stroke="${gr}" stroke-width=".7" stroke-linecap="round"`)); E(cx,bodyY-bh*.15,bw*.16,bh*.2,mixHex(c1,'#ECEAE6',.35)); }
  if(mk.bochecha) [-1,1].forEach(s=>E(hx+s*hw*.3,hy+hh*.16,hw*.12,hh*.12,mixHex(c1,c2,.5)));
  // ----- detalhes por cima -----
  const det=[];
  earsIn.forEach(s=>det.push(bxfF(eG(s),earIn)));
  if(def.crina) det.push(bxP(`M${hx-hw*.3} ${hy-hh*.48} Q${hx} ${hy-hh*.7} ${hx+hw*.32} ${hy-hh*.5} Q${hx+hw*.1} ${hy-hh*.2} ${hx-hw*.05} ${hy-hh*.18}Z`,` fill="${c2}" stroke="${bxD(c2,.4)}" stroke-width=".8"`));
  if(def.chifre&&p&&p.gender!=='F') [-1,1].forEach(s=>det.push(bxP(`M${hx+s*hw*.18} ${hy-hh*.4} Q${hx+s*hw*.3} ${hy-hh*1.05} ${hx+s*hw*.72} ${hy-hh*.95}`,` fill="none" stroke="#7A6A54" stroke-width="3.2" stroke-linecap="round"`)+bxP(`M${hx+s*hw*.18} ${hy-hh*.4} Q${hx+s*hw*.3} ${hy-hh*1.05} ${hx+s*hw*.72} ${hy-hh*.95}`,` fill="none" stroke="#A8987E" stroke-width="1" stroke-dasharray="1 1.6"`)));
  if(def.chifre) det.push(bxP(`M${hx-2.2} ${my+mh*.45} q2.2 8 0 11 q4.4 -3 4.4 -11Z`,` fill="${bxD(c2,.08)}" stroke="${bxD(c2,.35)}" stroke-width=".7"`));
  // pelo
  const pelo=bxD(c1,.42);
  if(!rc.sphynx&&!def.porco){ det.push(bxfPelo(hx,hy,hw*.5,hh*.5,pelo,14,rd,Math.PI*.1,Math.PI*.9,1.8)); if(f.pose!=='blob') det.push(bxfPelo(cx,bodyY+bh*.05,bw*.48,bh*.4,pelo,16,rd,Math.PI*.2,Math.PI*.8,2));
    det.push(`<path d="${Array.from({length:5},(_,i)=>`M${(cx-6+i*3).toFixed(1)} ${(bodyY-bh*.2+(i%2)*3).toFixed(1)} l1.2 2.4 l1.2 -2.4`).join('')}" fill="none" stroke="${bxL(c2,.3)}" stroke-width=".6" opacity=".6"/>`); }
  // olhos
  const eY=hy-hh*(f.nose==='cavalo'?.18:.06), eX=hw*(f.nose==='cavalo'?.38:f.pose==='blob'?.27:.22), er=Math.max(2,hw*(f.pose==='blob'?.075:.085))*(lk.es||1)*(rc.olhoG||1);
  const pup=rc.sphynx?'v':f.pup;
  [-1,1].forEach(s=>det.push(bxfOlho(hx+s*eX,eY,er,lk.olho,pup,s)));
  if(mk.velho) [-1,1].forEach(s=>det.push(bxC(hx+s*eX,eY,er*.8,` fill="#DDE6EE" opacity=".32"`)+bxP(`M${hx+s*eX-er} ${eY-er*.55} q${er} ${-er*.25} ${er*2} 0`,` fill="none" stroke="${bxD(c1,.4)}" stroke-width="${(er*.5).toFixed(2)}" stroke-linecap="round"`)));
  det.push(bxP(`M${hx-eX-er} ${eY-er*1.25} q${er} ${-er*.6} ${er*2} ${-er*.1} M${hx+eX+er} ${eY-er*1.25} q${-er} ${-er*.6} ${-er*2} ${-er*.1}`,` fill="none" stroke="${bxD(c1,.35)}" stroke-width=".8" opacity=".7"`));
  // nariz e boca
  const nY=my-mh*.28, nw={cao:mw*.24,felino:mw*.18,gato:mw*.2,roedor:mw*.16,lhama:mw*.2,cavalo:mw*.32,capivara:mw*.3,porco:mw*.42,macaco:mw*.2,ourico:mw*.18}[f.nose]||3;
  const ncol=rc.sphynx||f.nose==='gato'&&['branco','creme'].some(k=>lk.c[0]===PEL[k]?.[0])?'#C98484':f.nose==='porco'?bxD(c1,.12):'#241A16';
  if(f.nose==='porco'){ det.push(bxE(hx,nY+1,nw,nw*.7,` fill="${bxD(c1,.1)}" stroke="${bxD(c1,.4)}" stroke-width=".9"`)+bxE(hx-nw*.38,nY+1,nw*.16,nw*.28,` fill="${bxD(c1,.55)}"`)+bxE(hx+nw*.38,nY+1,nw*.16,nw*.28,` fill="${bxD(c1,.55)}"`)); }
  else if(f.nose==='cavalo'||f.nose==='capivara'||f.nose==='lhama'){ [-1,1].forEach(s=>det.push(bxE(hx+s*nw,nY+mh*.15,nw*.32,nw*.5,` fill="${bxD(c1,.65)}" transform="rotate(${s*-20} ${hx+s*nw} ${nY+mh*.15})"`))); det.push(bxP(`M${hx-nw*.8} ${my+mh*.3} q${nw*.8} ${mh*.12} ${nw*1.6} 0`,` fill="none" stroke="${bxD(c1,.6)}" stroke-width=".9"`)); }
  else { det.push(bxP(`M${hx-nw} ${nY-nw*.25} Q${hx} ${nY-nw*.7} ${hx+nw} ${nY-nw*.25} Q${hx+nw*.5} ${nY+nw*.75} ${hx} ${nY+nw*.8} Q${hx-nw*.5} ${nY+nw*.75} ${hx-nw} ${nY-nw*.25}Z`,` fill="${ncol}"`)+bxE(hx-nw*.3,nY-nw*.15,nw*.26,nw*.14,` fill="#fff" opacity=".35"`));
    const by2=nY+nw*.8, mm=mh*.3; det.push(bxP(`M${hx} ${by2} l0 ${mm} M${hx} ${by2+mm} q${-mw*.18} ${mm*.6} ${-mw*.34} ${-mm*.15} M${hx} ${by2+mm} q${mw*.18} ${mm*.6} ${mw*.34} ${-mm*.15}`,` fill="none" stroke="${bxD(mc,.65)}" stroke-width=".9" stroke-linecap="round"`)); }
  if(f.whisk) [-1,1].forEach(s=>det.push(bxP(`M${hx+s*mw*.3} ${my} l${s*12} -2.4 M${hx+s*mw*.3} ${my+1.2} l${s*12} .4 M${hx+s*mw*.3} ${my+2.4} l${s*11} 3`,` stroke="${bxL(c2,.6)}" stroke-width=".45" opacity=".9"`)));
  if(def.esp) det.push(bxE(hx,hy+hh*.1,hw*.42,hh*.4,` fill="${c2}" opacity=".0"`));
  // dedos
  if(f.pose==='sit'&&!def.hoof&&!def.macaco) [-1,1].forEach(s=>{ const x=cx+s*bw*.18; det.push(bxP(`M${x-lw*.2} ${G-3.4} l0 2 M${x+lw*.2} ${G-3.4} l0 2`,` stroke="${bxD(c1,.5)}" stroke-width=".6"`)); });
  if(def.hoof) [-1,1].forEach(s=>{ const x=cx+s*bw*.3; det.push(bxP(`M${x-lw*.5} ${G-5} h${lw} v3.4 h-${lw}Z`,` fill="#2A221E"`)+bxP(`M${x} ${G-5} v3.4`,` stroke="#4A3E36" stroke-width=".7"`)); });
  return back.join('')+bxfMonta(id,parts,pads.join(''),ow)+det.join('')+top.join(''); }

function bxfTail(lk,def,x,y,c1,tc,c2,ow,rd){ const t=lk.tail;
  if(['curta','nenhuma','pompom'].includes(t)) return '';
  if(t==='enrolada') return bxP(`M${x-2} ${y-10} q10 -6 10 4 q0 7 -6 5 q-4 -2 0 -5`,` fill="none" stroke="${ow}" stroke-width="5.2" stroke-linecap="round"`)+bxP(`M${x-2} ${y-10} q10 -6 10 4 q0 7 -6 5 q-4 -2 0 -5`,` fill="none" stroke="${tc}" stroke-width="3.6" stroke-linecap="round"`);
  if(t==='fofa'||t==='crina') return bxP(`M${x-4} ${y-4} Q${x+16} ${y-6} ${x+12} ${y-30} Q${x+22} ${y-12} ${x+6} ${y+1}Z`,` fill="${tc}" stroke="${ow}" stroke-width="1.4"`)+bxP(`M${x+12} ${y-30} q-3 6 -1 9 q2 -3 4 -2`,` fill="${c2}"`);
  if(t==='longa') return bxP(`M${x-2} ${y-2} Q${x+18} ${y} ${x+14} ${y-30} q-2 -10 -9 -6 q-4 4 1 6`,` fill="none" stroke="${ow}" stroke-width="4.6" stroke-linecap="round"`)+bxP(`M${x-2} ${y-2} Q${x+18} ${y} ${x+14} ${y-30} q-2 -10 -9 -6 q-4 4 1 6`,` fill="none" stroke="${tc}" stroke-width="3" stroke-linecap="round"`);
  const d=t==='leao'?`M${x-4} ${y} Q${x+12} ${y+1} ${x+16} ${y-12}`:`M${x-4} ${y} Q${x+12} ${y+1} ${x+14} ${y-14}`;
  return bxP(d,` fill="none" stroke="${ow}" stroke-width="${t==='fina'?5.4:6}" stroke-linecap="round"`)+bxP(d,` fill="none" stroke="${tc}" stroke-width="${t==='fina'?3.8:4.4}" stroke-linecap="round"`)+(t==='leao'?bxE(x+16,y-14,3,4.2,` fill="${bxD(c1,.45)}"`):''); }
function bxfEspinhos(cx,cy,rx,ry,c3,c2,rd){ let s=''; for(let i=0;i<46;i++){ const a=Math.PI*(1+i/45), r=.75+rd()*.3, x=cx+Math.cos(a)*rx*r, y=cy+Math.sin(a)*ry*r, l=5+rd()*3;
  s+=`M${(x-1.6).toFixed(1)} ${y.toFixed(1)} L${(x+Math.cos(a)*l).toFixed(1)} ${(y+Math.sin(a)*l).toFixed(1)} L${(x+1.6).toFixed(1)} ${y.toFixed(1)}`; }
  return bxE(cx,cy,rx,ry,` fill="${bxD(c3,.15)}"`)+bxP(s,` fill="${c3}" stroke="${bxL(c2,.35)}" stroke-width=".5"`); }

// ---------- aves de frente ----------
function bxfAve(def,lk){ const G=BXF_G, cx=50, [c1,c2,c3]=lk.c, rd=bxRng(lk.seed), pad=lk.pad, id='bf'+(++BXF_UID), ow=bxD(c1,.55);
  const W=(def.W*1.55)*lk.gord, H=def.H*1.55, hr=def.hr*1.45, leg=def.leg*1.1, by=G-leg-H/2, hy=def.flamingo?by-H/2-24:def.pinguim||def.coruja?by-H*.42:by-H/2-hr*.55, parts=[], A=(s,c=c1)=>parts.push({s,c}), pads=[], P=s=>pads.push(s), back=[], det=[];
  // pernas
  const pc=def.flamingo?bxD(c1,.08):def.pinguim?c3:'#C88A50';
  if(!def.pinguim&&!def.coruja) [-1,1].forEach(s=>{ const x=cx+s*W*.18; back.push(bxP(`M${x} ${by+H*.3} L${x} ${G-1}`,` stroke="${pc}" stroke-width="${def.flamingo?2.4:2}" stroke-linecap="round"`)+bxP(`M${x} ${G-1} l-3.4 1 M${x} ${G-1} l0 1.4 M${x} ${G-1} l3.4 1`,` stroke="${pc}" stroke-width="1.6" stroke-linecap="round"`)); });
  else [-1,1].forEach(s=>back.push(bxE(cx+s*W*.2,G-1.2,5,1.8,` fill="${pc}"`)));
  // cauda atrás
  if(def.cauda==='leque'){ let s=''; for(let i=0;i<19;i++){ const a=Math.PI*(1.0+i/18), x=cx+Math.cos(a)*46, y=by+Math.sin(a)*48; s+=bxP(`M${cx} ${by} L${(x-4).toFixed(1)} ${y.toFixed(1)} L${(x+4).toFixed(1)} ${y.toFixed(1)}Z`,` fill="${bxD(c2,.15)}"`)+bxE(x,y,4.4,5.4,` fill="${c3}"`)+bxE(x,y,2.6,3.2,` fill="${c1}"`)+bxC(x,y,1.2,` fill="#151530"`); } back.unshift(s); }
  if(['longa','arara'].includes(def.cauda)) back.push(bxP(`M${cx-4} ${by+H*.3} L${cx-3} ${G+2} L${cx+3} ${G+2} L${cx+4} ${by+H*.3}Z`,` fill="${def.cauda==='arara'?c2:bxD(c2,.1)}" stroke="${ow}" stroke-width="1"`));
  if(def.cauda==='galinha') back.push(bxP(`M${cx+W*.2} ${by} Q${cx+W*.75} ${by-H*.9} ${cx+W*.55} ${by-H*.95} Q${cx+W*.5} ${by-H*.4} ${cx+W*.35} ${by+H*.1}Z`,` fill="${bxD(c2,.2)}" stroke="${ow}" stroke-width="1"`));
  // asas e corpo
  [-1,1].forEach(s=>A(bxE(cx+s*W*.4,by+H*.05,W*.2,H*.42,` transform="rotate(${s*-8} ${cx+s*W*.4} ${by})"`),def.pinguim?c1:pad==='asa'?c3:c2));
  A(bxE(cx,by,W*.42,H*.5));
  if(def.flamingo) A(bxP(`M${cx-3} ${by-H*.4} Q${cx-8} ${hy+16} ${cx-3} ${hy+hr*.5} L${cx+3} ${hy+hr*.5} Q${cx-1} ${hy+16} ${cx+3} ${by-H*.4}Z`));
  A(bxC(cx,hy,hr));
  // padrões
  const E=(x,y,rx,ry,c)=>P(bxE(x,y,rx,ry,` fill="${c}"`));
  if(def.pinguim){ E(cx,by+H*.08,W*.3,H*.42,c2); E(cx,hy+hr*.35,hr*.5,hr*.45,c2); E(cx-hr*.6,hy-hr*.15,hr*.25,hr*.2,c3); E(cx+hr*.6,hy-hr*.15,hr*.25,hr*.2,c3); }
  else if(def.coruja){ E(cx,by+H*.1,W*.28,H*.36,c3); E(cx-hr*.38,hy+hr*.05,hr*.46,hr*.48,c3); E(cx+hr*.38,hy+hr*.05,hr*.46,hr*.48,c3); }
  else { if(pad==='peito'||pad==='cabeca'||pad==='liso') E(cx,by+H*.12,W*.26,H*.34,pad==='cabeca'?c1:mixHex(c1,c3,pad==='liso'?.25:.7)); if(pad==='cabeca') E(cx,hy-hr*.2,hr,hr*.8,c3); }
  if(pad==='pintas') for(let i=0;i<22;i++) E(cx+(rd()-.5)*W*.8,by+(rd()-.4)*H*.8,1,1.2,bxL(c3,.25));
  if(pad==='barras'||def.coruja) for(let r=0;r<5;r++) for(let i=0;i<4;i++) P(bxP(`M${cx-W*.2+i*W*.13} ${by-H*.15+r*H*.13} q${W*.06} 2.4 ${W*.12} 0`,` fill="none" stroke="${bxD(def.coruja?c3:c1,.35)}" stroke-width=".8"`));
  if(!def.pinguim&&!def.coruja) for(let r=0;r<4;r++) for(let i=0;i<5;i++) P(bxP(`M${cx-W*.28+i*W*.14} ${by-H*.1+r*H*.14} q${W*.07} 2 ${W*.14} 0`,` fill="none" stroke="${bxD(c1,.18)}" stroke-width=".5" opacity=".6"`));
  // penas da asa
  det.push([-1,1].map(s=>Array.from({length:4},(_,i)=>bxP(`M${cx+s*W*.32} ${by+H*.05+i*H*.1} q${s*W*.08} ${H*.05} ${s*W*.18} 0`,` fill="none" stroke="${bxD(def.pinguim?c1:pad==='asa'?c3:c2,.4)}" stroke-width=".7"`)).join('')).join(''));
  // crista
  if(def.crista==='calop'){ det.push(bxP(`M${cx-2} ${hy-hr*.8} Q${cx-5} ${hy-hr*2.6} ${cx+4} ${hy-hr*2.5} Q${cx+1} ${hy-hr*1.8} ${cx+3} ${hy-hr*.8}Z`,` fill="${c3}" stroke="${bxD(c3,.4)}" stroke-width=".7"`)); [-1,1].forEach(s=>det.push(bxC(cx+s*hr*.6,hy+hr*.3,hr*.22,` fill="#EE8A4C"`))); }
  if(def.crista==='galinha') det.push(bxP(`M${cx-5} ${hy-hr*.82} q.5 -5 2.6 -1.5 q.8 -6 2.6 -.6 q1.6 -5 2.8 .5 q.4 3 -3 2.6Z`,` fill="${c3}" stroke="${bxD(c3,.4)}" stroke-width=".6"`)+bxE(cx-1.6,hy+hr*.9,1.8,3.2,` fill="${c3}"`)+bxE(cx+1.6,hy+hr*.9,1.8,3.2,` fill="${c3}"`));
  if(def.crista==='pavao') for(let i=0;i<5;i++) det.push(bxP(`M${cx} ${hy-hr*.85} L${cx-4+i*2} ${hy-hr*1.9}`,` stroke="${c2}" stroke-width=".7"`)+bxC(cx-4+i*2,hy-hr*1.9,1.2,` fill="${c3}"`));
  if(def.coruja) det.push(bxP(`M${cx-hr*.8} ${hy-hr*.55} l-2.6 -7.4 l7 4.4Z M${cx+hr*.8} ${hy-hr*.55} l2.6 -7.4 l-7 4.4Z`,` fill="${c1}" stroke="${ow}" stroke-width=".8"`));
  // olhos e bico
  const eo=def.coruja?.38:def.pinguim?.42:.48, er=def.coruja?hr*.24:hr*.15;
  [-1,1].forEach(s=>det.push(def.coruja?bxfOlho(cx+s*hr*eo,hy-hr*.02,er,lk.olho,'r',s):bxC(cx+s*hr*eo,hy-hr*.15,er,` fill="#140E0A" stroke="${def.crista==='calop'||def.bico==='curvo'?'#F4F0E8':bxD(c1,.5)}" stroke-width="${def.bico==='curvo'?1.4:.6}"`)+bxC(cx+s*hr*eo+er*.3,hy-hr*.15-er*.35,er*.28,` fill="#fff" opacity=".85"`)));
  const bc=def.bico==='pato'?c3:def.bico==='flamingo'?'#F2EEE6':def.pinguim?'#2A2A2A':def.bico==='curvo'&&(def.cauda==='arara'||def.hr>=11)?'#2E2A28':'#E0A85A';
  if(def.bico==='curvo') det.push(bxP(`M${cx-hr*.32} ${hy+hr*.05} Q${cx} ${hy-hr*.25} ${cx+hr*.32} ${hy+hr*.05} Q${cx+hr*.2} ${hy+hr*.6} ${cx} ${hy+hr*.85} Q${cx-hr*.2} ${hy+hr*.6} ${cx-hr*.32} ${hy+hr*.05}Z`,` fill="${bc}" stroke="${bxD(bc,.4)}" stroke-width=".6"`)+bxP(`M${cx-hr*.2} ${hy+hr*.35} q${hr*.2} ${hr*.12} ${hr*.4} 0`,` fill="none" stroke="${bxL(bc,.3)}" stroke-width=".6"`));
  else if(def.bico==='pato') det.push(bxE(cx,hy+hr*.42,hr*.55,hr*.3,` fill="${bc}" stroke="${bxD(bc,.35)}" stroke-width=".7"`)+bxC(cx-hr*.18,hy+hr*.32,.6,` fill="${bxD(bc,.5)}"`)+bxC(cx+hr*.18,hy+hr*.32,.6,` fill="${bxD(bc,.5)}"`));
  else if(def.bico==='flamingo') det.push(bxP(`M${cx-hr*.3} ${hy+hr*.2} L${cx+hr*.3} ${hy+hr*.2} L${cx+hr*.2} ${hy+hr*1.1} Q${cx} ${hy+hr*1.6} ${cx-hr*.2} ${hy+hr*1.1}Z`,` fill="${bc}"`)+bxP(`M${cx-hr*.22} ${hy+hr*.95} L${cx+hr*.22} ${hy+hr*.95} Q${cx} ${hy+hr*1.7} ${cx-hr*.22} ${hy+hr*.95}Z`,` fill="#1A1A1A"`));
  else if(def.bico==='coruja') det.push(bxP(`M${cx-1.6} ${hy+hr*.1} L${cx+1.6} ${hy+hr*.1} L${cx} ${hy+hr*.5}Z`,` fill="#D6A050" stroke="#6A4A20" stroke-width=".5"`));
  else det.push(bxP(`M${cx-hr*.22} ${hy+hr*.12} L${cx+hr*.22} ${hy+hr*.12} L${cx} ${hy+hr*.55}Z`,` fill="${bc}" stroke="${bxD(bc,.4)}" stroke-width=".5"`));
  return back.join('')+bxfMonta(id,parts,pads.join(''),ow)+det.join(''); }

// ---------- peixes e polvo de frente ----------
function bxfPeixe(def,lk){ const [c1,c2,c3]=lk.c, rd=bxRng(lk.seed), pad=lk.pad, id='bf'+(++BXF_UID), cx=50, cy=50, ow=bxD(c1,.5), fin=pad==='degrade'||pad==='borda'?c2:c1, back=[], parts=[], pads=[], det=[];
  const W=def.beta?24:26, H=def.beta?30:30;
  if(def.beta){ back.push(bxP(`M${cx-6} ${cy-8} Q${cx-40} ${cy-44} ${cx-44} ${cy+4} Q${cx-30} ${cy+46} ${cx} ${cy+40} Q${cx+30} ${cy+46} ${cx+44} ${cy+4} Q${cx+40} ${cy-44} ${cx+6} ${cy-8}Z`,` fill="${fin}" opacity=".9" stroke="${bxD(fin,.35)}" stroke-width=".8"`));
    let r=''; for(let i=0;i<14;i++){ const a=Math.PI*(.95+i*.08); r+=`M${cx} ${cy} L${(cx+Math.cos(a)*44).toFixed(1)} ${(cy+Math.sin(a)*-40+8).toFixed(1)}`; } back.push(bxP(r,` stroke="${bxD(fin,.25)}" stroke-width=".5" opacity=".6"`));
    if(pad==='borda') back.push(bxP(`M${cx-40} ${cy-36} Q${cx-48} ${cy+4} ${cx-30} ${cy+42} M${cx+40} ${cy-36} Q${cx+48} ${cy+4} ${cx+30} ${cy+42}`,` fill="none" stroke="${c3}" stroke-width="3" opacity=".8"`)); }
  else { back.push(bxP(`M${cx-4} ${cy-H*.4} Q${cx} ${cy-H*.95} ${cx+4} ${cy-H*.4}Z`,` fill="${c1}" stroke="${c3}" stroke-width="1.2"`)+bxP(`M${cx-6} ${cy+H*.3} Q${cx} ${cy+H*.85} ${cx+6} ${cy+H*.3}Z`,` fill="${c1}" stroke="${c3}" stroke-width="1.2"`)); }
  [-1,1].forEach(s=>back.push(bxP(`M${cx+s*W*.4} ${cy+4} Q${cx+s*W*1.05} ${cy+2} ${cx+s*W*.95} ${cy+14} Q${cx+s*W*.6} ${cy+12} ${cx+s*W*.4} ${cy+8}Z`,` fill="${fin}" opacity=".85" stroke="${bxD(fin,.35)}" stroke-width=".7"`)));
  parts.push({s:bxE(cx,cy,W/2,H/2),c:c1});
  const E=(x,y,rx,ry,c,x2='')=>pads.push(bxE(x,y,rx,ry,` fill="${c}"${x2}`));
  E(cx,cy+H*.25,W*.32,H*.2,mixHex(c1,'#FFFFFF',.35));
  if(pad==='degrade') E(cx,cy-H*.3,W*.5,H*.3,c3,` opacity=".6"`);
  if(pad==='pintas'||pad==='marmore') for(let i=0;i<(pad==='marmore'?7:16);i++) E(cx+(rd()-.5)*W,cy+(rd()-.5)*H,pad==='marmore'?3+rd()*3:1,pad==='marmore'?2.4+rd()*2:1,pad==='marmore'?c2:c3);
  if(pad==='listras') for(let i=0;i<4;i++) pads.push(bxP(`M${cx-W} ${cy-H*.3+i*H*.2} q${W} 3 ${W*2} 0`,` fill="none" stroke="${c2}" stroke-width="1.6"`));
  if(/^palhaco/.test(pad)){ pads.push(bxE(cx,cy-H*.1,W*.62,H*.48,` fill="none" stroke="${c3}" stroke-width="5.4"`)+bxE(cx,cy-H*.1,W*.62,H*.48,` fill="none" stroke="${c2}" stroke-width="3.6"`)); if(pad!=='palhaco2') pads.push(bxP(`M${cx-W*.5} ${cy+H*.36} q${W*.5} -4 ${W} 0`,` fill="none" stroke="${c2}" stroke-width="2.6"`)); }
  det.push([-1,1].map(s=>bxC(cx+s*W*.42,cy-H*.12,4.4,` fill="${bxL(c1,.2)}" stroke="${ow}" stroke-width=".8"`)+bxC(cx+s*W*.44,cy-H*.12,3.2,` fill="#D8B040"`)+bxC(cx+s*W*.44,cy-H*.12,2,` fill="#0A0806"`)+bxC(cx+s*W*.44+1,cy-H*.12-1.1,.7,` fill="#fff"`)).join(''));
  det.push(bxE(cx,cy+H*.18,3.6,2.6,` fill="${bxD(c1,.55)}"`)+bxE(cx,cy+H*.16,2.4,1.4,` fill="${bxD(c1,.8)}"`));
  det.push(`<circle cx="20" cy="22" r="2" fill="none" stroke="#fff" stroke-width=".7" opacity=".8"/><circle cx="26" cy="12" r="1.3" fill="none" stroke="#fff" stroke-width=".7" opacity=".8"/><circle cx="82" cy="18" r="1.6" fill="none" stroke="#fff" stroke-width=".7" opacity=".8"/>`);
  return back.join('')+bxfMonta(id,parts,pads.join(''),ow)+det.join(''); }
function bxfPolvo(def,lk){ const [c1,c2,c3]=lk.c, rd=bxRng(lk.seed), pad=lk.pad, id='bf'+(++BXF_UID), cx=50, cy=40, G=BXF_G, ow=bxD(c1,.5), o=[];
  let t=''; for(let i=0;i<8;i++){ const x0=cx-16+i*4.6, s=x0<cx?-1:1, sp=Math.abs(x0-cx)/16; t+=`M${x0.toFixed(1)} ${cy+10} Q${(x0+s*(4+sp*16)).toFixed(1)} ${cy+30} ${(x0+s*(10+sp*24)).toFixed(1)} ${(G-6+rd()*5).toFixed(1)} q${s*7} -1 ${s*5} -9 `; }
  o.push(bxP(t,` fill="none" stroke="${ow}" stroke-width="7.4" stroke-linecap="round"`)+bxP(t,` fill="none" stroke="${c1}" stroke-width="5.6" stroke-linecap="round"`)+bxP(t,` fill="none" stroke="${c3}" stroke-width="1.8" stroke-dasharray=".1 3" stroke-linecap="round" opacity=".8"`));
  if(pad==='aneis'||pad==='listras') o.push(bxP(t,` fill="none" stroke="${pad==='aneis'?c3:c2}" stroke-width="4.4" stroke-dasharray="1.4 5"`));
  const head=bxP(`M${cx-20} ${cy+12} Q${cx-26} ${cy-30} ${cx} ${cy-32} Q${cx+26} ${cy-30} ${cx+20} ${cy+12} Q${cx} ${cy+18} ${cx-20} ${cy+12}Z`), pads=[];
  if(pad==='pintas'||pad==='aneis') for(let i=0;i<14;i++) pads.push(bxC(cx+(rd()-.5)*36,cy-26+rd()*34,pad==='aneis'?2:1.3,pad==='aneis'?` fill="none" stroke="${c3}" stroke-width="1.1"`:` fill="${c2}"`));
  if(pad==='manchas') for(let i=0;i<6;i++) pads.push(bxE(cx+(rd()-.5)*32,cy-22+rd()*26,4+rd()*3,3+rd()*2,` fill="${c2}"`));
  if(pad==='listras') for(let i=0;i<5;i++) pads.push(bxP(`M${cx-24} ${cy-20+i*7} q24 -5 48 0`,` fill="none" stroke="${c2}" stroke-width="1.8"`));
  for(let i=0;i<20;i++) pads.push(bxC(cx+(rd()-.5)*38,cy-28+rd()*36,.7,` fill="${bxD(c1,.25)}"`));
  o.push(bxfMonta(id,[{s:head,c:c1}],pads.join(''),ow));
  [-1,1].forEach(s=>o.push(bxE(cx+s*9,cy+2,4.4,4,` fill="${bxL(c1,.15)}" stroke="${ow}" stroke-width=".8"`)+bxE(cx+s*9,cy+2,3,2.6,` fill="#D8A63A"`)+bxE(cx+s*9,cy+2,2.4,.8,` fill="#0A0806"`)+bxC(cx+s*9+1,cy+.8,.6,` fill="#fff"`)));
  return o.join(''); }

// ---------- répteis, cobra e aracnídeos de frente ----------
function bxfReptil(def,lk){ const G=BXF_G, cx=50, [c1,c2,c3]=lk.c, rd=bxRng(lk.seed), pad=lk.pad, id='bf'+(++BXF_UID), ow=bxD(c1,.55), parts=[], A=(s,c=c1)=>parts.push({s,c}), pads=[], P=s=>pads.push(s), back=[], det=[];
  const E=(x,y,rx,ry,c,x2='')=>P(bxE(x,y,rx,ry,` fill="${c}"${x2}`));
  if(def.tart){ const sy=G-26;
    [-1,1].forEach(s=>{ A(bxE(cx+s*30,G-8,9,6,` transform="rotate(${s*20} ${cx+s*30} ${G-8})"`)); A(bxE(cx+s*24,G-26,8,5,` transform="rotate(${s*-25} ${cx+s*24} ${G-26})"`)); });
    A(bxP(`M${cx-38} ${sy+10} Q${cx-40} ${sy-30} ${cx} ${sy-32} Q${cx+40} ${sy-30} ${cx+38} ${sy+10} Q${cx} ${sy+20} ${cx-38} ${sy+10}Z`),c2);
    A(bxE(cx,sy+16,26,10),c3); A(bxE(cx,sy+8,10,9)); A(bxP(`M${cx-6} ${sy+12} L${cx-5} ${sy+22} L${cx+5} ${sy+22} L${cx+6} ${sy+12}Z`));
    if(pad==='hexa') for(let r=0;r<3;r++) for(let k=0;k<5;k++){ const x=cx-26+k*13+(r%2)*6.5, y=sy-22+r*11; P(bxP(`M${x-6} ${y} l3 -5 l6 0 l3 5 l-3 5 l-6 0Z`,` fill="${bxL(c2,.12)}" stroke="${c3}" stroke-width="1.2"`)); }
    if(pad==='raios') for(let i=0;i<9;i++) P(bxP(`M${cx} ${sy+12} L${cx-36+i*9} ${sy-32}`,` stroke="${c3}" stroke-width="1.6"`));
    if(pad==='pintas') for(let i=0;i<16;i++) E(cx+(rd()-.5)*64,sy-24+rd()*28,1.6,1.6,c3);
    P(bxP(`M${cx-30} ${sy+14} q30 6 60 0 M${cx-14} ${sy+10} l0 12 M${cx+14} ${sy+10} l0 12`,` fill="none" stroke="${bxD(c3,.3)}" stroke-width=".8"`));
    [-1,1].forEach(s=>det.push(bxfOlho(cx+s*5,sy+5,2.2,lk.olho,'r',s)));
    det.push(bxP(`M${cx-4} ${sy+11} q4 2 8 0`,` fill="none" stroke="${ow}" stroke-width=".8"`)+bxC(cx-1.4,sy+8.4,.5,` fill="${ow}"`)+bxC(cx+1.4,sy+8.4,.5,` fill="${ow}"`));
    for(let i=0;i<8;i++) det.push(bxC(cx+(rd()-.5)*14,sy+2+rd()*8,.6,` fill="${bxD(c1,.3)}"`));
    return bxfMonta(id,parts,pads.join(''),ow)+det.join(''); }
  if(def.camaleao){ back.push(bxP(`M8 ${G-12} L92 ${G-16}`,` stroke="#6A4A2E" stroke-width="5" stroke-linecap="round"`)+bxP(`M8 ${G-12} L92 ${G-16}`,` stroke="#8A6A48" stroke-width="1.4" stroke-dasharray="6 4"`));
    back.push(bxP(`M${cx+18} ${G-30} q16 2 14 16 q-2 8 -9 6 q-5 -3 -1 -7`,` fill="none" stroke="${ow}" stroke-width="6.4" stroke-linecap="round"`)+bxP(`M${cx+18} ${G-30} q16 2 14 16 q-2 8 -9 6 q-5 -3 -1 -7`,` fill="none" stroke="${c1}" stroke-width="4.6" stroke-linecap="round"`)); }
  else if(def.jacare) back.push(bxP(`M${cx+16} ${G-8} Q${cx+40} ${G-4} ${cx+46} ${G-18}`,` fill="none" stroke="${ow}" stroke-width="9" stroke-linecap="round"`)+bxP(`M${cx+16} ${G-8} Q${cx+40} ${G-4} ${cx+46} ${G-18}`,` fill="none" stroke="${c1}" stroke-width="7" stroke-linecap="round"`));
  else back.push(bxP(`M${cx+14} ${G-10} Q${cx+40} ${G-2} ${cx+44} ${G-30} q1 -8 -4 -8`,` fill="none" stroke="${ow}" stroke-width="5.6" stroke-linecap="round"`)+bxP(`M${cx+14} ${G-10} Q${cx+40} ${G-2} ${cx+44} ${G-30} q1 -8 -4 -8`,` fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round"`));
  const jac=def.jacare, cam=def.camaleao, bw=jac?44:cam?24:30, bh=jac?16:cam?22:20, by=cam?G-30:G-bh*.6-2, hy=cam?by-bh*.55:jac?G-16:by-bh*.5-6, hw=jac?36:cam?18:18, hh=jac?16:cam?18:16;
  // pernas abertas
  [-1,1].forEach(s=>{ const kx=cx+s*bw*.7, fy=cam?G-14:G-1; A(bxP(`M${cx+s*bw*.3} ${by} Q${kx} ${by-4} ${kx+s*3} ${fy-3} L${kx-s*3} ${fy} Q${kx-s*6} ${by+4} ${cx+s*bw*.2} ${by+5}Z`)); det.push(bxP(`M${kx-s*4} ${fy} l-1.6 1.6 M${kx-s*1} ${fy} l0 2.2 M${kx+s*2} ${fy-.6} l1.6 1.6`,` stroke="${ow}" stroke-width="1" stroke-linecap="round"`)); });
  A(bxE(cx,by,bw*.5,bh*.5));
  if(jac) A(bxP(`M${cx-hw*.5} ${hy-hh*.35} Q${cx} ${hy-hh*.6} ${cx+hw*.5} ${hy-hh*.35} L${cx+hw*.44} ${hy+hh*.3} Q${cx} ${hy+hh*.55} ${cx-hw*.44} ${hy+hh*.3}Z`));
  else if(cam) A(bxP(`M${cx-hw*.5} ${hy+hh*.2} Q${cx-hw*.45} ${hy-hh*.4} ${cx} ${hy-hh*.95} Q${cx+hw*.45} ${hy-hh*.4} ${cx+hw*.5} ${hy+hh*.2} Q${cx} ${hy+hh*.55} ${cx-hw*.5} ${hy+hh*.2}Z`));
  else A(bxP(`M${cx-hw*.5} ${hy} Q${cx-hw*.4} ${hy-hh*.6} ${cx} ${hy-hh*.6} Q${cx+hw*.4} ${hy-hh*.6} ${cx+hw*.5} ${hy} Q${cx+hw*.3} ${hy+hh*.5} ${cx} ${hy+hh*.5} Q${cx-hw*.3} ${hy+hh*.5} ${cx-hw*.5} ${hy}Z`));
  if(def.papo) A(bxP(`M${cx-4} ${hy+hh*.4} Q${cx-6} ${hy+hh*1.4} ${cx} ${hy+hh*1.5} Q${cx+6} ${hy+hh*1.4} ${cx+4} ${hy+hh*.4}Z`),c2);
  E(cx,by+bh*.15,bw*.3,bh*.35,c3);
  if(pad==='faixas') for(let i=0;i<5;i++) P(bxP(`M${cx-bw*.6} ${by-bh*.4+i*bh*.22} q${bw*.6} 3 ${bw*1.2} 0`,` fill="none" stroke="${c2}" stroke-width="2.2"`));
  if(pad==='pintas') for(let i=0;i<20;i++) E(cx+(rd()-.5)*bw*1.6,by+(rd()-.6)*bh*1.4,1.1,1.1,c2);
  if(pad==='reticulado') for(let i=0;i<24;i++) P(bxC(cx+(rd()-.5)*bw*1.5,by+(rd()-.6)*bh*1.4,2,` fill="none" stroke="${c2}" stroke-width=".8"`));
  if(pad==='listras') P(bxP(`M${cx-bw*.6} ${by} L${cx+bw*.6} ${by}`,` stroke="${c3}" stroke-width="2.4"`));
  for(let i=0;i<30;i++) P(bxC(cx+(rd()-.5)*bw*1.4,by+(rd()-.6)*bh*1.6,.5,` fill="${bxD(c1,.3)}"`));
  // espinhos, olhos e boca
  if(def.crest) { let s=''; for(let i=0;i<7;i++){ const x=cx-6+i*2; s+=`M${x-1.2} ${hy-hh*.55} L${x} ${hy-hh*.55-3-(3-Math.abs(i-3))*1.4} L${x+1.2} ${hy-hh*.55}Z`; } det.push(bxP(s,` fill="${bxD(c1,.2)}" stroke="${ow}" stroke-width=".5"`)); }
  if(jac){ let s=''; for(let i=0;i<9;i++){ const x=cx-hw*.4+i*hw*.1; s+=`M${x} ${hy+hh*.32} l${hw*.05} 2.4 l${hw*.05} -2.4`; } det.push(bxP(s,` fill="#F4F0E4" stroke="${ow}" stroke-width=".5"`)); [-1,1].forEach(s=>{ det.push(bxE(cx+s*hw*.32,hy-hh*.42,4.4,3.4,` fill="${c1}" stroke="${ow}" stroke-width=".9"`)+bxfOlho(cx+s*hw*.32,hy-hh*.45,2.4,lk.olho,'v',s)); det.push(bxC(cx+s*3,hy-hh*.1,.9,` fill="${ow}"`)); }); }
  else if(cam) [-1,1].forEach(s=>det.push(bxC(cx+s*hw*.5,hy-hh*.05,4.8,` fill="${c1}" stroke="${ow}" stroke-width="1"`)+bxP(`M${cx+s*hw*.5-4} ${hy-hh*.05} a4 4 0 0 1 8 0`,` fill="none" stroke="${c2}" stroke-width=".8"`)+bxC(cx+s*hw*.5,hy-hh*.05,1.4,` fill="#0A0806"`)+bxC(cx+s*hw*.5+.5,hy-hh*.05-.5,.4,` fill="#fff"`)));
  else [-1,1].forEach(s=>det.push(bxfOlho(cx+s*hw*.36,hy-hh*.12,2.4,lk.olho,'r',s)));
  if(!jac) det.push(bxP(`M${cx-hw*.3} ${hy+hh*.28} q${hw*.3} ${hh*.15} ${hw*.6} 0`,` fill="none" stroke="${ow}" stroke-width=".9"`)+bxC(cx-1.6,hy+hh*.05,.6,` fill="${ow}"`)+bxC(cx+1.6,hy+hh*.05,.6,` fill="${ow}"`));
  if(cam) det.push(bxP(`M${cx} ${hy-hh*.9} L${cx} ${hy-hh*.2}`,` stroke="${c2}" stroke-width="1.4"`));
  return back.join('')+bxfMonta(id,parts,pads.join(''),ow)+det.join(''); }
function bxfCobra(def,lk){ const G=BXF_G, cx=50, [c1,c2,c3]=lk.c, rd=bxRng(lk.seed), pad=lk.pad, ow=bxD(c1,.55), o=[], w=8.4*lk.gord;
  const anel=(y,rx)=>`M${cx-rx} ${y} a${rx} ${rx*.32} 0 1 0 ${rx*2} 0 a${rx} ${rx*.32} 0 1 0 ${-rx*2} 0`;
  const tira=(d)=>{ o.push(bxP(d,` fill="none" stroke="${ow}" stroke-width="${w+2}" stroke-linecap="round"`)+bxP(d,` fill="none" stroke="${c1}" stroke-width="${w}" stroke-linecap="round"`));
    if(pad==='aneis') o.push(bxP(d,` fill="none" stroke="${c2}" stroke-width="${w}" stroke-dasharray="3 6"`));
    if(pad==='coral') o.push(bxP(d,` fill="none" stroke="${c2}" stroke-width="${w}" stroke-dasharray="4 10"`)+bxP(d,` fill="none" stroke="${c3}" stroke-width="${w}" stroke-dasharray="2 12" stroke-dashoffset="-5"`));
    if(pad==='losangos') o.push(bxP(d,` fill="none" stroke="${c2}" stroke-width="${w*.62}" stroke-dasharray="4 4"`));
    if(pad==='listra') o.push(bxP(d,` fill="none" stroke="${c3}" stroke-width="${w*.26}"`));
    if(pad==='manchas') o.push(bxP(d,` fill="none" stroke="${c2}" stroke-width="${w*.7}" stroke-dasharray="${(2+rd()*3).toFixed(1)} ${(5+rd()*4).toFixed(1)}" stroke-linecap="round"`));
    o.push(bxP(d,` fill="none" stroke="#fff" stroke-width="${w*.25}" opacity=".14" transform="translate(0 -${w*.22})"`)); };
  tira(anel(G-6,30)); tira(anel(G-15,24)); tira(anel(G-23,17));
  const neck=`M${cx+10} ${G-24} Q${cx+12} ${G-40} ${cx} ${G-48} Q${cx-8} ${G-54} ${cx} ${G-60}`; tira(neck);
  const hy=G-64;
  o.push(bxP(`M${cx-10} ${hy} Q${cx-10} ${hy-10} ${cx} ${hy-10} Q${cx+10} ${hy-10} ${cx+10} ${hy} Q${cx+7} ${hy+8} ${cx} ${hy+8} Q${cx-7} ${hy+8} ${cx-10} ${hy}Z`,` fill="${c1}" stroke="${ow}" stroke-width="1.4"`));
  if(pad==='coral'||pad==='aneis') o.push(bxP(`M${cx-9} ${hy-3} Q${cx} ${hy-6} ${cx+9} ${hy-3}`,` fill="none" stroke="${c2}" stroke-width="2.4"`));
  for(let i=0;i<10;i++) o.push(bxC(cx+(rd()-.5)*14,hy-6+rd()*10,.5,` fill="${bxD(c1,.3)}"`));
  [-1,1].forEach(s=>o.push(bxfOlho(cx+s*6,hy-2.4,2.2,lk.olho,'v',s)));
  o.push(bxC(cx-1.6,hy+3,.6,` fill="${ow}"`)+bxC(cx+1.6,hy+3,.6,` fill="${ow}"`)+bxP(`M${cx} ${hy+7} l0 5 l-1.6 2 M${cx} ${hy+12} l1.6 2`,` fill="none" stroke="#C62828" stroke-width=".9" stroke-linecap="round"`));
  return o.join(''); }
function bxfAracnideo(def,lk){ const G=BXF_G, cx=50, [c1,c2,c3]=lk.c, rd=bxRng(lk.seed), pad=lk.pad, ow=bxD(c1,.45), o=[];
  if(def.aranha){ const cy=G-28; let pe='';
    for(let i=0;i<4;i++) [-1,1].forEach(s=>{ const x0=cx+s*7, y0=cy+2+i*2, kx=cx+s*(22+i*5), ky=cy-16+i*7, fx=cx+s*(30+i*4); pe+=`M${x0} ${y0} Q${kx-s*6} ${ky-8} ${kx} ${ky} L${fx} ${G-1}`; });
    o.push(bxE(cx,cy-12,20,16,` fill="${c1}" stroke="${ow}" stroke-width="1.4"`));
    if(pad==='listras') for(let i=0;i<4;i++) o.push(bxP(`M${cx-14+i*9} ${cy-24} q2 10 0 22`,` fill="none" stroke="${c2}" stroke-width="1.4"`));
    if(pad==='manchas') for(let i=0;i<7;i++) o.push(bxC(cx+(rd()-.5)*28,cy-20+rd()*16,1.6,` fill="${c2}"`));
    o.push(bxP(pe,` fill="none" stroke="${ow}" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"`)+bxP(pe,` fill="none" stroke="${c1}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"`));
    if(pad==='joelhos') o.push(bxP(pe,` fill="none" stroke="${c2}" stroke-width="3.6" stroke-dasharray="2.4 14" stroke-dashoffset="-13"`));
    o.push(bxE(cx,cy+2,12,10,` fill="${c3}" stroke="${ow}" stroke-width="1.4"`));
    let pelos=''; for(let i=0;i<60;i++){ const a=rd()*Math.PI*2, r=rd(); pelos+=`M${(cx+Math.cos(a)*20*r).toFixed(1)} ${(cy-12+Math.sin(a)*16*r).toFixed(1)} l${(Math.cos(a)*1.6).toFixed(1)} ${(Math.sin(a)*1.6).toFixed(1)}`; } o.push(bxP(pelos,` stroke="${bxL(c1,.35)}" stroke-width=".5" opacity=".7"`));
    [-1,1].forEach(s=>o.push(bxP(`M${cx+s*3} ${cy+8} q${s*2} 6 ${s*.5} 9`,` fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round"`)));
    [[-2.4,-1],[2.4,-1],[-1,-2.6],[1,-2.6],[-4.6,0],[4.6,0]].forEach(([dx,dy],i)=>o.push(bxC(cx+dx,cy+dy,i<2?1.4:.8,` fill="#0A0A0A"`)+(i<2?bxC(cx+dx+.4,cy+dy-.4,.4,` fill="#fff"`):'')));
    return o.join(''); }
  const cy=G-14; let pe='';
  for(let i=0;i<4;i++) [-1,1].forEach(s=>{ pe+=`M${cx+s*8} ${cy+i} Q${cx+s*(18+i*4)} ${cy-6+i*2} ${cx+s*(22+i*5)} ${G-1}`; });
  const cauda=`M${cx} ${cy-4} Q${cx-4} ${cy-30} ${cx} ${cy-46} Q${cx+8} ${cy-58} ${cx+2} ${cy-62}`;
  o.push(bxP(cauda,` fill="none" stroke="${ow}" stroke-width="9.4" stroke-linecap="round"`)+bxP(cauda,` fill="none" stroke="${c1}" stroke-width="7.6" stroke-linecap="round"`)+bxP(cauda,` fill="none" stroke="${c2}" stroke-width="7.6" stroke-dasharray=".8 6"`));
  o.push(bxP(`M${cx+2} ${cy-62} q-6 4 -3 12 q2 -7 7 -8Z`,` fill="${c3}" stroke="${ow}" stroke-width="1"`));
  o.push(bxP(pe,` fill="none" stroke="${ow}" stroke-width="3" stroke-linecap="round"`)+bxP(pe,` fill="none" stroke="${c2}" stroke-width="1.8" stroke-linecap="round"`));
  o.push(bxE(cx,cy,14,9,` fill="${c1}" stroke="${ow}" stroke-width="1.4"`));
  if(pad==='listras'||pad==='faixas') for(let i=0;i<4;i++) o.push(bxP(`M${cx-10} ${cy-5+i*3} q10 -2 20 0`,` fill="none" stroke="${pad==='faixas'?c3:c2}" stroke-width="1.1"`));
  if(pad==='manchas') for(let i=0;i<6;i++) o.push(bxC(cx+(rd()-.5)*20,cy+(rd()-.5)*10,1.1,` fill="${c3}"`));
  [-1,1].forEach(s=>{ const pd=`M${cx+s*10} ${cy+3} Q${cx+s*22} ${cy+10} ${cx+s*26} ${cy}`; o.push(bxP(pd,` fill="none" stroke="${ow}" stroke-width="5.2" stroke-linecap="round"`)+bxP(pd,` fill="none" stroke="${c1}" stroke-width="3.6" stroke-linecap="round"`)); const px=cx+s*27, py=cy-4; o.push(bxE(px,py,6,4.4,` fill="${c1}" stroke="${ow}" stroke-width="1.2" transform="rotate(${s*-30} ${px} ${py})"`)+bxP(`M${px+s*2} ${py-3} l${s*4} -6 M${px-s*2} ${py-3} l${-s*1} -7`,` stroke="${ow}" stroke-width="2" stroke-linecap="round"`)); });
  o.push(bxC(cx-2,cy-4,1.2,` fill="#0A0A0A"`)+bxC(cx+2,cy-4,1.2,` fill="#0A0A0A"`)+bxC(cx-1.6,cy-4.4,.35,` fill="#fff"`)+bxC(cx+2.4,cy-4.4,.35,` fill="#fff"`));
  return o.join(''); }

// ---------- desenho final ----------
// fase da vida pela fração da expectativa da espécie: filhote tem cabeça e olhos grandes, idoso fica grisalho
function bxFase(p){ const sp=p&&PET_SPECIES.find(x=>x.s===p.species||bxRaiz(x.s)===bxRaiz(p.species)), vida=sp&&sp.life?(sp.life[0]+sp.life[1])/2:(p&&p.life)||12, a=+(p&&p.age)||0, f=a/Math.max(1,vida);
  return a<1||f<.08?'filhote':f<.2?'jovem':f>.7?'idoso':'adulto'; }
// porte: raças pequenas e grandes mudam o tamanho; bichos sem raça têm porte sorteado
function bxPorte(p,def,lk){ const rc=lk.rc||{}; if(rc.L||rc.H) return Math.max(.8,Math.min(1.2,Math.sqrt((rc.L||def.L)*(rc.H||def.H)/(def.L*def.H))));
  return def.t==='q'&&/^Cachorro/.test(p&&p.species||'')?[.78,.9,1,1.1][lk.seed%4]:1; }
function bichoSVG(p,{w=120,cls='bicho3'}={}){ const sp=bxRaiz(p&&p.species), def=BX_SP[sp], lk0=bxLook(p); if(!def||!lk0) return '';
  const fase=bxFase(p), lk=Object.assign({},lk0,{marcas:lk0.pad==='rott'?{}:Object.assign({},lk0.marcas)});
  if(fase==='filhote') Object.assign(lk,{hs:(lk.hs||1)*1.2,es:(lk.es||1)*1.3,ms:(lk.ms||1)*.75,earS:(lk.earS||1)*1.06,gord:lk.gord*(def.hoof?.82:.94),legK:def.hoof?1.75:1,pelo:Math.max(lk.pelo||0,def.t==='q'?1:0)});
  else if(fase==='jovem') Object.assign(lk,{hs:(lk.hs||1)*1.08,es:(lk.es||1)*1.12});
  else if(fase==='idoso'){ Object.assign(lk,{es:(lk.es||1)*.9,gord:lk.gord*1.07,earS:(lk.earS||1)*.94,hs:(lk.hs||1)*.97}); lk.marcas.velho=1; }
  let s; try{ const f=BXF[sp]; s=def.t==='q'?bxfMamifero(def,f,lk,p):def.t==='a'?bxfAve(def,lk):def.t==='f'?bxfPeixe(def,lk):def.t==='o'?bxfPolvo(def,lk):def.t==='r'?bxfReptil(def,lk):def.t==='s'?bxfCobra(def,lk):bxfAracnideo(def,lk); }catch(e){ console.error(e); return ''; }
  const tam=(fase==='filhote'?.74:fase==='jovem'?.86:fase==='idoso'?.97:1)*lk.tam*bxPorte(p,def,lk0), agua=def.t==='f'||def.t==='o';
  const chao=agua?`<rect x="0" y="0" width="100" height="100" rx="14" fill="#BFE3F4"/><path d="M0 86 Q25 80 50 86 T100 86 V100 H0Z" fill="#E6D4A2"/>`:`<ellipse cx="50" cy="${BXF_G+.6}" rx="34" ry="3.4" fill="#000" opacity=".14"/>`;
  return `<svg class="${cls}" viewBox="0 0 100 100" width="${w}" height="${w}" aria-hidden="true">${chao}<g transform="translate(50 ${BXF_G}) scale(${tam.toFixed(3)}) translate(-50 -${BXF_G})">${s}</g></svg>`; }
