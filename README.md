# 🐾 Pawtrait

Upload a photo and watch a cat sketch it in pencil, ink, cartoon and more.
Everything runs in your browser, so your photos never leave your device.

> 🚧 **Work in progress.** A live demo is coming soon.

## Features (planned)

- Upload a photo with a button or by drag and drop
- Several hand-written drawing styles: pencil, ink, cartoon, mosaic and halftone
- A drawing animation where a cat's paw sketches the result across the screen
- Download the result as a PNG
- Mobile-first layout with light and dark themes

## Tech stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) on top of [Radix UI](https://www.radix-ui.com/)
- [Lucide](https://lucide.dev/) icons

No image-processing libraries: every filter is implemented by hand on raw pixel data.

## Getting started

Requires [Node.js](https://nodejs.org/) 22.13 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

### Scripts

| Command                | What it does                               |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the development server               |
| `npm run build`        | Build for production into `dist/`          |
| `npm run preview`      | Serve the production build locally         |
| `npm run lint`         | Check the code with ESLint                 |
| `npm run format`       | Format all files with Prettier             |
| `npm run format:check` | Check formatting without changing anything |

## License

[MIT](LICENSE)
