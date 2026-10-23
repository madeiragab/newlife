# NewLife no Roblox

A versão Roblox usa o mesmo jogo de `src/`: um conversor lê os eventos do jogo, traduz as condições para Luau e tira o que é proibido no Roblox. Depois disso, um motor em Luau roda a vida no servidor. Cada push na `main` que passa nos testes publica uma versão nova no Roblox, do mesmo jeito que o site.

## O que já tem (fase 1)

- Nascimento com família, país, cidade e classe social, usando os mesmos bancos de nomes do jogo.
- Passar de ano com atributos, escola, faculdade, família envelhecendo, mortes e heranças.
- Os eventos da vida comum de `src/`, com as escolhas, chances e efeitos do formato compacto (`pack`).
- Atividades: estudar, ler, academia, meditar, fazer amizades, passar tempo com alguém, namorar, noivar, casar, divórcio, sair de casa, adotar, empregos simples e aposentadoria.
- Política por fora das urnas (`Politica.luau`, igual a `src/golpe.js` e `src/ajustes_209/210/210b.js`): movimento clandestino, a noite do golpe em três decisões, o primeiro decreto com cinco caminhos (ditadura militar, monarquia, revolução popular, teocracia e transição), as ações do regime, refundar o país, revoltas, contragolpes, atentados, eleição livre e herdeiro. Quem perde pode ir para a prisão.
- Save automático no DataStore e lista das últimas vidas.
- Interface igual à da web: tema, telas em lista, pop-ups dos eventos, tela inicial e lápide. No celular fica em pé como na web; no PC usa a largura toda (atributos à esquerda, diário no meio e a tela aberta à direita).
- Rostos idênticos aos da web: `FaceSvg.luau` monta o mesmo SVG de `src/faces.js` e `Svg.luau` desenha pixel a pixel num EditableImage. Bandeiras e ícones usam o mesmo desenhista.
- Sons iguais aos da web: `tools/sons.cjs` roda o sintetizador de `src/sound.js` fora do navegador e grava `audio/efeitos.ogg` e `audio/musica.ogg`; `tools/enviar-sons.cjs` envia os dois ao Roblox e grava os IDs em `Sons.luau`.

Os modos fictícios, as carreiras de verdade, as eleições comuns, as empresas, a prisão, as doenças e os minigames ainda não chegaram (a prisão já chegou: `Prisao.luau`, com pena, vida na cadeia e fuga em três decisões). O conversor mostra em `roblox/conversao.txt` quantos eventos ficaram de fora e por quê.

## O que fica de fora só no Roblox

As regras do Roblox proíbem conteúdo sexual, drogas, tabaco, apostas, suicídio e assassinato. Bebida alcoólica também fica de fora, para a classificação não subir por álcool. A lista fica em [`tools/cortes.cjs`](tools/cortes.cjs): qualquer evento cujo título, texto ou escolha tenha uma dessas palavras (ou use um efeito proibido, como `kill`) não entra na versão Roblox. A gravidez também não existe lá: filhos chegam só por adoção. O jogo do site e dos apps continua igual.

## Estrutura

| Caminho | O que é |
|---|---|
| `tools/extract.cjs` | Conversor: carrega `src/` no Node e grava `src/shared/NewLife/Data/` (gerado, fora do git) |
| `tools/cortes.cjs` | Palavras e efeitos cortados no Roblox |
| `src/shared/NewLife/` | Motor em Luau: `Engine`, `Dsl` (escolhas dos eventos), `Actions`, `View`, `Util` |
| `src/server/` | Servidor: uma vida por jogador, `RemoteFunction` e DataStore |
| `src/client/` | Interface |
| `tests/` | Testes com o Lune: sintaxe de todos os scripts e centenas de vidas simuladas |
| `default.project.json` | Projeto do Rojo |

## Rodar no computador

Precisa de Node 22+ e do [Rokit](https://github.com/rojo-rbx/rokit), que instala o Rojo e o Lune nas versões de `rokit.toml`.

```bash
cd roblox/tools && npm install && node extract.cjs
```

```bash
cd roblox && rokit install && lune run tests/vidas.luau 300
```

```bash
cd roblox && rojo build -o newlife.rbxl
```

Abra o `newlife.rbxl` no Roblox Studio e aperte Play. Para editar com o Studio aberto, use `rojo serve` com o plugin do Rojo.

No Studio, o save só funciona com **Game Settings → Security → Enable Studio Access to API Services** ligado. Sem isso o jogo roda normal, só não salva.

Os rostos precisam de **Game Settings → Security → Allow Mesh & Image APIs** (Permitir APIs de malha e imagem) ligado, e o dono da experiência precisa ter a idade e o documento verificados no Roblox. Sem isso, os rostos aparecem como círculos coloridos.

Para editar com o Studio aberto e ver as mudanças na hora, use `rojo serve` e o plugin do Rojo (`rojo plugin install`). Para testar o layout de celular no Studio, rode na barra de comandos `workspace:SetAttribute("NewLifeCelular", true)`.

## Publicação automática (fazer uma vez)

1. Crie a experiência no Roblox (Studio → File → Publish to Roblox) e anote os dois números da página dela no [Creator Hub](https://create.roblox.com/dashboard/creations):
   - **Universe ID**: o número no endereço da experiência.
   - **Place ID**: o número do lugar inicial (em Places).
2. Ainda no Creator Hub, preencha o questionário de **Maturity & Compliance** da experiência com sinceridade (a versão Roblox tem álcool só para adultos, violência leve e namoro).
3. Em [Creator Hub → Open Cloud → API Keys](https://create.roblox.com/dashboard/credentials), crie uma chave com a permissão **universe-places → write** para essa experiência. Em *Accepted IP Addresses*, coloque `0.0.0.0/0`, porque as máquinas do GitHub mudam de IP.
4. No GitHub, em **Settings → Secrets and variables → Actions**:
   - em *Secrets*, crie `ROBLOX_API_KEY` com a chave;
   - em *Variables*, crie `ROBLOX_UNIVERSE_ID` e `ROBLOX_PLACE_ID`.

Pronto: o workflow [`roblox.yml`](../.github/workflows/roblox.yml) roda depois do workflow de testes e, se tudo passar, publica. Sem as chaves, ele testa e monta o arquivo, mas pula a publicação (o `.rbxl` fica nos artefatos da execução).
