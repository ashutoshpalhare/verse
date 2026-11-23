# AP VERSE

> **AP's Visual Universe**

AP VERSE is a cinematic, public portrait gallery built with React and Vite. The gallery displays image files committed to this repository; favorites, appearance preferences, and edited photo details are saved locally in each visitor's browser.

**Live site:** https://ashutoshpalhare.github.io/verse/

## Features

- **Automatic image discovery** — Add images to `public/images/`; the build generates a manifest automatically.
- **Nested folders** — Organize images in subfolders under `public/images/`.
- **Supported formats** — JPG, JPEG, PNG, WebP, and AVIF (case-insensitive extensions).
- **Stable image identity** — SHA-256 content IDs, duplicate detection, and migration from legacy filename IDs.
- **Photo viewer** — Responsive full-screen viewer with aspect-ratio preservation, keyboard navigation, and touch gestures.
- **Favorites, search, and metadata** — Favorites and edited titles/descriptions persist in browser storage.
- **Appearance settings** — Themes, animation preference, and interface scale.
- **Archive backup** — Export/import favorites and metadata as JSON from Settings. Image files are not included in the backup.
- **Static SEO pages** — Route-specific HTML metadata, social cards, structured data, sitemap, and robots rules.
- **GitHub Pages deployment** — Static build and deployment through GitHub Actions. No application backend is required.

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript |
| Routing | TanStack Router |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| State | Zustand with persistence |
| Icons | Lucide React and Simple Icons |
| Static build | Vite 8 |
| Package manager | Bun |
| Hosting | GitHub Pages |

## Run locally

### Requirements

- [Bun](https://bun.sh/docs/installation)
- Git

### Setup

```bash
git clone https://github.com/ashutoshpalhare/verse.git
cd verse
bun install
bun run dev
```

Open the local URL printed by Vite. The `dev` script generates the image manifest before starting the app.

## Add or update photos

1. Add JPG, JPEG, PNG, WebP, or AVIF files under `public/images/`. Subfolders are supported.
2. Commit and push the image files to the repository.
3. The development/build scripts regenerate `src/generated/image-manifest.json`; do not edit that generated file manually.
4. For the live site, merge/push the changes to `main`. GitHub Actions rebuilds and deploys the site.

The manifest uses the image file's content hash as its stable ID. Exact duplicate image files are deduplicated in the gallery. Hidden files and unsupported file types are ignored.

**Important:** A GitHub Pages site backed by a public repository is public. Images committed under `public/images/` are published as static assets and must not be treated as private storage.

## Local data and backups

- Favorites, photo metadata overrides, themes, animation preference, and interface scale are stored in the current browser's `localStorage`.
- Browser storage is device/browser-specific. There is no account, server database, or cloud synchronization.
- Settings can export/import favorites and metadata as a JSON file. The original photos remain in the repository and are not embedded in the JSON backup.
- Clear browser storage only after exporting a backup if you need to preserve local changes.

## GitHub Pages deployment

The production deployment uses `vite.pages.config.ts` and the `build:pages` script. It builds the static site into `dist-pages/` with the repository base path `/verse/`.

1. In the repository, open **Settings → Pages**.
2. Set the publishing source to **GitHub Actions**.
3. Merge changes into `main` or run the deployment workflow manually.
4. Check the **Actions** tab for a successful **Deploy AP VERSE to GitHub Pages** run.

Live URL: https://ashutoshpalhare.github.io/verse/

Do not use the default `bun run build` output as the GitHub Pages artifact; Pages uses the dedicated `build:pages` configuration.

## Useful scripts

| Command | Purpose |
|---|---|
| `bun run dev` | Generate image manifest and start local development |
| `bun run build:pages` | Build the GitHub Pages static site and route-specific SEO HTML |
| `bun run test:images` | Test image manifest discovery and migration cases |
| `bun run test:seo` | Validate generated route metadata, sitemap, and robots output |
| `bun run typecheck` | Run TypeScript without emitting files |
| `bun run lint` | Run ESLint |
| `bun run format` | Format repository files with Prettier |

## Repository layout

```text
pages/index.html                 Static Vite entry for GitHub Pages
public/images/                   Published gallery images
public/robots.txt                Crawler rules
public/sitemap.xml               Public indexable routes
scripts/generate-image-manifest.mjs
scripts/generate-seo-pages.mjs
scripts/test-image-manifest.mjs
scripts/test-seo-pages.mjs
src/generated/image-manifest.json Generated at build/dev time; do not hand-edit
src/lib/image-discovery.ts       Manifest-to-gallery adapter
src/lib/store/                   Gallery, theme, and preference stores
src/routes/                      Home, About, Favorites, and Settings
vite.pages.config.ts             Static GitHub Pages configuration
.github/workflows/               CI and Pages deployment workflows
ADMIN_GUIDE.md                   Maintenance and operational guide
```

## Privacy, content, and license

- This is a public static website. Repository contents and published gallery images are publicly accessible.
- Local favorites and preferences are not uploaded by the app, but they are not synchronized between browsers/devices.
- The MIT license in [LICENSE](LICENSE) covers the project code. It does not grant rights to reuse portrait photographs or other third-party assets; confirm image permissions before publishing.
- Do not commit secrets, private images, or personal data to this public repository.

## Maintainer

**Ashutosh Palhare**

- GitHub: https://github.com/ashutoshpalhare
- Repository: https://github.com/ashutoshpalhare/verse
