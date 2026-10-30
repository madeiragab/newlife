// ===== 3.5: os outros 360 itens (total de 400) =====
// Cada item usa uma forma desenhada com as próprias cores e detalhes. O id vem da categoria + nome (permanente).
const I4F={
 cel:(c,k)=>I4R(20,6,24,48,c,6)+I4R(23,11,18,36,k,2)+I4C(32,50,1.6,'#888'),
 tab:(c,k)=>I4R(10,8,44,48,c,6)+I4R(14,12,36,38,k,2)+I4C(32,53,1.4,'#888'),
 note:(c,k)=>I4R(14,12,36,26,c,3)+I4R(17,15,30,20,k,1)+I4P('M8 40h48l-4 8H12Z','#9A96AE'),
 tv:(c,k)=>I4R(6,10,52,32,c,3)+I4R(9,13,46,26,k,1)+I4P('M28 42v8M36 42v8M22 52h20'),
 mon:(c,k)=>I4R(8,10,48,30,c,3)+I4R(11,13,42,24,k,1)+I4R(28,40,8,8,c,1)+I4R(18,48,28,5,c,2),
 pc:(c,k)=>I4R(18,6,28,48,c,3)+I4C(32,16,4,k)+I4P('M24 28h16M24 34h16M24 40h16'),
 con:(c,k)=>I4P('M12 26q6-6 20-6t20 6l4 16q2 8-6 8-4 0-8-6H22q-4 6-8 6-8 0-6-8Z',c)+I4C(42,32,2.4,k)+I4C(47,28,2.4,'#5BD18B')+I4P('M18 32h8M22 28v8'),
 fone:(c,k)=>I4P('M14 36q0-24 18-24t18 24')+I4R(9,32,10,16,c,4)+I4R(45,32,10,16,c,4)+I4C(14,40,2,k)+I4C(50,40,2,k),
 som:(c,k)=>I4R(16,6,32,50,c,5)+I4C(32,20,7,k)+I4C(32,40,10,k)+I4C(32,40,4,c),
 rel:(c,k)=>I4R(26,4,12,56,c,3)+I4C(32,32,13,k)+I4C(32,32,10,'#FFFFFF')+I4P('M32 32v-7M32 32l5 3'),
 smw:(c,k)=>I4R(26,4,12,56,c,3)+I4R(20,20,24,24,'#2A2238',6)+I4R(23,23,18,18,k,4),
 cam:(c,k)=>I4R(8,18,48,32,c,5)+I4R(16,12,14,8,c,2)+I4C(32,34,11,'#2A2238')+I4C(32,34,6,k)+I4C(48,24,2,'#FF5C7A'),
 drone:(c,k)=>I4R(22,26,20,12,c,4)+I4P('M22 30L10 20M42 30l12-10M22 34L10 44M42 34l12 10')+[10,54].map(x=>I4E(x,20,8,2,k)+I4E(x,44,8,2,k)).join('')+I4C(32,38,3,'#2A2238'),
 impr:(c,k)=>I4R(10,22,44,22,c,3)+I4R(18,10,28,12,'#FFFFFF',1)+I4R(18,40,28,14,'#FFFFFF',1)+I4C(46,30,2,k),
 rot:(c,k)=>I4R(8,34,48,16,c,4)+I4P('M18 34L14 12M32 34V10M46 34l4-22')+I4C(20,42,2,k)+I4C(28,42,2,k)+I4C(36,42,2,k),
 mouse:(c,k)=>I4P('M32 8q14 0 14 18v12q0 18-14 18T18 38V26q0-18 14-18Z',c)+I4P('M32 8v14')+I4R(30,14,4,6,k,2),
 tecl:(c,k)=>I4R(4,22,56,22,c,3)+[8,15,22,29,36,43,50].map(x=>I4R(x,26,5,5,k,1)+I4R(x,33,5,5,k,1)).join('')+I4R(16,40,32,3,k,1),
 proj:(c,k)=>I4R(8,22,48,22,c,5)+I4C(20,33,8,'#2A2238')+I4C(20,33,4,k)+I4P('M40 30h10M40 36h10'),
 vr:(c,k)=>I4R(8,22,48,22,c,10)+I4R(13,27,16,12,k,5)+I4R(35,27,16,12,k,5)+I4P('M8 30H4M56 30h4'),
 mic:(c,k)=>I4R(24,6,16,26,c,8)+I4P('M28 12h8M28 18h8M28 24h8')+I4P('M18 26q0 14 14 14t14-14M32 40v10M22 54h20')+I4C(32,50,1,k),
 hd:(c,k)=>I4R(14,8,36,48,c,5)+I4C(32,28,10,k)+I4C(32,28,2,'#2A2238')+I4C(42,48,1.6,'#5BD18B'),
 bat:(c,k)=>I4R(18,10,28,44,c,5)+I4R(28,6,8,4,c,1)+I4P('M34 20l-6 12h8l-6 12',k),
 radio:(c,k)=>I4R(6,20,52,30,c,5)+I4C(20,36,8,k)+I4R(34,28,18,6,'#FFD23F',1)+I4P('M10 20L40 8'),
 sofa:(c,k)=>I4R(8,22,48,20,c,6)+I4R(4,28,10,20,k,4)+I4R(50,28,10,20,k,4)+I4R(12,36,40,12,c,3)+I4P('M14 50v4M50 50v4'),
 polt:(c,k)=>I4R(14,14,36,30,c,8)+I4R(8,28,10,20,k,4)+I4R(46,28,10,20,k,4)+I4R(16,36,32,12,c,3)+I4P('M18 50v4M46 50v4'),
 cama:(c,k)=>I4R(6,18,52,10,'#A0724E',3)+I4R(8,28,48,16,'#F4F0FF',4)+I4R(12,24,14,8,'#FFFFFF',4)+I4R(38,24,14,8,'#FFFFFF',4)+I4R(8,36,48,8,c,3)+I4P('M8 44v8M56 44v8'),
 mesa:(c,k)=>I4R(4,22,56,8,c,2)+I4P('M10 30v24M54 30v24M14 30l4 8M50 30l-4 8')+I4R(24,14,16,8,k,2),
 cad:(c,k)=>I4R(20,6,24,26,c,4)+I4R(18,32,28,8,k,2)+I4P('M20 40v16M44 40v16'),
 gel:(c,k)=>I4R(18,4,28,52,c,4)+I4P('M18 22h28')+I4P('M40 10v8M40 28v14')+I4C(24,12,1.4,k),
 fog:(c,k)=>I4R(10,16,44,40,c,3)+I4R(14,26,36,24,'#2A2238',2)+I4R(18,30,28,14,k,1)+[18,28,38,48].map(x=>I4C(x-2,21,2,'#2A2238')).join('')+I4E(22,13,6,2,'#6B6782')+I4E(42,13,6,2,'#6B6782'),
 micro:(c,k)=>I4R(6,16,52,32,c,4)+I4R(10,20,30,24,'#2A2238',2)+I4R(13,23,24,18,k,1)+I4C(48,26,2,'#2A2238')+I4C(48,34,2,'#2A2238'),
 lav:(c,k)=>I4R(12,6,40,50,c,4)+I4C(32,34,13,'#6B6782')+I4C(32,34,9,k)+I4P('M14 16h36')+I4C(42,11,2,'#2A2238'),
 ar:(c,k)=>I4R(4,18,56,22,c,6)+I4P('M10 32h44M10 36h44',k)+I4C(52,24,1.6,'#5BD18B'),
 vent:(c,k)=>I4C(32,24,18,'#FFFFFF')+I4P('M32 24q-8-14 2-14t-2 14q14-4 14 6t-14-6q4 14-6 14t6-14',k)+I4C(32,24,3,c)+I4P('M32 42v10M22 54h20'),
 liq:(c,k)=>I4P('M20 8h24l-4 30H24Z',k)+I4R(16,38,32,16,c,3)+I4R(22,4,20,6,c,2)+I4C(32,46,3,'#2A2238'),
 airf:(c,k)=>I4P('M14 14q0-8 18-8t18 8v34q0 6-18 6t-18-6Z',c)+I4R(18,32,28,14,'#2A2238',3)+I4C(32,20,4,k),
 cafe:(c,k)=>I4R(14,8,30,44,c,5)+I4R(18,14,22,8,'#2E2A3E',2)+I4R(24,34,12,12,'#FFFFFF',2)+I4C(40,28,2,k),
 robo:(c,k)=>I4E(32,40,24,12,'#4A4560')+I4E(32,36,24,12,c)+I4C(32,33,4,k),
 lum:(c,k)=>I4P('M20 8h24l8 20H12Z',c)+I4P('M32 28v22M22 54h20')+I4C(32,30,3,k),
 est:(c,k)=>I4R(10,4,44,52,c,2)+I4P('M10 18h44M10 32h44M10 46h44')+I4R(14,8,4,10,'#E5484D',0)+I4R(20,10,4,8,'#5B8CFF',0)+I4R(16,22,6,10,k,0)+I4R(36,36,10,10,'#FFD23F',1),
 guar:(c,k)=>I4R(8,4,48,52,c,3)+I4P('M32 4v52')+I4C(29,30,1.6,k)+I4C(35,30,1.6,k),
 tap:(c,k)=>I4R(6,20,52,28,c,4)+I4R(12,26,40,16,k,2)+I4P('M6 24H2M6 32H2M6 40H2M58 24h4M58 32h4M58 40h4'),
 pan:(c,k)=>I4P('M10 28h40v14q0 10-10 10H20q-10 0-10-10Z',c)+I4E(30,28,20,4,k)+I4P('M50 32h10'),
 tor:(c,k)=>I4R(10,24,44,28,c,8)+I4R(18,16,10,12,'#E0A460',2)+I4R(34,16,10,12,'#E0A460',2)+I4R(50,34,6,4,k,1),
 ferro:(c,k)=>I4P('M8 46q4-24 28-24h20v24Z',c)+I4P('M24 22q4-10 16-10h12v10',k),
 purif:(c,k)=>I4R(18,10,28,44,c,6)+I4R(22,16,20,20,k,3)+I4C(32,44,3,'#5B8CFF'),
 bike:(c,k)=>I4C(16,42,10,'none')+I4C(48,42,10,'none')+`<path d="M16 42l10-16h14l8 16M26 26l8 16h-18" stroke="${c}" stroke-width="3" fill="none"/>`+I4P('M38 20h6M24 22h6'),
 bola:(c,k)=>I4C(32,32,20,c)+I4P('M12 32h40M32 12q-12 20 0 40M32 12q12 20 0 40',k),
 tenis:(c,k)=>I4E(24,24,14,18,'none')+I4P('M30 38l14 18',c)+I4P('M14 18l20 12M14 28l20-8M18 12l12 22',k)+I4C(48,20,6,'#D7F25A'),
 halt:(c,k)=>I4R(6,20,10,24,c,3)+I4R(48,20,10,24,c,3)+I4R(16,28,32,8,k,2),
 skate:(c,k)=>I4R(6,26,52,8,c,4)+I4C(16,40,4,k)+I4C(48,40,4,k),
 patins:(c,k)=>I4P('M14 8h18v26h14q8 0 8 8v4H14Z',c)+[18,30,42].map(x=>I4C(x,52,4,k)).join(''),
 tenda:(c,k)=>I4P('M4 52L32 10l28 42Z',c)+I4P('M32 10l-6 42h12Z',k),
 vara:(c,k)=>`<path d="M10 54L50 8" stroke="${c}" stroke-width="3" fill="none"/>`+I4P('M50 8q4 20 0 30')+I4C(16,46,4,k),
 luva:(c,k)=>I4P('M16 30q0-20 16-20t16 20v10q0 10-10 10H26q-10 0-10-10Z',c)+I4P('M16 34q-6-2-6 4t8 6',c)+I4R(18,48,28,8,k,2),
 capa:(c,k)=>I4P('M10 40q0-28 22-28t22 28Z',c)+I4R(8,40,48,6,k,2)+I4P('M24 18q4-2 8-2'),
 caiaque:(c,k)=>I4P('M2 40q30-14 60 0q-30 14-60 0Z',c)+I4E(32,38,8,3,'#2A2238')+`<path d="M14 20L50 56" stroke="${k}" stroke-width="3"/>`,
 moch:(c,k)=>I4R(14,14,36,42,c,10)+I4R(20,32,24,16,k,4)+I4P('M24 14q0-8 8-8t8 8'),
 saco:(c,k)=>I4P('M32 2v8')+I4R(18,10,28,46,c,10)+I4P('M18 22h28M18 44h28',k),
 golf:(c,k)=>`<path d="M44 6L24 50" stroke="${c}" stroke-width="3"/>`+I4P('M24 50h-12l2 6h12Z',k)+I4C(46,54,3,'#FFFFFF'),
 prancha:(c,k)=>I4P('M32 4q14 24 0 52q-14-28 0-52Z',c)+`<path d="M32 8v44" stroke="${k}" stroke-width="3"/>`,
 viol:(c,k)=>I4P('M22 34q-10 4-8 14t14 8q8-2 8-10 6-2 6-8t-8-8q-8-2-12 4Z',c)+I4C(28,44,4,'#5A3A22')+I4R(34,6,6,28,k,2)+I4R(33,2,8,6,'#4A3020',2),
 guit:(c,k)=>I4P('M16 36q-6 10 2 16t16 0l4-8q6-4 2-10l-10-2q-8-2-14 4Z',c)+I4R(34,4,5,32,'#2E2A3E',2)+I4R(22,42,10,3,k,1),
 teclm:(c,k)=>I4R(4,22,56,22,c,3)+I4R(7,30,50,12,'#FFFFFF',1)+[12,18,24,30,36,42,48].map(x=>I4R(x,30,3,7,'#2A2238',0)).join('')+I4C(14,26,1.6,k)+I4C(20,26,1.6,k),
 bat2:(c,k)=>I4E(32,44,14,8,c)+I4R(18,34,28,10,c,2)+I4E(32,34,14,4,'#F4F0FF')+I4E(12,26,8,3,k)+I4E(52,26,8,3,k)+I4P('M12 28v24M52 28v24'),
 vlno:(c,k)=>I4P('M26 22q-8 4-4 12-4 10 6 16 4 2 8 0 10-6 6-16 4-8-4-12-6-2-12 0Z',c)+I4R(30,4,4,20,'#2E2A3E',2)+`<path d="M14 54L52 12" stroke="${k}" stroke-width="2"/>`,
 flau:(c,k)=>`<path d="M8 52L56 12" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`+[18,26,34,42].map((x,i)=>I4C(x,52-(x-8)*.83,1.6,k)).join(''),
 sax:(c,k)=>I4P('M24 6h6v30q0 10 8 10t8-8l6-4q2 16-14 20-16 2-14-16Z',c)+I4C(32,34,1.6,k)+I4C(32,26,1.6,k)+I4C(32,18,1.6,k),
 trom:(c,k)=>I4P('M6 30h34l14-10v24L40 34H6Z',c)+I4R(18,22,4,8,k,1)+I4R(24,22,4,8,k,1)+I4R(30,22,4,8,k,1),
 pand:(c,k)=>I4C(32,32,22,c)+I4C(32,32,17,k)+[0,1,2,3,4,5].map(i=>I4C(32+Math.cos(i)*20,32+Math.sin(i)*20,2.4,'#C0C4D0')).join(''),
 gaita:(c,k)=>I4R(6,24,52,16,c,3)+[10,16,22,28,34,40,46,52].map(x=>I4R(x-1,30,3,5,k,0)).join(''),
 harpa:(c,k)=>I4P('M14 54V10q20 0 36 30l-6 14Z',c)+I4P('M20 14v40M26 15v39M32 18v36M38 24v30',k),
 acor:(c,k)=>I4R(6,14,14,40,c,3)+I4R(44,14,14,40,c,3)+I4P('M20 14l6 40 6-40 6 40 6-40',k),
 amp:(c,k)=>I4R(8,10,48,44,c,4)+I4R(12,20,40,30,k,2)+I4C(16,15,1.6,'#FFD23F')+I4C(22,15,1.6,'#FFD23F'),
 anel:(c,k)=>`<circle cx="32" cy="40" r="14" fill="none" stroke="${c}" stroke-width="4"/>`+I4P('M24 18l8-10 8 10-8 8Z',k),
 colar:(c,k)=>`<path d="M12 10q20 44 40 0" fill="none" stroke="${c}" stroke-width="3"/>`+I4P('M32 40l6 8-6 8-6-8Z',k),
 brinco:(c,k)=>[20,44].map(x=>I4C(x,14,3,c)+I4P(`M${x} 17v10`)+I4P(`M${x} 27l6 10-6 10-6-10Z`,k)).join(''),
 puls:(c,k)=>`<ellipse cx="32" cy="34" rx="22" ry="14" fill="none" stroke="${c}" stroke-width="5"/>`+[14,24,32,40,50].map(x=>I4C(x,x===32?20:x<32?22:22,2.4,k)).join(''),
 perf:(c,k)=>I4R(26,6,12,10,'#2A2238',2)+I4R(14,16,36,40,c,8)+I4R(20,28,24,14,k,2),
 caneta:(c,k)=>`<path d="M12 52L50 14" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`+I4P('M12 52l-4 4 6-2Z',k)+`<path d="M40 20l6 6" stroke="${k}" stroke-width="2"/>`,
 bolsa:(c,k)=>I4P('M22 22q0-14 10-14t10 14')+I4P('M10 22h44l-4 32H14Z',c)+I4R(28,30,8,6,k,1),
 ocul:(c,k)=>I4R(6,24,22,16,c,8)+I4R(36,24,22,16,c,8)+I4P('M28 30q4-4 8 0M6 28l-4-4M58 28l4-4')+I4P('M10 28l6 0',k),
 mala:(c,k)=>I4P('M24 14v-6h16v6')+I4R(10,14,44,40,c,5)+I4P('M22 14v40M42 14v40',k)+I4C(18,56,2,'#2A2238')+I4C(46,56,2,'#2A2238'),
 tenisl:(c,k)=>I4P('M6 40q2-14 14-16l10 6q12 2 22 4t6 12H6Z',c)+I4P('M6 46h52',k)+I4P('M22 28l4 4M26 26l4 4'),
 abot:(c,k)=>[18,46].map(x=>I4R(x-10,22,20,20,c,4)+I4C(x,32,5,k)).join(''),
 quadro:(c,k)=>I4R(6,10,52,40,'#C8913A',2)+I4R(11,15,42,30,c,0)+I4P('M11 45l12-14 8 8 8-10 14 16Z',k)+I4C(44,22,4,'#FFD23F'),
 escul:(c,k)=>I4R(18,46,28,8,'#6B6782',2)+I4P('M26 46q-4-14 2-20-4-8 4-14t8 4q8 4 2 12 6 6 2 18Z',c)+I4C(32,14,1.6,k),
 vinil:(c,k)=>I4R(6,8,34,34,c,2)+I4C(40,36,18,'#1E1A2A')+I4C(40,36,6,k)+I4C(40,36,1,'#fff'),
 cartas:(c,k)=>I4R(10,14,24,34,c,3)+I4R(22,10,24,34,k,3)+I4R(32,16,24,34,'#FFFFFF',3)+I4C(44,32,5,c),
 mini:(c,k)=>I4P('M8 40l4-10q2-4 8-4h20q6 0 10 6l6 8v6H8Z',c)+I4C(18,46,5,'#2A2238')+I4C(46,46,5,'#2A2238')+I4R(22,30,16,6,k,1),
 vaso:(c,k)=>I4P('M22 8h20l-4 10q14 10 8 28-4 10-14 10t-14-10q-6-18 8-28Z',c)+I4P('M18 34q14 6 28 0',k),
 moeda:(c,k)=>I4C(26,34,16,c)+I4C(38,28,16,k)+I4C(38,28,11,'none')+I4P('M34 28h8M38 24v8'),
 album:(c,k)=>I4R(10,8,44,48,c,3)+I4R(16,14,14,16,k,1)+I4R(34,14,14,16,'#FFFFFF',1)+I4R(16,34,14,16,'#FFFFFF',1)+I4R(34,34,14,16,k,1),
 hq:(c,k)=>I4R(12,6,40,52,c,2)+I4P('M18 12h28v18H18Z','#FFFFFF')+I4P('M20 36l10-4 4 8 10-6v16H20Z',k)+I4P('M22 18h12'),
 estat:(c,k)=>I4R(20,48,24,8,'#2A2238',2)+I4C(32,14,7,c)+I4P('M24 46q0-18 8-24 8 6 8 24Z',c)+I4P('M24 28l-6-8M40 28l6-8',k),
 foto:(c,k)=>I4R(10,8,44,48,'#FFFFFF',2)+I4R(14,12,36,30,c,0)+I4C(26,24,5,k)+I4P('M14 42l12-10 10 6 14-10v14Z','#2A2238'),
 urso:(c,k)=>I4C(20,14,6,c)+I4C(44,14,6,c)+I4C(32,24,13,c)+I4E(32,46,14,12,c)+I4C(27,22,1.6,'#2A2238')+I4C(37,22,1.6,'#2A2238')+I4E(32,28,4,3,k),
 bloco:(c,k)=>I4R(8,34,24,16,c,2)+I4R(32,34,24,16,k,2)+I4R(20,18,24,16,'#FFD23F',2)+I4R(12,30,6,4,c,1)+I4R(24,14,6,4,'#FFD23F',1),
 livro:(c,k)=>I4R(8,14,10,40,c,1)+I4R(18,10,10,44,k,1)+I4R(28,16,10,38,'#5BAA62',1)+I4P('M40 20l8-4 10 36-8 3Z','#FFD23F'),
 bone:(c,k)=>I4C(32,14,9,'#F2C9A0')+I4P('M22 10q10-10 20 0v8q-10-6-20 0Z',k)+I4P('M22 26h20l6 26H16Z',c)+I4C(29,14,1.2,'#2A2238')+I4C(35,14,1.2,'#2A2238'),
 carro:(c,k)=>I4P('M8 40l4-10q2-4 8-4h20q6 0 10 6l6 8v6H8Z',c)+I4C(18,46,6,k)+I4C(46,46,6,k)+I4R(22,30,16,6,'#9AD4F5',1),
 quebra:(c,k)=>I4P('M8 8h22v8q4-4 6 0t-6 6v8H8Z',c)+I4P('M34 8h22v22H34v-8q-4 4-6 0t6-6Z',k)+I4P('M8 34h22v22H8Z',k)+I4P('M34 34h22v22H34Z',c),
 berco:(c,k)=>I4R(8,16,48,30,'none',3)+I4P('M8 16v40M56 16v40M16 20v26M24 20v26M32 20v26M40 20v26M48 20v26',c)+I4R(10,38,44,8,k,2),
 carrin:(c,k)=>I4P('M12 18q0 22 20 22h16V18Z',c)+I4P('M48 18l6-10',k)+I4C(18,50,5,'#2A2238')+I4C(42,50,5,'#2A2238')+I4P('M14 40l4 6M46 40l-4 6'),
 globo:(c,k)=>I4C(32,26,18,c)+I4P('M22 18q6 4 4 10t6 8M38 14q-2 8 6 10',k)+I4P('M32 44v8M22 54h20M14 26q0 18 18 18'),
 pateta:(c,k)=>I4P('M14 48h30L42 10')+I4P('M36 10h12')+I4C(14,50,5,c)+I4C(46,50,5,c)+I4R(14,44,30,4,k,2),
 furad:(c,k)=>I4R(10,16,32,14,c,4)+I4P('M42 21h14')+I4P('M20 30l-4 20h14l2-20Z',k),
 caixaf:(c,k)=>I4P('M24 22v-8h16v8')+I4R(6,22,52,30,c,3)+I4P('M6 34h52')+I4R(28,30,8,8,k,1),
 serra:(c,k)=>I4C(26,36,16,'#D7DCE4')+I4C(26,36,4,'#6B6782')+I4R(26,14,30,14,c,4)+I4C(48,21,2,k),
 escada:(c,k)=>`<path d="M18 56L26 4M46 56L38 4" stroke="${c}" stroke-width="5" fill="none"/>`+I4P('M22 44h20M24 32h16M25 20h14',k),
 gerad:(c,k)=>I4R(6,18,52,30,c,4)+I4R(12,24,22,18,k,2)+I4C(46,33,6,'#E8EEF4')+I4P('M8 48v6M56 48v6'),
 mart:(c,k)=>`<path d="M22 54L40 20" stroke="${k}" stroke-width="6" stroke-linecap="round"/>`+I4R(28,8,28,12,c,2),
 chave:(c,k)=>`<path d="M14 52L42 18" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`+I4P('M38 8q10-4 16 4l-6 6 2 4-6-2-6 6q-6-8 0-18Z',c)+I4C(14,52,2,k),
 trena:(c,k)=>I4R(10,16,32,32,c,8)+I4C(26,32,7,k)+I4R(42,40,16,6,'#FFD23F',1),
 lixa:(c,k)=>I4R(8,34,44,14,k,3)+I4P('M14 34q0-18 18-18h12q8 0 8 8v10Z',c),
 comp:(c,k)=>I4E(30,38,22,14,c)+I4R(36,14,16,14,k,3)+I4C(18,52,4,'#2A2238')+I4C(42,52,4,'#2A2238'),
 grama:(c,k)=>I4R(8,30,36,18,c,4)+I4P('M40 30L56 6M50 6h10')+I4C(14,50,5,'#2A2238')+I4C(38,50,5,'#2A2238')+I4R(12,26,12,4,k,1),
 carrm:(c,k)=>I4P('M8 22h36l-6 20H14Z',c)+I4P('M38 42l18 8M14 42l-4 10',k)+I4C(24,50,5,'#2A2238'),
 solda:(c,k)=>I4R(8,24,30,26,c,3)+I4C(16,32,3,k)+I4P('M38 36q10 0 12-10l6-14'),
 kit:(c,k)=>I4R(6,14,52,36,c,4)+[14,22,30,38,46].map(x=>`<path d="M${x} 20v24" stroke="${k}" stroke-width="3"/>`).join(''),
};
const I4F_DUR={cel:4,tab:4,note:5,tv:6,mon:6,pc:6,con:5,fone:3,som:5,rel:20,smw:4,cam:7,drone:4,impr:5,rot:5,mouse:3,tecl:4,proj:6,vr:4,mic:6,hd:5,bat:3,radio:8,sofa:8,polt:8,cama:10,mesa:15,cad:10,gel:10,fog:10,micro:8,lav:10,ar:10,vent:6,liq:6,airf:5,cafe:6,robo:5,lum:8,est:15,guar:15,tap:8,pan:6,tor:6,ferro:6,purif:6,bike:6,bola:2,tenis:5,halt:20,skate:4,patins:4,tenda:5,vara:5,luva:4,capa:5,caiaque:10,moch:4,saco:6,golf:10,prancha:6,viol:8,guit:8,teclm:8,bat2:8,vlno:10,flau:10,sax:12,trom:12,pand:6,gaita:6,harpa:15,acor:12,amp:8,anel:30,colar:30,brinco:30,puls:20,perf:2,caneta:15,bolsa:12,ocul:6,mala:8,tenisl:3,abot:20,quadro:40,escul:60,vinil:20,cartas:15,mini:15,vaso:40,moeda:50,album:20,hq:20,estat:30,foto:30,urso:5,bloco:10,livro:20,bone:5,carro:5,quebra:8,berco:6,carrin:5,globo:10,pateta:5,furad:8,caixaf:15,serra:8,escada:15,gerad:12,mart:20,chave:20,trena:10,lixa:8,comp:10,grama:8,carrm:12,solda:10,kit:15};
// nome:preço:forma:cor:cor2
const ITENS4_TXT={
Eletrônicos:`Celular básico:900:cel:#6B6782:#9AD4F5;Celular dobrável:9000:cel:#2E2A3E:#C39BFF;Celular gamer:5500:cel:#E5484D:#5BD18B;Celular top de linha:8500:cel:#C9CED8:#6EC6FF;Celular rosa:2200:cel:#FF7AA2:#FFE0EC;Celular resistente:2800:cel:#4E5D3A:#9AD4F5;Celular para idosos:600:cel:#FFFFFF:#FFD23F;
Tablet:2500:tab:#3B3550:#7FD3FF;Tablet profissional:8000:tab:#C9CED8:#5B8CFF;Leitor de livros digital:800:tab:#2E2A3E:#E8E6DA;Mesa digitalizadora:1800:tab:#2E2A3E:#3B3550;
Notebook gamer:9000:note:#E5484D:#5BD18B;Notebook ultrafino:7500:note:#C9CED8:#7FD3FF;Notebook simples:2500:note:#3B3550:#9AD4F5;Notebook de trabalho:4500:note:#2E2A3E:#6EC6FF;Chromebook:1800:note:#5B8CFF:#E8EEF4;
TV 32":1200:tv:#2E2A3E:#5B8CFF;TV 65" OLED:9000:tv:#1E1A2A:#9B5DE5;TV 75":12000:tv:#1E1A2A:#3EC6E0;TV 85" 8K:25000:tv:#1E1A2A:#FF8C42;TV de tubo antiga:200:tv:#8A7A60:#9AAA9A;
Monitor 24":900:mon:#2E2A3E:#7FD3FF;Monitor gamer 27":2500:mon:#E5484D:#5BD18B;Monitor ultrawide:4000:mon:#2E2A3E:#C39BFF;Monitor profissional 4K:6000:mon:#C9CED8:#E8EEF4;
PC gamer:9000:pc:#2E2A3E:#5BD18B;PC de escritório:3000:pc:#C9CED8:#5B8CFF;PC com luzes RGB:12000:pc:#1E1A2A:#FF5C7A;Servidor caseiro:7000:pc:#4A4560:#FFB020;Mini PC:2000:pc:#6B6782:#3EC6E0;
Console portátil:2500:con:#E5484D:#5B8CFF;Console de última geração:4500:con:#FFFFFF:#5B8CFF;Console retrô:700:con:#9A96AE:#E5484D;Controle extra:450:con:#2E2A3E:#FFD23F;Controle profissional:1200:con:#1E1A2A:#E5484D;
Fone com fio:80:fone:#2E2A3E:#9A96AE;Fone com cancelamento de ruído:2500:fone:#2E2A3E:#C39BFF;Headset gamer:900:fone:#E5484D:#5BD18B;Fone de estúdio:1800:fone:#1E1A2A:#E5484D;Fone infantil:150:fone:#5BD18B:#FFD23F;
Caixa de som portátil:500:som:#3EC6E0:#2E2A3E;Caixa de som grande:2500:som:#1E1A2A:#E5484D;Soundbar:1800:som:#2E2A3E:#6B6782;Caixa de som inteligente:700:som:#E8EEF4:#5B8CFF;Home theater:4000:som:#1E1A2A:#3B3550;
Relógio inteligente:2000:smw:#2E2A3E:#5BD18B;Relógio esportivo:1500:smw:#FF8C42:#7FD3FF;Pulseira fitness:300:smw:#5B8CFF:#2E2A3E;Relógio inteligente infantil:400:smw:#FF7AA2:#FFD23F;
Câmera profissional:9000:cam:#2E2A3E:#5B8CFF;Câmera instantânea:600:cam:#7FD3FF:#FFFFFF;Câmera de ação:1800:cam:#4A4560:#3EC6E0;Câmera antiga:900:cam:#8A6A4A:#C9CED8;Câmera de segurança:400:cam:#E8EEF4:#2E2A3E;
Drone:2500:drone:#E8EEF4:#9A96AE;Drone profissional:9000:drone:#2E2A3E:#FFB020;Drone de corrida:3500:drone:#E5484D:#2E2A3E;
Impressora:800:impr:#E8EEF4:#5BD18B;Impressora 3D:3500:impr:#FF8C42:#2E2A3E;Impressora de fotos:600:impr:#FF7AA2:#5BD18B;
Roteador wi-fi:400:rot:#2E2A3E:#5BD18B;Roteador gamer:1500:rot:#E5484D:#5BD18B;
Mouse gamer:300:mouse:#2E2A3E:#5BD18B;Mouse sem fio:120:mouse:#C9CED8:#5B8CFF;Teclado mecânico:600:tecl:#2E2A3E:#FF5C7A;Teclado sem fio:250:tecl:#E8EEF4:#C9CED8;
Projetor:3000:proj:#E8EEF4:#7FD3FF;Óculos de realidade virtual:3500:vr:#FFFFFF:#2E2A3E;Microfone de podcast:900:mic:#2E2A3E:#E5484D;HD externo:450:hd:#2E2A3E:#C9CED8;Carregador portátil:200:bat:#2E2A3E:#5BD18B;Rádio antigo:400:radio:#A0724E:#E8E6DA;Rádio de pilha:120:radio:#E5484D:#2E2A3E;Tela inteligente:900:tab:#E8EEF4:#FFD23F;Filmadora:2500:cam:#1E1A2A:#E5484D;Tocador de música portátil:300:cel:#5BD18B:#2E2A3E;Nobreak:700:hd:#1E1A2A:#5BD18B;Webcam:250:proj:#2E2A3E:#5B8CFF;Pen drive:60:bat:#5B8CFF:#FFFFFF;Rádio comunicador:400:radio:#2E2A3E:#5BD18B`,
Casa:`Sofá de couro:9000:sofa:#6A3B22:#5A3018;Sofá de canto:6500:sofa:#9A96AE:#7A7690;Sofá-cama:2500:sofa:#5B8CFF:#4A7BEE;Sofá de veludo:7000:sofa:#2F7A6A:#1E6A5A;Sofá infantil:400:sofa:#FF7AA2:#FFD23F;Sofá rústico:3500:sofa:#A0724E:#8A5A3A;
Poltrona do papai:2500:polt:#6A3B22:#5A3018;Poltrona de leitura:1800:polt:#C0392B:#A02A1E;Poltrona de amamentação:1500:polt:#E8E0D0:#C9BBA0;Poltrona gamer:2200:polt:#1E1A2A:#E5484D;Poltrona massageadora:8000:polt:#2E2A3E:#6B6782;Pufe:300:polt:#FFB020:#E09A10;
Cama de solteiro:900:cama:#5B8CFF:#4A7BEE;Cama de casal:2000:cama:#9B5DE5:#7B3DC5;Cama box queen:3800:cama:#2F7A6A:#1E6A5A;Beliche:1600:cama:#FFD23F:#E0B820;Cama de hospital:5000:cama:#E8EEF4:#9AD4F5;Cama redonda:7000:cama:#E5484D:#C0392B;
Mesa de jantar:2500:mesa:#A0724E:#FFFFFF;Mesa de escritório:900:mesa:#E8E0D0:#2E2A3E;Mesa de centro:600:mesa:#6A3B22:#5BAA62;Mesa gamer:1200:mesa:#1E1A2A:#E5484D;Mesa de sinuca:8000:mesa:#2F7A6A:#FFFFFF;Mesa de ping-pong:2500:mesa:#3B6FD6:#FFFFFF;
Cadeira de escritório:800:cad:#2E2A3E:#4A4560;Cadeira gamer:1800:cad:#E5484D:#2E2A3E;Cadeira de balanço:900:cad:#A0724E:#8A5A3A;Cadeira de praia:150:cad:#3EC6E0:#FFD23F;Cadeira de design:4500:cad:#FF8C42:#2E2A3E;
Geladeira simples:2200:gel:#E8EEF4:#9AD4F5;Geladeira inox:7000:gel:#C9CED8:#6EC6FF;Geladeira retrô:5500:gel:#7FD3C0:#FFFFFF;Frigobar:900:gel:#2E2A3E:#5BD18B;Adega climatizada:2500:gel:#1E1A2A:#8E3B6E;Freezer:2500:gel:#FFFFFF:#5B8CFF;
Fogão 4 bocas:900:fog:#E8EEF4:#FF8C42;Fogão 6 bocas inox:3500:fog:#C9CED8:#FF8C42;Fogão industrial:4500:fog:#6B6782:#E5484D;Cooktop:1500:fog:#1E1A2A:#E5484D;
Micro-ondas:600:micro:#E8EEF4:#FFD23F;Forno elétrico:900:micro:#2E2A3E:#FF8C42;Micro-ondas retrô:1200:micro:#E5484D:#FFD23F;
Máquina de lavar:2500:lav:#E8EEF4:#7FD3FF;Lava e seca:5000:lav:#2E2A3E:#5B8CFF;Lava-louças:3000:lav:#C9CED8:#9AD4F5;Secadora:2800:lav:#FFFFFF:#C39BFF;
Ar-condicionado:2500:ar:#FFFFFF:#7FD3FF;Ar-condicionado inverter:4000:ar:#E8EEF4:#5B8CFF;Climatizador:700:ar:#C9CED8:#3EC6E0;
Ventilador de mesa:150:vent:#E8EEF4:#5B8CFF;Ventilador de teto:400:vent:#A0724E:#E8E0D0;Ventilador turbo:300:vent:#2E2A3E:#9A96AE;
Liquidificador:200:liq:#E5484D:#E8F6FF;Batedeira:450:liq:#FFFFFF:#FFD23F;Processador de alimentos:600:liq:#2E2A3E:#E8F6FF;
Fritadeira sem óleo:500:airf:#2E2A3E:#FF8C42;Fritadeira grande:900:airf:#FFFFFF:#FF8C42;Panela elétrica de arroz:300:airf:#E5484D:#FFFFFF;
Cafeteira de cápsula:700:cafe:#2E2A3E:#FFD23F;Cafeteira italiana:180:cafe:#C9CED8:#2E2A3E;Chaleira elétrica:150:cafe:#5BAA62:#FFFFFF;
Aspirador de pó:500:robo:#E5484D:#FFFFFF;Robô aspirador premium:5000:robo:#FFFFFF:#5B8CFF;
Luminária de mesa:150:lum:#FFD23F:#FFFFFF;Lustre de cristal:4500:lum:#E8EEF4:#BDEBFF;Abajur:200:lum:#E8E0D0:#FFD23F;
Estante de livros:900:est:#A0724E:#5BAA62;Rack de TV:1200:est:#2E2A3E:#9B5DE5;Guarda-roupa:2000:guar:#A0724E:#FFD23F;Guarda-roupa planejado:9000:guar:#E8E0D0:#2E2A3E;
Tapete persa:6000:tap:#8E2B2B:#F2C14E;Tapete felpudo:500:tap:#E8E0D0:#FFFFFF;Jogo de panelas:600:pan:#C9CED8:#2E2A3E;Panela de pressão:250:pan:#9A96AE:#2E2A3E;Torradeira:150:tor:#E5484D:#2E2A3E;Ferro de passar:150:ferro:#5B8CFF:#E8EEF4;Purificador de água:900:purif:#E8EEF4:#9AD4F5;Purificador de ar:1200:purif:#FFFFFF:#5BD18B`,
Esportes:`Bicicleta de corrida:9000:bike:#E5484D;Mountain bike:4500:bike:#2F7A6A;Bicicleta elétrica:7000:bike:#5B8CFF;Bicicleta infantil:500:bike:#FF7AA2;Bicicleta ergométrica:2500:bike:#2E2A3E;
Bola de basquete:180:bola:#FF8C42:#2A2238;Bola de vôlei:150:bola:#FFFFFF:#5B8CFF;Bola de futebol americano:250:bola:#8A4A2A:#FFFFFF;Bola de praia:40:bola:#FFD23F:#E5484D;Bola de boliche:900:bola:#2E2A3E:#9B5DE5;
Raquete de tênis:900:tenis:#E5484D:#E8EEF4;Raquete de beach tennis:700:tenis:#3EC6E0:#FFD23F;Raquete de badminton:200:tenis:#5BAA62:#E8EEF4;Raquete de squash:400:tenis:#2E2A3E:#FF8C42;
Halteres:400:halt:#2E2A3E:#9A96AE;Kit de anilhas:1500:halt:#1E1A2A:#C9CED8;Kettlebell:250:halt:#E5484D:#2E2A3E;Barra de academia:900:halt:#6B6782:#C9CED8;
Skate:400:skate:#FFD23F:#E5484D;Longboard:900:skate:#A0724E:#5BD18B;Skate elétrico:4500:skate:#2E2A3E:#5B8CFF;
Patins:450:patins:#FF7AA2:#FFD23F;Patins de gelo:700:patins:#FFFFFF:#C9CED8;Patins inline:600:patins:#2E2A3E:#5BD18B;
Barraca de camping:600:tenda:#5BAA62:#2F7A6A;Barraca grande:1800:tenda:#FF8C42:#E5484D;Barraca de praia:300:tenda:#3EC6E0:#FFFFFF;
Vara de pesca profissional:2500:vara:#2E2A3E:#E5484D;Vara de pesca simples:150:vara:#A0724E:#5B8CFF;Molinete:600:vara:#6B6782:#FFD23F;
Luvas de boxe:350:luva:#E5484D:#FFFFFF;Luvas de MMA:250:luva:#2E2A3E:#E5484D;Saco de pancada:700:saco:#E5484D:#2E2A3E;Saco de pancada profissional:2500:saco:#1E1A2A:#FFD23F;
Capacete de ciclismo:350:capa:#5B8CFF:#2E2A3E;Capacete de moto:1200:capa:#2E2A3E:#E5484D;Capacete de skate:200:capa:#FFD23F:#2E2A3E;
Caiaque:3500:caiaque:#FF8C42:#2E2A3E;Stand-up paddle:2800:caiaque:#3EC6E0:#FFFFFF;Bote inflável:900:caiaque:#FFD23F:#2E2A3E;
Mochila de trilha:500:moch:#2F7A6A:#FF8C42;Mochila esportiva:250:moch:#2E2A3E:#5BD18B;Mochila de hidratação:300:moch:#5B8CFF:#E8EEF4;
Kit de golfe:8000:golf:#C9CED8:#2E2A3E;Taco de golfe:1500:golf:#6B6782:#C9CED8;Taco de beisebol:300:golf:#A0724E:#E8E0D0;Taco de hóquei:500:golf:#2E2A3E:#FFD23F;
Prancha de bodyboard:400:prancha:#FFD23F:#E5484D;Snowboard:2500:prancha:#9B5DE5:#FFFFFF;Prancha de kitesurf:3500:prancha:#3EC6E0:#2E2A3E;Prancha longboard:2800:prancha:#FFFFFF:#FF8C42;Wakeboard:2200:prancha:#E5484D:#2E2A3E;
Bola de pilates:80:bola:#9B5DE5:#C39BFF;Corda de pular:40:vara:#5BD18B:#E5484D;Tapete de ioga:120:tap:#9B5DE5:#C39BFF;Mesa de pebolim:1800:mesa:#2F7A6A:#FFD23F;Tabela de basquete:1500:escada:#E5484D:#FF8C42;Rede de vôlei:300:tenda:#FFFFFF:#5B8CFF`,
Música:`Violão de nylon:600:viol:#D9944A:#7A5232;Violão folk:1800:viol:#8A4A2A:#4A3020;Violão elétrico:2500:viol:#1E1A2A:#2E2A3E;Ukulele:350:viol:#FFB0C0:#A06060;Cavaquinho:500:viol:#B5652A:#4A3020;Viola caipira:1200:viol:#E0A460:#5A3A22;
Guitarra clássica de rock:6000:guit:#F2C14E:#FFFFFF;Guitarra de iniciante:900:guit:#5B8CFF:#FFFFFF;Guitarra de luxo:15000:guit:#1E1A2A:#F2C14E;Contrabaixo:3000:guit:#2F7A6A:#FFFFFF;Contrabaixo de 5 cordas:5000:guit:#8E2B2B:#2E2A3E;
Piano digital:4500:teclm:#2E2A3E:#E5484D;Sintetizador:6000:teclm:#C9CED8:#FF8C42;Teclado infantil:250:teclm:#FF7AA2:#FFD23F;Piano de cauda:60000:teclm:#1E1A2A:#F2C14E;Órgão eletrônico:8000:teclm:#A0724E:#5BD18B;
Bateria eletrônica:5000:bat2:#2E2A3E:#C9CED8;Bateria infantil:600:bat2:#5B8CFF:#FFD23F;Bateria profissional:15000:bat2:#9B5DE5:#F2C14E;Cajón:500:amp:#D9944A:#5A3A22;
Viola de arco:6000:vlno:#8A4A2A:#E8E0D0;Violoncelo:9000:vlno:#6A3B22:#E8E0D0;Violino de estudante:800:vlno:#D9944A:#E8E0D0;
Flauta transversal:3500:flau:#C9CED8:#2E2A3E;Flauta doce:60:flau:#E8E0D0:#2E2A3E;Clarinete:4000:flau:#1E1A2A:#C9CED8;Flauta de bambu:150:flau:#C8A050:#2E2A3E;
Saxofone:7000:sax:#F2C14E:#FFFFFF;Saxofone soprano:6000:sax:#C9CED8:#2E2A3E;Trompete:3500:trom:#F2C14E:#C9CED8;Trombone:4500:trom:#E0B040:#C9CED8;
Pandeiro:200:pand:#A0724E:#F4E8D0;Tamborim:80:pand:#C9CED8:#FFFFFF;Gaita:120:gaita:#C9CED8:#2E2A3E;Harpa:25000:harpa:#D9944A:#F2C14E;Sanfona:6000:acor:#E5484D:#FFFFFF;
Amplificador de guitarra:1800:amp:#2E2A3E:#6B6782;Amplificador de baixo:2500:amp:#1E1A2A:#9A96AE;Microfone de palco:600:mic:#2E2A3E:#C9CED8;Mesa de som:4000:tecl:#2E2A3E:#5BD18B;Toca-discos:1500:vinil:#A0724E:#E5484D`,
Luxo:`Relógio suíço:80000:rel:#C9CED8:#2E2A3E;Relógio de ouro:120000:rel:#F2C14E:#F2C14E;Relógio de mergulho:35000:rel:#2E2A3E:#2E7BD6;Relógio clássico de couro:9000:rel:#6A3B22:#E8E0D0;Relógio com diamantes:300000:rel:#E8EEF4:#BDEBFF;
Anel de ouro:5000:anel:#F2C14E:#F2C14E;Anel de safira:25000:anel:#C9CED8:#2E5BD6;Anel de esmeralda:30000:anel:#F2C14E:#2FAA62;Aliança de platina:12000:anel:#E8EEF4:#E8EEF4;Anel de rubi:28000:anel:#F2C14E:#E5484D;
Colar de pérolas:15000:colar:#FFFFFF:#FFF4E8;Colar de diamantes:90000:colar:#E8EEF4:#BDEBFF;Corrente de prata:1500:colar:#C9CED8:#C9CED8;Pingente de esmeralda:20000:colar:#F2C14E:#2FAA62;
Brincos de diamante:18000:brinco:#E8EEF4:#BDEBFF;Brincos de ouro:4000:brinco:#F2C14E:#F2C14E;Brincos de pérola:3000:brinco:#E8EEF4:#FFF4E8;
Pulseira de ouro:9000:puls:#F2C14E:#F2C14E;Pulseira de prata:900:puls:#C9CED8:#C9CED8;Pulseira de brilhantes:40000:puls:#E8EEF4:#BDEBFF;
Perfume importado:900:perf:#F2C14E:#FFF4E8;Perfume de grife:2500:perf:#1E1A2A:#F2C14E;Perfume raro:9000:perf:#8E3B6E:#F2C14E;
Caneta de luxo:4000:caneta:#1E1A2A:#F2C14E;Caneta de ouro:15000:caneta:#F2C14E:#2E2A3E;
Bolsa de couro italiana:9000:bolsa:#6A3B22:#F2C14E;Bolsa clássica de grife:45000:bolsa:#1E1A2A:#F2C14E;Clutch de festa:3500:bolsa:#E5484D:#F2C14E;Carteira de couro:900:bolsa:#3B2A1E:#C9CED8;
Óculos de aviador:2500:ocul:#F2C14E:#2E2A3E;Óculos de sol esportivo:1200:ocul:#E5484D:#2E2A3E;
Mala de viagem de grife:12000:mala:#6A3B22:#F2C14E;Mala de alumínio:4000:mala:#C9CED8:#9A96AE;
Tênis de grife:4500:tenisl:#FFFFFF:#F2C14E;Tênis de edição limitada:12000:tenisl:#E5484D:#2E2A3E;Sapato social italiano:3500:tenisl:#3B2A1E:#1E1A2A;Abotoaduras de ouro:5000:abot:#F2C14E:#2E5BD6;Abotoaduras de prata:1200:abot:#C9CED8:#2E2A3E`,
Arte:`Quadro abstrato:5000:quadro:#FF8C42:#9B5DE5;Paisagem a óleo:12000:quadro:#9AD4F5:#5BAA62;Retrato antigo:30000:quadro:#6A4A30:#E8C8A0;Quadro de artista famoso:250000:quadro:#2E5BD6:#F2C14E;Gravura japonesa:9000:quadro:#E8E0D0:#2E5BD6;
Escultura de mármore:45000:escul:#F4F0EA:#C9CED8;Escultura moderna:15000:escul:#E5484D:#FFD23F;Busto de bronze:22000:escul:#8A5A2A:#F2C14E;
Discos raros:9000:vinil:#2E5BD6:#F2C14E;Coleção de vinis de rock:3500:vinil:#E5484D:#FFD23F;Vinil autografado:6000:vinil:#1E1A2A:#F2C14E;
Cartas raras:8000:cartas:#9B5DE5:#F2C14E;Álbum de figurinhas completo:1200:album:#2E5BD6:#FFD23F;Coleção de selos:4000:album:#8E2B2B:#E8E0D0;Coleção de quadrinhos:2500:hq:#E5484D:#FFD23F;Quadrinho de primeira edição:30000:hq:#2E5BD6:#E5484D;
Miniatura de Fórmula 1:1500:mini:#E5484D:#FFFFFF;Miniatura de carro clássico:1200:mini:#2E5BD6:#E8EEF4;Coleção de miniaturas:5000:mini:#FFD23F:#2E2A3E;
Vaso chinês antigo:60000:vaso:#E8EEF4:#2E5BD6;Vaso de cerâmica:900:vaso:#C8703A:#E8E0D0;Vaso de cristal:4000:vaso:#BDEBFF:#E8EEF4;
Moedas antigas:6000:moeda:#C8913A:#C9CED8;Moeda de ouro rara:25000:moeda:#F2C14E:#F2C14E;
Estatueta de cinema:20000:estat:#F2C14E:#F2C14E;Troféu antigo:3000:estat:#C9CED8:#F2C14E;Boneco colecionável:800:estat:#5BAA62:#FFD23F;Action figure raro:3500:estat:#E5484D:#2E5BD6;
Foto autografada:2500:foto:#9AD4F5:#F2C14E;Fotografia de artista:8000:foto:#2E2A3E:#E8E0D0;Pôster de filme antigo:1500:foto:#E5484D:#FFD23F;Camisa autografada:5000:foto:#FFFFFF:#2E5BD6`,
Infantil:`Ursinho gigante:600:urso:#D9A06E:#F4E1C8;Coelhinho de pelúcia:120:urso:#F4F0FF:#FFB0C0;Panda de pelúcia:180:urso:#FFFFFF:#2A2238;
Kit de blocos grande:900:bloco:#5BAA62:#9B5DE5;Blocos magnéticos:500:bloco:#FF7AA2:#3EC6E0;
Livros infantis:200:livro:#FF8C42:#9B5DE5;Enciclopédia:900:livro:#8E2B2B:#2E5BD6;Livros de colorir:60:livro:#FF7AA2:#FFD23F;
Boneca:200:bone:#FF7AA2:#8A4A2A;Boneca de porcelana:1200:bone:#E8E0D0:#F2C14E;Boneco de super-herói:180:bone:#2E5BD6:#E5484D;
Carrinho de controle remoto:400:carro:#E5484D:#2E2A3E;Pista de carrinhos:500:carro:#FFD23F:#2E2A3E;Carrinho de pedal:900:carro:#5B8CFF:#2E2A3E;Trenzinho:350:carro:#2F7A6A:#E5484D;
Quebra-cabeça de 1000 peças:120:quebra:#5B8CFF:#FFD23F;Quebra-cabeça infantil:50:quebra:#FF7AA2:#5BD18B;
Berço:1500:berco:#FFFFFF:#9AD4F5;Berço de madeira:2500:berco:#A0724E:#FFE0EC;Carrinho de bebê:1800:carrin:#5B8CFF:#2E2A3E;Carrinho de bebê de luxo:6000:carrin:#2E2A3E:#C9CED8;
Globo terrestre:250:globo:#5B8CFF:#5BAA62;Kit de ciências:300:caixaf:#5BD18B:#FFFFFF;Kit de pintura:150:caixaf:#FF8C42:#FFFFFF;Patinete elétrico:2500:pateta:#2E2A3E:#5BD18B;Mochila escolar:250:moch:#9B5DE5:#FFD23F`,
Ferramentas:`Furadeira de impacto:900:furad:#2E5BD6:#2E2A3E;Parafusadeira:400:furad:#5BAA62:#2E2A3E;Martelete:1500:furad:#E5484D:#2E2A3E;
Maleta de ferramentas:1200:caixaf:#2E5BD6:#C9CED8;Caixa de ferramentas grande:1800:caixaf:#2E2A3E:#FFB020;
Serra tico-tico:500:serra:#FFB020:#2E2A3E;Motosserra:1800:serra:#FF8C42:#2E2A3E;
Escada grande:1200:escada:#FFB020:#2E2A3E;Escada de madeira:300:escada:#A0724E:#2E2A3E;
Gerador grande:9000:gerad:#2E5BD6:#2E2A3E;Painel solar portátil:2500:gerad:#2E2A3E:#5B8CFF;
Martelo:60:mart:#6B6782:#A0724E;Marreta:150:mart:#2E2A3E:#FFB020;Chave inglesa:80:chave:#C9CED8:#2E2A3E;Jogo de chaves:250:chave:#E5484D:#C9CED8;
Trena a laser:400:trena:#FFB020:#2E2A3E;Trena:50:trena:#FFD23F:#2E2A3E;Lixadeira:450:lixa:#2E5BD6:#E8C890;Esmerilhadeira:500:lixa:#5BAA62:#C9CED8;
Compressor de ar:1500:comp:#E5484D:#2E2A3E;Lavadora de alta pressão:900:comp:#FFD23F:#2E2A3E;
Cortador de grama:1500:grama:#5BAA62:#FFD23F;Roçadeira:900:grama:#FF8C42:#2E2A3E;Carrinho de mão:300:carrm:#5BAA62:#2E2A3E;Máquina de solda:1800:solda:#E5484D:#FFD23F`};
(()=>{ const pref={Eletrônicos:'el',Casa:'mv',Esportes:'es',Música:'mu',Luxo:'lx',Arte:'ar',Infantil:'in',Ferramentas:'fe'}, ids=new Set(ITENS4.map(x=>x.id));
  const slug=t=>t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  for(const [cat,txt] of Object.entries(ITENS4_TXT)) txt.split(/;\s*/).forEach(l=>{ const [t,v,f,c,k]=l.trim().split(':'); if(!t||!I4F[f]) return; let id=pref[cat]+'_'+slug(t); while(ids.has(id)) id+='2'; ids.add(id);
    ITENS4.push({id,t,cat,v:+v,h:+v>=50000?5:+v>=10000?4:+v>=3000?3:+v>=500?2:1,dur:I4F_DUR[f]||5,tal:cat==='Música'?'musical':undefined,sm:/livro|enciclop|ciências/i.test(t)?2:0,d:()=>i4(I4F[f](c,k||'#2A2238'))}); }); })();
