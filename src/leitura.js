// Catálogo fictício: cada faixa tem títulos e atividades próprios.
const LIVROS_FAIXAS=[
 {min:4,max:7,n:'Gravuras, cores e primeiras palavras',tipo:'ilustrado',titulos:['As Cores do Meu Quintal','Bichinhos para Colorir','Meu Primeiro Livro de Figuras','A Festa das Formas','Palavras com a Vovó','O Ursinho e a Lua','Contando Estrelinhas','Onde Está o Gatinho?']},
 {min:8,max:11,n:'Aventuras e descobertas',titulos:['O Mistério da Casa na Árvore','A Turma do Rio Azul','Pequenos Exploradores do Espaço','O Atlas dos Bichos','O Dragão que Tinha Medo','Experiências no Quintal','O Mapa da Ilha Esquecida','A Biblioteca Secreta']},
 {min:12,max:17,n:'Literatura juvenil e conhecimento',titulos:['O Último Verão da Turma','Mensagens de Outro Planeta','Diário de uma Nova Escola','Ciência no Dia a Dia','A Cidade Além do Muro','Histórias que Mudaram o Mundo','Entre Amigos e Escolhas','O Enigma do Observatório']},
 {min:18,max:Infinity,n:'Romances, história e reflexão',titulos:['O Silêncio da Testemunha','Caminhos de uma Vida','Filosofia para Dias Comuns','Retratos da História do Brasil','O Peso das Escolhas','Economia da Vida Cotidiana','Cartas de uma Cidade Distante','A Memória das Marés']}
];
const LEITURA_LIMITE=6;
const leituraPorPonto=(inteligencia=S.me.smarts)=>inteligencia<70?3:inteligencia<90?6:12;
const livrosFaixa=()=>LIVROS_FAIXAS.find(f=>S.me.age>=f.min&&S.me.age<=f.max);
function leituraAno(){
 const m=S.me;
 if(!m.leitura||m.leitura.ano!==S.year) m.leitura={ano:S.year,titulos:[],ganho:0};
 if(!Array.isArray(m.leitura.titulos)) m.leitura.titulos=[];
 if(!Number.isFinite(m.leitura.ganho))m.leitura.ganho=Math.min(2,Math.floor(m.leitura.titulos.length/3));
 m.leituraProgresso=Math.max(0,Math.min(11,Math.floor(Number(m.leituraProgresso)||0)));
 return m.leitura;
}
function lerLivro(titulo){
 const m=S.me,f=livrosFaixa();
 if(!m.alive) return 'Esta vida já terminou.';
 if(!f) return 'A biblioteca infantil fica disponível a partir dos 4 anos.';
 if(titulo&&!f.titulos.includes(titulo)) return 'Esse título não faz parte do catálogo para minha idade.';
 const l=leituraAno();
 if(l.titulos.length>=LEITURA_LIMITE) return 'Já concluí meus seis livros deste ano. Posso escolher novos no próximo ano.';
 titulo=titulo||R.pick(f.titulos.filter(t=>!l.titulos.includes(t)));
 if(l.titulos.includes(titulo)) return 'Já concluí esse livro neste ano. Vou escolher outro título.';
 l.titulos.push(titulo); use('b_lib'); cnt('books');
 let ganho=0;
 const necessarios=leituraPorPonto(m.smarts);
 if(m.smarts>=100)m.leituraProgresso=0;
 else if(l.ganho<2){
  m.leituraProgresso++;
  if(m.leituraProgresso>=necessarios){m.leituraProgresso-=necessarios;l.ganho++;ganho=1;st('smarts',1);}
 }
 st('happy',1);
 const aprendizado=ganho?' Ganhei 1 ponto de inteligência.':' A leitura desenvolve meu aprendizado aos poucos.';
 if(m.prison) m.prison.behav=clamp(m.prison.behav+3);
 return f.tipo==='ilustrado'?`Explorei “${titulo}” com ajuda de um responsável: figuras, cores e primeiras palavras. (${l.titulos.length}/${LEITURA_LIMITE} neste ano)${aprendizado}`:`Li “${titulo}”. (${l.titulos.length}/${LEITURA_LIMITE} neste ano)${aprendizado}`;
}
V.biblioteca=()=>{
 const f=livrosFaixa(),l=leituraAno();
 return {title:'Biblioteca',items:[{html:`<div class="card"><p>${f?esc(f.n):'Disponível a partir dos 4 anos.'}</p><p>${l.titulos.length} de ${LEITURA_LIMITE} livros neste ano. Cada título conta uma vez; o limite renova ao envelhecer.</p>${kv('Inteligência por leitura neste ano',l.ganho+' de 2 pontos')}${S.me.smarts>=100?'<p>Minha inteligência já está no máximo.</p>':kv('Progresso para o próximo ponto',S.me.leituraProgresso+' de '+leituraPorPonto()+' livros')}<details><summary>Como funciona o aprendizado</summary><p>São necessários 3 livros por ponto abaixo de 70 de inteligência, 6 entre 70 e 89 e 12 a partir de 90. O progresso continua no próximo ano; o ganho é limitado a 2 pontos por ano.</p></details></div>`},...(f?f.titulos.map(t=>({ic:'📖',l:t,s:l.titulos.includes(t)?'Concluído neste ano':f.tipo==='ilustrado'?'Atividade acompanhada por um responsável':'Disponível para sua idade',dis:l.titulos.includes(t)||l.titulos.length>=LEITURA_LIMITE,why:'Escolha outro título ou aguarde o próximo ano.',on:()=>act(()=>body('lib',t),'Biblioteca')})):[])]};
};
V.mind=(o=>()=>{const r=o(),b=r.items.find(x=>x.l==='Biblioteca');if(b){b.on=()=>UI.push(V.biblioteca);b.s='Títulos por idade · até 6 por ano';}return r;})(V.mind);
