// Catálogo fictício: cada faixa tem títulos e atividades próprios.
const LIVROS_FAIXAS=[
 {min:4,max:7,n:'Gravuras, cores e primeiras palavras',tipo:'ilustrado',titulos:['As Cores do Meu Quintal','Bichinhos para Colorir','Meu Primeiro Livro de Figuras','A Festa das Formas','Palavras com a Vovó','O Ursinho e a Lua','Contando Estrelinhas','Onde Está o Gatinho?']},
 {min:8,max:11,n:'Aventuras e descobertas',titulos:['O Mistério da Casa na Árvore','A Turma do Rio Azul','Pequenos Exploradores do Espaço','O Atlas dos Bichos','O Dragão que Tinha Medo','Experiências no Quintal','O Mapa da Ilha Esquecida','A Biblioteca Secreta']},
 {min:12,max:17,n:'Literatura juvenil e conhecimento',titulos:['O Último Verão da Turma','Mensagens de Outro Planeta','Diário de uma Nova Escola','Ciência no Dia a Dia','A Cidade Além do Muro','Histórias que Mudaram o Mundo','Entre Amigos e Escolhas','O Enigma do Observatório']},
 {min:18,max:Infinity,n:'Romances, história e reflexão',titulos:['O Silêncio da Testemunha','Caminhos de uma Vida','Filosofia para Dias Comuns','Retratos da História do Brasil','O Peso das Escolhas','Economia da Vida Cotidiana','Cartas de uma Cidade Distante','A Memória das Marés']}
];
const LEITURA_LIMITE=6;
const livrosFaixa=()=>LIVROS_FAIXAS.find(f=>S.me.age>=f.min&&S.me.age<=f.max);
function leituraAno(){
 const m=S.me;
 if(!m.leitura||m.leitura.ano!==S.year) m.leitura={ano:S.year,titulos:[]};
 if(!Array.isArray(m.leitura.titulos)) m.leitura.titulos=[];
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
 st('smarts',R.int(1,3));st('happy',R.int(1,2));
 if(m.prison) m.prison.behav=clamp(m.prison.behav+3);
 return f.tipo==='ilustrado'?`Explorei “${titulo}” com ajuda de um responsável: figuras, cores e primeiras palavras. (${l.titulos.length}/${LEITURA_LIMITE} neste ano)`:`Li “${titulo}”. (${l.titulos.length}/${LEITURA_LIMITE} neste ano)`;
}
V.biblioteca=()=>{
 const f=livrosFaixa(),l=leituraAno();
 return {title:'Biblioteca',items:[{html:`<div class="card"><p>${f?esc(f.n):'Disponível a partir dos 4 anos.'}</p><p>${l.titulos.length} de ${LEITURA_LIMITE} livros neste ano. Cada título conta uma vez; o limite renova ao envelhecer.</p></div>`},...(f?f.titulos.map(t=>({ic:'📖',l:t,s:l.titulos.includes(t)?'Concluído neste ano':f.tipo==='ilustrado'?'Atividade acompanhada por um responsável':'Disponível para sua idade',dis:l.titulos.includes(t)||l.titulos.length>=LEITURA_LIMITE,why:'Escolha outro título ou aguarde o próximo ano.',on:()=>act(()=>body('lib',t),'Biblioteca')})):[])]};
};
V.mind=(o=>()=>{const r=o(),b=r.items.find(x=>x.l==='Biblioteca');if(b){b.on=()=>UI.push(V.biblioteca);b.s='Títulos por idade · até 6 por ano';}return r;})(V.mind);
