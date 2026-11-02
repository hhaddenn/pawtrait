# Pawtrait — Roadmap

Legenda: ⬜ por fazer · 🟡 em curso · ✅ concluído

**Estado atual:** Capítulo 1 — Setup 🟡

---

## Fase A — Primeiro protótipo testável

### 🟡 Capítulo 1 — Setup

- [x] Projeto Vite + React + JavaScript criado (com ESLint)
- [x] Prettier configurado (tabs de 4, aspas duplas), scripts `format` e `format:check`, formatar ao guardar
- [x] Tailwind CSS configurado
- [x] Alias `@/` → `src/` (`jsconfig.json` + `vite.config.js`)
- [x] shadcn/ui inicializado (`components.json`)
- [x] Componente `Button` adicionado e visível no ecrã
- [x] Estrutura de pastas: `src/components`, `src/lib` criadas; `filters`, `hooks` e `workers` criadas quando forem precisas
- [x] `.gitignore` revisto (`node_modules`, `dist`, `.env*`, `.wrangler`, ficheiros do SO e do editor)
- [x] `README.md` inicial em inglês (nome, descrição numa frase, stack, como correr localmente, aviso "work in progress")
- [x] `LICENSE` escolhida (ex.: MIT)
- [ ] Primeiro commit

### ⬜ Capítulo 2 — Upload

- [ ] `ImageUploader` com botão (input `file` acessível, com label)
- [ ] Drag-and-drop com feedback visual
- [ ] Validação do tipo de ficheiro (`image/*`)
- [ ] `File` guardado em estado no `App`

### ⬜ Capítulo 3 — Do ficheiro ao canvas

- [ ] `lib/image.js`: `createImageBitmap(file, { imageOrientation: 'from-image' })`
- [ ] Redução para no máximo ~1000 px de largura
- [ ] Obter `ImageData` a partir de um canvas
- [ ] Mostrar a imagem original num `<canvas>`

### ⬜ Capítulo 4 — Filtro Lápis 🎯 _ponto de teste_

- [ ] `filters/types.js` com o tipo `Filter` em JSDoc (`@typedef`)
- [ ] `lib/pixels.js`: grayscale, invert, blur
- [ ] `filters/pencil.js`: cinzentos → inverter → desfoque → color dodge
- [ ] Resultado desenhado no canvas

---

## Fase B — A experiência do gato

### ⬜ Capítulo 5 — Animação de revelação

- [ ] `lib/reveal.js`: ordem de revelação (linhas/traços)
- [ ] Loop com `requestAnimationFrame` e limpeza no unmount
- [ ] Botões Repetir e Saltar para o fim

### ⬜ Capítulo 6 — O gato e a pata

- [ ] `CatPaw.jsx` em SVG
- [ ] A pata segue a posição de desenho atual
- [ ] Coordenadas certas quando o canvas é redimensionado por CSS

### ⬜ Capítulo 7 — Descarregar PNG

- [ ] `lib/download.js` com `canvas.toBlob`
- [ ] Botão de descarregar

---

## Fase C — Robustez e mais estilos

### ⬜ Capítulo 8 — Web Worker

- [ ] Medir: o filtro bloqueia a interface?
- [ ] `workers/filter.worker.js`
- [ ] `hooks/useFilterWorker.js` (transferir o buffer, estado a carregar)

### ⬜ Capítulo 9 — Mais estilos

- [ ] `filters/index.js` — registo dos estilos
- [ ] `StylePicker` (shadcn)
- [ ] Tinta (Sobel + limiar)
- [ ] Cartoon (posterize + contornos)
- [ ] Mosaico
- [ ] Pontilhado (halftone)

---

## Fase D — Polimento e publicação

### ⬜ Capítulo 10 — Polimento

- [ ] Layout mobile-first e responsivo
- [ ] Tema claro/escuro + `ThemeToggle`
- [ ] Foco visível e labels em todos os controlos
- [ ] `useReducedMotion` → saltar a animação

### ⬜ Capítulo 11 — README e deploy

- [ ] README final em inglês (descrição, espaço para GIF, correr localmente, deploy, explicação dos filtros, link para a demo)
- [ ] Descrição, topics e link da demo no GitHub
- [ ] Confirmar que não há segredos nem ficheiros pessoais no histórico
- [ ] Deploy no Cloudflare Pages (`npm run build` → `dist`)

---

## Fase E — Adicionar ao meu portfolio

### ⬜ Capítulo 12 — Mostrar o projeto

- [ ] GIF curto da animação do gato e 1–2 screenshots (claro/escuro, mobile)
- [ ] Texto de apresentação: o problema, o que a app faz e o que aprendi (filtros à mão, Web Worker, animação com `requestAnimationFrame`)
- [ ] Entrada do Pawtrait no site de portfolio ([hugo-hadden.com](https://hugo-hadden.com)), no mesmo formato dos outros projetos, com stack, link para a demo e link para o repositório
- [ ] Repositório fixado (pinned) no perfil do GitHub
- [ ] (Opcional) Publicação no LinkedIn com o GIF e os links

---

## Notas e decisões

- **JavaScript** em vez de TypeScript, por ser a linguagem mais familiar. Os tipos importantes (ex.: `Filter`) são documentados com JSDoc para o editor ajudar.
- **ESLint** em vez de Oxlint: mais maduro, e o plugin `react-hooks` apanha erros nos efeitos da animação.
- **shadcn/ui** com estilo **Maia** (arredondado, espaçamento generoso, bom para toque) sobre **Radix UI**; ícones **Lucide**.
- **Interface em inglês** (textos, `lang="en"`), coerente com o README e com um portfolio público.
- **Prettier** trata da formatação (tabs com largura 4, aspas duplas) e o **ESLint** trata da qualidade do código. Cada ferramenta tem o seu papel.
- Os filtros são funções puras `(ImageData) => ImageData`, o que os deixa prontos para o Worker sem os reescrever.
- Não se usam bibliotecas de processamento de imagem.
