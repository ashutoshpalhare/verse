# AP VERSE

> **AP's Visual Universe**

AP VERSE is a private, cinematic visual archive for preserving and exploring portrait photography. It combines a dark, immersive interface with local image discovery, persistent metadata, favorites, searchable content, customizable visual themes, and an interactive photo viewer.

The application is designed around a **local-first architecture**: images are discovered from the project's `public/images/` directory, while user-managed metadata and favorites are persisted locally in the browser.

---

## Features

* **Local image discovery** — automatically discovers supported images from `public/images/`.
* **Cinematic gallery** — responsive masonry-style visual presentation for portraits.
* **Interactive photo viewer** — open individual portraits and navigate between images.
* **Search** — filter portraits by title and description.
* **Favorites** — maintain a private collection of favorite portraits.
* **Persistent metadata** — locally store customized portrait titles and descriptions.
* **Local-first storage** — favorites and metadata are persisted through browser storage.
* **Multiple visual themes** — Cinematic, Midnight, Obsidian, Emerald, and Crimson themes.
* **Responsive navigation** — dedicated bottom navigation for the application's primary sections.
* **Cinematic splash screen** — animated application initialization experience.
* **Framer Motion animations** — motion-based transitions and interface interactions.
* **Empty-state handling** — clear guidance when no portraits have been discovered.
* **About section** — dedicated creator/profile information and external social links.
* **Settings** — customize the application's visual experience.
* **Responsive UI** — designed for both desktop and mobile-oriented interaction.
* **Error handling utilities** — application-level error capture and error-page support.

---

## Tech Stack

| Technology                                                            | Purpose                                |
| --------------------------------------------------------------------- | -------------------------------------- |
| [TanStack Start](https://tanstack.com/start)                          | Full-stack React application framework |
| [React 19](https://react.dev/)                                        | UI library                             |
| [TypeScript](https://www.typescriptlang.org/)                         | Type-safe application development      |
| [Vite](https://vite.dev/)                                             | Development server and build tooling   |
| [Tailwind CSS](https://tailwindcss.com/)                              | Utility-first styling                  |
| [Zustand](https://zustand.docs.pmnd.rs/)                              | Client-side state management           |
| [Framer Motion](https://motion.dev/)                                  | Animations and transitions             |
| [TanStack Router](https://tanstack.com/router)                        | File-based application routing         |
| [Radix UI](https://www.radix-ui.com/)                                 | Accessible UI primitives               |
| [Lucide React](https://lucide.dev/)                                   | Interface icons                        |
| [React Hook Form](https://react-hook-form.com/)                       | Form handling                          |
| [Zod](https://zod.dev/)                                               | Schema validation                      |
| [react-masonry-css](https://github.com/paulcollett/react-masonry-css) | Masonry gallery layout                 |
| [Embla Carousel](https://www.embla-carousel.com/)                     | Carousel functionality                 |
| [Recharts](https://recharts.org/)                                     | Charting components                    |
| [Sonner](https://sonner.emilkowal.ski/)                               | Toast notifications                    |
| [React Dropzone](https://react-dropzone.js.org/)                      | File-drop interaction                  |
| [date-fns](https://date-fns.org/)                                     | Date utilities                         |

---

## Architecture

AP VERSE follows a client-focused, local-first architecture.

```text
                    ┌─────────────────────┐
                    │     public/images   │
                    │  JPG / JPEG / PNG   │
                    │        / WEBP        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Image Discovery    │
                    │  Vite asset globbing│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Gallery Store    │
                    │      Zustand        │
                    └──────┬───────┬──────┘
                           │       │
                ┌──────────┘       └──────────┐
                ▼                             ▼
        ┌───────────────┐             ┌──────────────┐
        │    Gallery    │             │  Favorites   │
        │ Search/Viewer │             │   & Metadata │
        └───────────────┘             └──────┬───────┘
                                             │
                                             ▼
                                      Browser Storage
```

Images remain part of the application assets, while locally managed metadata and favorites are maintained through the application's client-side state.

---

## Project Structure

The repository currently follows this general structure:

```text
verse/
├── public/
│   └── images/
│       └── # Portrait assets
│
├── src/
│   ├── components/
│   │   ├── gallery/
│   │   │   ├── BottomNavigation.tsx
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── GalleryHeader.tsx
│   │   │   ├── PhotoCard.tsx
│   │   │   └── PhotoViewer.tsx
│   │   │
│   │   ├── layout/
│   │   ├── theme/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── store/
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   ├── image-discovery.ts
│   │   ├── lovable-error-reporting.ts
│   │   └── utils.ts
│   │
│   └── routes/
│       ├── __root.tsx
│       ├── index.tsx
│       ├── about.tsx
│       ├── favorites.tsx
│       └── settings.tsx
│
├── ADMIN_GUIDE.md
├── LICENSE
├── README.md
├── bun.lock
├── bunfig.toml
├── components.json
├── eslint.config.js
├── package.json
├── tsconfig.json
└── vite.config.ts
```

TanStack Start uses file-based routing. The primary application routes are:

| Route        | Purpose                         |
| ------------ | ------------------------------- |
| `/`          | Main visual gallery             |
| `/favorites` | Favorite portraits              |
| `/settings`  | Application appearance/settings |
| `/about`     | Creator and project information |

---

## Prerequisites

Before running AP VERSE locally, make sure you have:

* [Bun](https://bun.sh/) installed
* Git installed
* A local copy of this repository

The project uses Bun for dependency installation and its repository includes a `bun.lock` lockfile.

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ashutoshpalhare/verse.git
cd verse
```

### 2. Install dependencies

```bash
bun install
```

### 3. Add portraits

Place supported portrait files inside:

```text
public/images/
```

Supported formats:

```text
.jpg
.jpeg
.png
.webp
```

The application discovers these images when the application initializes.

### 4. Start the development server

```bash
bun dev
```

Open the local URL displayed by Vite in your browser.

---

## Environment Variables

The current repository does **not define a required environment-variable configuration** for normal local development.

No `.env` setup is required for the documented initialization flow.

---

## Usage

### Adding portraits

Add supported image files to:

```text
public/images/
```

Then restart or refresh the application so the image discovery process can detect the updated collection.

### Searching

Use the gallery search functionality to filter portraits using their title or description.

### Favorites

Portraits can be marked as favorites. Favorite state is maintained locally in the browser.

### Metadata

Portrait titles and descriptions can be customized through the application's metadata functionality. These changes are stored locally rather than being written back into the image files.

### Themes

The Settings page currently provides the following visual themes:

* Cinematic
* Midnight
* Obsidian
* Emerald
* Crimson

### Migrating an archive

The project's administrative documentation identifies the `public/images/` directory as the image registry and local browser storage as the location for locally maintained metadata and favorites.

For the project's operational guidance, see [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md).

---

## Available Commands

The commands currently defined in `package.json` are:

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `bun dev`           | Start the Vite development server            |
| `bun run build`     | Create a production build                    |
| `bun run build:dev` | Create a build using Vite's development mode |
| `bun run preview`   | Preview the generated Vite build             |
| `bun run lint`      | Run ESLint                                   |
| `bun run format`    | Format the repository with Prettier          |

### Development

```bash
bun dev
```

### Production build

```bash
bun run build
```

### Preview production build

```bash
bun run preview
```

### Lint

```bash
bun run lint
```

### Format

```bash
bun run format
```

---

## Testing

A dedicated test script is **not currently defined** in `package.json`.

For the checks currently available in the repository, run:

```bash
bun run lint
bun run build
```

---

## Production Build

Create a production build with:

```bash
bun run build
```

After building, the generated application can be inspected locally with:

```bash
bun run preview
```

The repository does not currently document a specific production hosting provider or deployment platform, so deployment configuration is intentionally not prescribed here.

---

## Image Management

AP VERSE treats `public/images/` as its visual archive registry.

```text
public/
└── images/
    ├── portrait-01.jpg
    ├── portrait-02.webp
    ├── portrait-03.png
    └── ...
```

Supported image formats:

* JPEG
* JPG
* PNG
* WebP

Image discovery is handled by the application's image-discovery utility rather than requiring a manually maintained image manifest.

---

## Local Data & Privacy

AP VERSE is designed around a local-first model.

The repository's current implementation stores application-managed favorites and metadata in browser-local storage. Image assets themselves are maintained within the application's `public/images/` directory.

This means that local browser data and the image registry are separate concerns:

```text
Image files
    └── public/images/

Application metadata
    └── Browser LocalStorage

Favorites
    └── Browser LocalStorage
```

Because metadata and favorites are browser-local, clearing browser storage can remove locally persisted application data.

---

## Contributing

Contributions are welcome.

Before submitting a change:

1. Create a fork of the repository.
2. Create a dedicated branch for your change.
3. Keep changes focused and consistent with the existing architecture.
4. Run the available validation commands:

```bash
bun run lint
bun run build
```

5. Open a pull request describing:

   * What changed
   * Why the change was made
   * Any relevant implementation details
   * Any limitations or follow-up work

For larger changes, consider opening an issue first to discuss the proposed direction.

---

## Documentation

Additional operational documentation is available in:

[`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md)

It covers image archival discovery, supported image formats, local metadata behavior, available visual themes, and current performance-oriented implementation details.

---

## License

AP VERSE is licensed under the **MIT License**.

Copyright © 2026 Ashutosh Palhare.

See [`LICENSE`](./LICENSE) for the complete license text.

---

## Author

**Ashutosh Palhare**

AP VERSE is designed and maintained by Ashutosh Palhare.

* GitHub: [@ashutoshpalhare](https://github.com/ashutoshpalhare)

---

<p align="center">
  <strong>AP VERSE</strong><br>
  <sub>AP's Visual Universe</sub>
</p>
