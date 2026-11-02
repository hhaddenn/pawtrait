# 🐾 Pawtrait

Upload a photo and watch a cat draw it in graphite, ink, watercolor and more.
Everything runs in your browser, so your photos never leave your device.

> 🚧 **Work in progress.** A live demo is coming soon.

## Features (planned)

- Upload a photo with a button or by drag and drop
- Several drawing styles: graphite, ink, watercolor, halftone, mosaic and cartoon
- Real stroke-by-stroke drawing: each style turns the photo into strokes, dots or brush marks
- A drawing animation where a cat's paw follows every stroke as it's drawn
- Download the result as a PNG, even before the animation ends
- Mobile-first layout with light and dark themes

## Tech stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) on top of [Radix UI](https://www.radix-ui.com/)
- [Lucide](https://lucide.dev/) icons

No image-processing libraries: the photo analysis (greyscale, blur, edge detection) and every drawing style are implemented by hand on raw pixel data.

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
