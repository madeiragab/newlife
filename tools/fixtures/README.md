`save-1.46.json` é um caso sintético criado executando `app.html` do commit
`0ee5c98` da branch `gh-pages` (versão 1.46), anterior ao motor macroeconômico.
Não contém dados de jogadores.

Na versão antiga, foi criada uma vida brasileira, com personagem adulto,
caixa de $2 milhões e emprego. Pelas funções do próprio jogo foram comprados
uma casa financiada e um carro, e aberta a primeira empresa do catálogo.
O estado foi serializado antes de carregar qualquer código econômico novo.

O runner injeta esse JSON no navegador de teste. A regressão verifica valores,
contrato legado, migração idempotente, troca de país, país de origem dos bens,
conversão da empresa e financiamento novo com taxa contratada.


As fixtures 1.59 e 1.60 foram geradas executando os HTMLs publicados originais, com emprego, empresa, casa financiada, cônjuge e filho. Os arquivos origem-*.json registram o carimbo e o SHA-256 de cada HTML. Os testes verificam migração idempotente, patrimônio, contratos e pessoas.

As fixtures 1.18, 1.35, 1.50 e 1.57 foram geradas executando o `app.html` publicado de cada versão: emprego, casa financiada, carro, empresa, mudança para Portugal com uma casa lá, cônjuge e namoro ao mesmo tempo, filhos adultos e duas sucessões até a terceira geração. Todas as fixtures `save-*.json` passam pelo teste de migração entre versões: migração idempotente, dinheiro, bens, pessoas e relacionamentos preservados, e três anos de vida com `ageUp()` real depois de carregar.
