# Pawtrait — Roadmap

Legenda: ⬜ por fazer · 🟡 em curso · ✅ concluído

**Estado atual:** Capítulo 4 — Grafite por traços 🟡

---

## Fase A — Primeiro protótipo testável

### ✅ Capítulo 1 — Setup

- [x] Projeto Vite + React + JavaScript criado (com ESLint)
- [x] Prettier configurado (tabs de 4, aspas duplas), scripts `format` e `format:check`, formatar ao guardar
- [x] Tailwind CSS configurado
- [x] Alias `@/` → `src/` (`jsconfig.json` + `vite.config.js`)
- [x] shadcn/ui inicializado (`components.json`)
- [x] Componente `Button` adicionado e visível no ecrã
- [x] Estrutura de pastas: `src/components`, `src/lib` criadas; `styles`, `hooks` e `workers` criadas quando forem precisas
- [x] `.gitignore` revisto (`node_modules`, `dist`, `.env*`, `.wrangler`, ficheiros do SO e do editor)
- [x] `README.md` inicial em inglês (nome, descrição numa frase, stack, como correr localmente, aviso "work in progress")
- [x] `LICENSE` escolhida (ex.: MIT)
- [x] Primeiro commit

### ✅ Capítulo 2 — Upload

- [x] `ImageUploader` com botão (input `file` acessível, com label)
- [x] Drag-and-drop com feedback visual
- [x] Validação do tipo (JPEG, PNG, WebP, GIF, AVIF) e do tamanho (máx. 25 MB) em `lib/image.js`, com `Alert`
- [x] `File` guardado em estado no `App`

### ✅ Capítulo 3 — Do ficheiro ao canvas

- [x] `lib/image.js`: `createImageBitmap(file, { imageOrientation: 'from-image' })`
- [x] Redução para no máximo ~1000 px de largura
- [x] Obter `ImageData` a partir de um canvas e aplicar um filtro (teste com `invert` em `lib/pixels.js`)
- [x] Mostrar a imagem original num `<canvas>` (`PhotoCanvas`)

### 🟡 Capítulo 4 — Grafite por traços 🎯 _ponto de teste_

Cada estilo analisa a foto e devolve uma **lista de marcas** (traços, pontos, pinceladas…) que um renderizador comum desenha. Ver "Arquitetura dos estilos" nas notas.

- [x] 4.1 `lib/pixels.js`: `grayscale` (luminância ponderada) — análise
- [x] 4.2 `lib/pixels.js`: `blur` (desfoque de caixa) — suaviza os tons antes de decidir onde riscar
- [x] 4.3 `lib/marks.js`: tipos de marca em JSDoc (`@typedef`) + `drawMarks(ctx, marks)`; `DrawingCanvas` desenha marcas de teste numa "folha" branca
- [x] 4.4 `lib/random.js`: números pseudoaleatórios com semente (a mesma foto dá sempre o mesmo desenho)
- [ ] 4.5 Primeiro lápis: tracejado diagonal mais denso nas zonas escuras → primeiro esboço visível
- [ ] 4.6 `lib/pixels.js`: gradientes (Sobel) → os traços seguem a direção dos contornos + traços de contorno
- [ ] 4.7 Aspeto de grafite: espessura e opacidade variáveis, tremor da mão, tracejado cruzado nas sombras, grão do papel
- [ ] 4.8 `styles/pencil.js` + `styles/index.js` (registo dos estilos) + tipo `Style` em JSDoc

---

## Fase B — A experiência do gato

### ⬜ Capítulo 5 — Animação do desenho

- [ ] Ordem das marcas: contornos primeiro, depois sombras; marcas vizinhas seguidas (a pata não salta pelo ecrã)
- [ ] Loop com `requestAnimationFrame`: algumas marcas por frame, com orçamento de tempo, e limpeza no unmount
- [ ] Progresso da animação (para o Capítulo 6 e para o download)
- [ ] Botões Repetir e Saltar para o fim

### ⬜ Capítulo 6 — O gato e a pata

- [ ] `CatPaw.jsx` em SVG
- [ ] A pata segue o traço que está a ser desenhado (ponto ao longo da marca atual)
- [ ] Coordenadas certas quando o canvas é redimensionado por CSS (píxeis do canvas → píxeis do ecrã)

### ⬜ Capítulo 7 — Descarregar o desenho

- [ ] `lib/download.js`: desenhar todas as marcas num canvas fora do ecrã → `canvas.toBlob` → ficheiro PNG
- [ ] Botão de descarregar, ativo só quando as marcas estão prontas
- [ ] Nome do ficheiro com o nome da foto e o estilo (ex.: `my-cat-pencil.png`)
- [ ] Descarregar o resultado final mesmo que a animação ainda esteja a meio

---

## Fase C — Robustez e mais estilos

### ⬜ Capítulo 8 — Web Worker

- [ ] Medir: a geração das marcas bloqueia a interface?
- [ ] `workers/style.worker.js`: recebe o `ImageData` (buffer transferido) e devolve as marcas
- [ ] `hooks/useStyleWorker.js` (pedido, estado "a preparar o desenho", respostas desatualizadas ignoradas)

### ⬜ Capítulo 9 — Mais estilos (todos como geradores de marcas)

- [ ] `StylePicker` (shadcn)
- [ ] Tinta: linhas de contorno (Sobel) com espessura variável, como uma caneta
- [ ] Aguarela: pinceladas semitransparentes, das grandes para as pequenas, com a cor média de cada zona
- [ ] Pontilhado (halftone): pontos numa grelha, raio conforme a escuridão
- [ ] Mosaico: peças (quadrados) com a cor média de cada zona
- [ ] Cartoon: camada base posterizada + contornos como traços
- [ ] (Opcional) "Original": a foto sem estilo, para comparar

---

## Fase D — Polimento e publicação

### ⬜ Capítulo 10 — Polimento

- [ ] Layout mobile-first e responsivo
- [ ] Tema claro/escuro + `ThemeToggle`
- [ ] Foco visível e labels em todos os controlos
- [ ] `useReducedMotion` → saltar a animação

### ⬜ Capítulo 11 — Versão em português (EN/PT)

- [ ] Textos da interface num dicionário por idioma (`src/i18n/en.js`, `src/i18n/pt.js`), sem biblioteca
- [ ] Contexto/hook `useTranslation` para ler os textos nos componentes
- [ ] Seletor de idioma (shadcn) e idioma inicial a partir do browser (`navigator.language`)
- [ ] Escolha guardada no `localStorage`
- [ ] Atualizar `<html lang>` quando o idioma muda
- [ ] Mensagens de erro (`validateImageFile`) e nomes dos estilos também traduzidos
- [ ] (Opcional) `README.pt.md` com link no README em inglês

### ⬜ Capítulo 12 — README e deploy

- [ ] README final em inglês (descrição, espaço para GIF, correr localmente, deploy, explicação de como cada estilo gera as marcas, link para a demo)
- [ ] Descrição, topics e link da demo no GitHub
- [ ] Confirmar que não há segredos nem ficheiros pessoais no histórico
- [ ] Deploy no Cloudflare Pages (`npm run build` → `dist`)

---

## Fase E — Adicionar ao meu portfolio

### ⬜ Capítulo 13 — Mostrar o projeto

- [ ] GIF curto da animação do gato e 1–2 screenshots (claro/escuro, mobile)
- [ ] Texto de apresentação: o problema, o que a app faz e o que aprendi (desenho por marcas, análise de imagem à mão, Web Worker, animação com `requestAnimationFrame`)
- [ ] Entrada do Pawtrait no site de portfolio ([hugo-hadden.com](https://hugo-hadden.com)), no mesmo formato dos outros projetos, com stack, link para a demo e link para o repositório
- [ ] Repositório fixado (pinned) no perfil do GitHub
- [ ] (Opcional) Publicação no LinkedIn com o GIF e os links

---

## Notas e decisões

- **JavaScript** em vez de TypeScript, por ser a linguagem mais familiar. Os tipos importantes (ex.: `Mark`, `Style`) são documentados com JSDoc para o editor ajudar.
- **ESLint** em vez de Oxlint: mais maduro, e o plugin `react-hooks` apanha erros nos efeitos da animação.
- **shadcn/ui** com estilo **Maia** (arredondado, espaçamento generoso, bom para toque) sobre **Radix UI**; ícones **Lucide**.
- **Interface em inglês** por omissão (textos, `lang="en"`), coerente com o README e com um portfolio público, com **versão em português** no Capítulo 11. Até lá, os textos ficam em inglês diretamente no JSX.
- **Prettier** trata da formatação (tabs com largura 4, aspas duplas) e o **ESLint** trata da qualidade do código. Cada ferramenta tem o seu papel.
- **Arquitetura dos estilos: desenho por marcas** (decidido no Capítulo 4, em vez de filtros `(ImageData) => ImageData`).
    - Um estilo é uma função pura `(ImageData) => { base, marks }`: `base` é uma camada de fundo opcional (ex.: grão do papel, cores do cartoon) e `marks` é a lista ordenada de marcas (traços, pontos, pinceladas, peças).
    - `lib/pixels.js` passa a ser **análise** (cinzentos, desfoque, contornos), usada pelos estilos para decidir onde e como pôr cada marca.
    - Um renderizador comum (`lib/marks.js`) desenha as marcas no canvas.
    - **Porquê:** combina com todos os estilos planeados (o pontilhado e o mosaico já são listas de formas; a aguarela só convence com pinceladas) e permite à pata do gato seguir **o traço real** que está a ser desenhado, em vez de uma revelação fingida.
    - Aleatoriedade sempre **com semente** (`lib/random.js`), para os estilos continuarem puros: a mesma foto dá sempre o mesmo desenho.
    - Os estilos ficam em `src/styles/` (em vez de `src/filters/`), porque deixam de ser filtros de píxeis.
- Não se usam bibliotecas de processamento de imagem.
