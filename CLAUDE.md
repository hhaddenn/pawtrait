# Pawtrait — instruções para o Claude

Pawtrait é uma web app de portfolio: a pessoa carrega uma foto e um gato "desenha-a" em vários estilos, com uma animação em que uma pata segue cada traço. Tudo corre no browser, sem backend: as fotos nunca saem do dispositivo.

- **Progresso e próximos passos:** [ROADMAP.md](ROADMAP.md) é a fonte de verdade. Lê-o no início de cada sessão e mantém-no atualizado (marcar `[x]`, mover o "Estado atual", dividir tarefas grandes em `a`/`b`/`c`).
- **Decisões de arquitetura e o porquê:** secção "Notas e decisões" do roadmap.

## Como trabalhar com o Hugo (método de ensino)

O Hugo escreve o código; o Claude ensina. Comunica sempre em **português de Portugal**.

1. **Uma tarefa de cada vez.** Nunca enviar várias tarefas juntas. Só passar à seguinte depois de rever a anterior e de o Hugo fazer commit.
2. **Cada tarefa segue o formato do tutorial do Odoo**, por esta ordem:
    - **👀 Como vai ficar**: o resultado final primeiro (o que aparece no ecrã, a estrutura de ficheiros, mockups ASCII).
    - **📘 Exemplo**: código que ensina o conceito, **análogo mas não igual** à solução, com tabelas "Conceito | Explicação" e links para MDN/React/etc.
    - **🏋️ Exercício**: tabela com os TODOs por ficheiro, ordem sugerida, como testar e uma ❓ pergunta para pensar.
3. **Os TODOs vão escritos nos ficheiros** junto com a explicação, sem esperar que o Hugo peça: código existente mantido, partes novas como comentários `// TODO n: o quê e porquê`. Constantes novas já declaradas no topo, com comentário. Depois correr `prettier --write` + `npm run lint` e dizer quantos erros do lint são "esperados até acabar os TODOs".
4. **Revisões:** ler os ficheiros, correr `npm run lint`, `npx prettier --list-different .` e `npm run build`. Responder com ✅ (bem) / ❌ (erro, com o porquê e uma tabela/exemplo numérico) / 🟡 ou 💬 (retoque opcional). Dizer **o que** corrigir e dar pistas, sem colar a solução completa. Quando o Hugo está preso no mesmo ponto várias vezes, mostrar a diferença exata (antes/depois).
5. **Quando o Hugo pede explicitamente** ("faz tu", "faz por mim"), o Claude faz essa alteração concreta e explica o que mudou. Não estender isso à tarefa seguinte. Configuração de ferramentas (Prettier, ESLint, `.gitattributes`…) e documentação (README) costumam ser feitas pelo Claude quando pedido.
6. **Git: só comandos de leitura** (`status`, `log`, `diff`, `show`, `check-ignore`). Nunca `add`, `commit`, `checkout`, `restore`, `push`… O Hugo faz os commits; o Claude sugere a mensagem (_Conventional Commits_: `feat`, `fix`, `chore`, `docs`, `refactor`, em inglês, imperativo) e verifica o commit depois.
7. **Antes de propor um componente de UI, verificar o catálogo do shadcn/ui** (https://ui.shadcn.com/docs/components) e reutilizar/compor (já usados: `Button`, `Empty`, `Attachment`, `Alert`). Depois de cada `npx shadcn add`: `npm run format` e apagar o `import * as React` não usado.

### Pontos a verificar com atenção nas revisões

Erros que já apareceram neste projeto e costumam repetir-se:

- `%` (resto) usado em vez de `/` (divisão).
- _Off-by-one_: `<=` vs `<` nos ciclos (`x < width`), `+ 1` a mais nos limites de vizinhança.
- `random` (o gerador, para passar ao `randomBetween`) vs `random()` (um número).
- Forma errada dos objetos das marcas (`DotMark` tem `x`, `y`, `radius`; `LineMark` tem `points`, `width`); `{ endPoint }` em vez de `endPoint`.
- Refs: falta do `.current`; ler refs durante o render (usar estado).
- `setState` lido logo a seguir (estado "atrasado": usar a variável local).
- `const` vs `let` (arrays/objetos que só mudam por dentro são `const`).
- Funções em vez de valores (`createRandom` vs `randomBetween`, somar um array inteiro em vez de `array[index]`).
- Índices: `ImageData` usa `(y × width + x) × 4`; os `Float32Array` do Sobel usam `y × width + x` (sem `× 4`).
- Imports com caminho relativo em vez do alias `@/`.
- Comentários de TODO esquecidos; ficheiros não guardados no VS Code.
- Erros dentro do `try` do `PhotoDrawing` aparecem como "The file may be damaged": suspeitar de um bug de código quando a foto é boa.

## Stack e comandos

- Vite + React 19 + **JavaScript** (não TypeScript; tipos documentados com JSDoc `@typedef`), Tailwind CSS 4, shadcn/ui (estilo **Maia**, base **Radix UI**, ícones **Lucide**).
- Deploy previsto: Cloudflare Pages (`npm run build` → `dist/`).
- `npm run dev` · `npm run build` · `npm run lint` · `npm run format` · `npm run format:check`

## Convenções de código

- **Prettier:** tabs com largura 4, aspas duplas. `LF` em todos os ficheiros (`.gitattributes`, `.editorconfig`).
- **ESLint** (não Oxlint). Regra `react-refresh/only-export-components` desligada só em `src/components/ui/**`.
- Imports sempre com o alias `@/` → `src/`.
- _camelCase_ para variáveis; constantes de configuração em `UPPER_SNAKE_CASE` no topo do ficheiro, com comentário a explicar o efeito ("botões" do estilo).
- JSDoc em todas as funções exportadas. Comentários e textos da interface em **inglês** (a versão PT da interface está planeada no Capítulo 11).
- Sem bibliotecas de processamento de imagem: toda a análise e todos os estilos são escritos à mão.

## Arquitetura

```
File ─► loadImageData (lib/image.js) ─► ImageData ─► style (styles/*.js) ─► { base, marks } ─► DrawingCanvas
        └──────────────────────────── PhotoDrawing.jsx (async, ignore/cleanup, erros) ───────────────────────┘
```

- **Desenho por marcas:** um estilo é uma função **pura** `(ImageData) => { base?, marks }`. `base` é um `ImageData` opcional desenhado por baixo (ex.: grão do papel); `marks` é a lista **ordenada** de marcas (a ordem importa para a animação do Capítulo 5: contornos primeiro, depois tracejado, depois tracejado cruzado).
- **Aleatoriedade sempre com semente** (`lib/random.js`): nunca `Math.random()` nos estilos. A semente vem da foto (`seedFrom`), por isso a mesma foto dá sempre o mesmo desenho. Mudar a quantidade de chamadas a `random()` muda o desenho todo; coisas que gastam muitos números (o papel) geram-se no fim.
- Estilos, ajudantes privados e constantes vivem no ficheiro do estilo; só passam para `lib/` quando outro estilo precisar deles.

### Ficheiros

| Ficheiro                           | Papel                                                                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/App.jsx`                      | Estado `photo`, `ImageUploader`, `Attachment` com o ficheiro, `<PhotoDrawing file={photo} style={pencil} />`                                 |
| `src/components/ImageUploader.jsx` | `Empty` do shadcn + botão + input escondido + drag-and-drop; `selectFile` é a porta única com validação                                      |
| `src/components/PhotoDrawing.jsx`  | Carrega os píxeis, corre o estilo, guarda `{ width, height, marks, base }` em estado; padrão `ignore` + cleanup; `Alert` de erro             |
| `src/components/DrawingCanvas.jsx` | Só desenha: papel (cor ou `base`) + `drawMarks`                                                                                              |
| `src/components/PhotoCanvas.jsx`   | Já não é usado; decidir no Capítulo 5 (mostrar a foto original por baixo?) ou apagar                                                         |
| `src/lib/image.js`                 | `validateImageFile`, `fitToWidth`, `loadBitmap` (EXIF), `loadImageData` (`OffscreenCanvas`), `MAX_WIDTH = 1000`                              |
| `src/lib/pixels.js`                | Análise: `invert`, `grayscale` (BT.601), `blur` (caixa), `sobel` (→ `magnitude`, `angle` em `Float32Array`), `clamp`                         |
| `src/lib/marks.js`                 | Tipos `DotMark`, `LineMark`, `Mark` (JSDoc) e o renderizador `drawMarks` (`switch` por tipo, erro em tipos desconhecidos)                    |
| `src/lib/random.js`                | `createRandom(seed)` (LCG, _closure_) e `randomBetween(random, min, max)`                                                                    |
| `src/lib/paper.js`                 | `PAPER_COLOR` e `paperTexture` (em curso na 4.7c)                                                                                            |
| `src/styles/pencil.js`             | Grafite: contornos (Sobel) → tracejado que segue o fluxo (Sobel muito desfocado) → tracejado cruzado nas sombras; `handDrawnPoints` (tremor) |

## Onde parámos

**Tarefa 4.7c — grão do papel** (ver o roadmap). Os TODOs 1–15 estão escritos em `src/lib/paper.js`, `src/components/DrawingCanvas.jsx`, `src/components/PhotoDrawing.jsx` e `src/styles/pencil.js`, e a explicação já foi dada. Próximo passo: rever o que o Hugo fez nesses TODOs (`grep -rn TODO src`), depois commit (`feat: add paper grain to the pencil style`) e seguir para a 4.8 (`styles/index.js` + tipo `Style` em JSDoc).

Perguntas que ficaram por responder e podem ser retomadas: a da 4.7c (porque é que o papel tem de ser gerado depois dos riscos).
