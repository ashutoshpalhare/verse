# AP VERSE

> **AP's Visual Universe**

A premium, cinematic personal portrait gallery — a private digital universe built to showcase portraits and selfies in a dark, immersive, futuristic interface.

---

## Live Demo

🌐 **GitHub Pages:** `https://ashutoshpalhare.github.io/verse/`

---

## ✨ Features

- **Automatic Local Image Discovery** — Drop photos into `public/images/` and the gallery auto-detects them. No manual arrays, no uploads.
- **Cinematic Full-Screen Viewer** — Click any portrait to open a responsive lightbox with original aspect ratio preserved, gesture/keyboard navigation, and persistent metadata.
- **Favorites & Search** — Curate a private favorites stream and search across titles/descriptions.
- **Masonry ↔ Grid Toggle** — Choose between a dynamic masonry waterfall or a clean uniform grid.
- **Multi-Theme Engine** — Switch between Cinematic, Midnight, Obsidian, Emerald, and Crimson visual themes.
- **Mobile-First Gestures** — Swipe to navigate/close, double-tap to favorite, built with `@use-gesture/react`.
- **Metadata Persistence** — Edited titles and descriptions are saved to `localStorage`.
- **About Page** — A dedicated creator profile page with social links.
- **GitHub Pages Ready** — Includes a static build config and GitHub Actions workflow for zero-config deployment.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev) |
| Router | [TanStack Router](https://tanstack.com/router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + OKLCH color tokens |
| UI Components | [shadcn/ui](https://ui.shadcn.com) |
| Animation | [Framer Motion](https://www.framer.com/motion/) + `@use-gesture/react` |
| State | [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware |
| Icons | [Lucide React](https://lucide.dev) + [Simple Icons](https://simpleicons.org) |
| Build Tool | [Vite 8](https://vitejs.dev) |
| Package Manager | [Bun](https://bun.sh) |

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/docs/installation) installed on your machine
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ashutoshpalhare/verse.git
cd verse
```

### 2. Install dependencies

```bash
bun install
```

### 3. Add your photos

Create the folder and place your portraits inside:

```bash
mkdir -p public/images
```

Drop your `.jpg`, `.jpeg`, `.png`, or `.webp` files into `public/images/`.

> **Tip:** Use meaningful filenames. The app auto-generates initial titles from them.

### 4. Run locally

```bash
bun dev
```

Open `http://localhost:8080` in your browser.

---

## 📸 How to Add Photos

AP VERSE uses **Vite's `import.meta.glob`** to automatically discover images at build time.

1. Copy your portrait images into `public/images/`.
2. Restart the dev server (or rebuild) so Vite picks up the new files.
3. The gallery will automatically display them with generated metadata.

### Supported formats

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

### Metadata editing

- Click any photo to open the viewer.
- Click the **Edit** icon to update the title and description.
- Changes are saved to your browser's `localStorage` and persist across sessions.

For more details, see [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md).

---

## 🌐 Deploy to GitHub Pages

This repository is pre-configured for static deployment via GitHub Pages.

### Manual build

```bash
bun run build:pages
```

This outputs a fully static site to `dist-pages/` with `index.html` at the root.

### Automated deployment via GitHub Actions

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to the `main` branch — the included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically.

The app is configured with `base: "/verse/"`, so it will be available at:

```
https://ashutoshpalhare.github.io/verse/
```

---

## 📁 Project Structure

```
ap-verse/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── pages/
│   └── index.html                 # Static HTML shell for Pages build
├── public/
│   ├── images/                    # Your gallery photos go here
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── gallery/               # PhotoCard, GalleryGrid, PhotoViewer, etc.
│   │   ├── layout/                # SplashScreen, headers, navigation
│   │   ├── theme/                 # ThemeProvider
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/
│   │   ├── image-discovery.ts     # Vite glob-based photo discovery
│   │   └── store/
│   │       ├── gallery-store.ts   # Zustand gallery + favorites state
│   │       └── theme-store.ts     # Zustand theme state
│   ├── routes/                    # TanStack Router file-based routes
│   │   ├── index.tsx              # Gallery home
│   │   ├── favorites.tsx          # Favorites stream
│   │   ├── about.tsx              # Creator profile
│   │   ├── settings.tsx           # Settings & themes
│   │   └── __root.tsx             # Root layout
│   ├── spa/
│   │   └── main.tsx               # Client-only entry for static build
│   ├── router.tsx                 # Router factory
│   ├── start.ts                   # TanStack Start SSR entry
│   ├── server.ts                  # Nitro server entry
│   └── styles.css                 # Global OKLCH theme tokens
├── vite.config.ts                 # Default TanStack Start config (SSR)
├── vite.pages.config.ts           # Static GitHub Pages config
├── package.json
├── README.md
└── ADMIN_GUIDE.md
```

---

## 🧰 Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start the Lovable/TanStack Start dev server |
| `bun run build` | Build the full TanStack Start production app |
| `bun run build:dev` | Build in development mode |
| `bun run build:pages` | Build static site for GitHub Pages (`dist-pages/`) |
| `bun preview` | Preview the default production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

---

## 🏗 Architecture Notes

- **Local-first gallery**: Photos live in `public/images/` and are discovered at build time via `import.meta.glob`. No backend database is required for basic usage.
- **Dual build system**:
  - Default `vite.config.ts` powers the Lovable preview with SSR/Nitro.
  - `vite.pages.config.ts` produces a pure static SPA for GitHub Pages.
- **State persistence**: Favorites and metadata edits are stored in `localStorage` because local image files cannot be modified by the browser.
- **Future-ready**: The store and discovery layer are designed to be swapped for a Supabase backend when needed.

---

## 🛣 Roadmap

- [ ] Admin authentication for photo management
- [ ] Backend integration (Supabase / Cloud)
- [ ] Drag-and-drop bulk import
- [ ] Export/import metadata
- [ ] PWA offline support

---

## 👤 Creator

**Ashutosh Palhare**

- GitHub: [@ashutoshpalhare](https://github.com/ashutoshpalhare)
- Project: [AP VERSE](https://github.com/ashutoshpalhare/verse)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>AP VERSE — AP's Visual Universe</strong><br/>
  <em>A private cinematic portrait sanctuary.</em>
</p>
