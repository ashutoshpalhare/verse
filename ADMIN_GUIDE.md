# AP VERSE — Maintenance Guide

This guide describes how to maintain the public GitHub Pages gallery.

## 1. Add gallery images

Image source folder: `public/images/`

Supported extensions (case-insensitive):

- `.jpg`, `.jpeg`
- `.png`
- `.webp`
- `.avif`

Subfolders are supported. Use descriptive filenames because the initial display title is derived from the filename.

### Workflow

1. Add image files to `public/images/` using GitHub's file upload or another Git workflow.
2. Commit the image files to the repository.
3. The `dev`, `build`, and `build:pages` scripts run `scripts/generate-image-manifest.mjs`.
4. For the live gallery, merge the change into `main` and wait for the **Deploy AP VERSE to GitHub Pages** workflow to succeed.

Do not manually edit `src/generated/image-manifest.json`; it is generated from the image folder. Hidden files, symlinks, non-regular files, and unsupported extensions are skipped. Exact duplicate image contents are deduplicated. The manifest uses SHA-256 content IDs and retains legacy filename IDs to migrate existing local favorites/metadata.

**Publishing warning:** this repository and its GitHub Pages site are public. Every committed gallery image is published and can be accessed directly. Never use this folder for private or sensitive photos.

## 2. Local browser data

The app uses browser `localStorage`; there is no backend, user account, or cloud sync.

| Data | Storage behavior |
|---|---|
| Favorites | Saved in the current browser |
| Edited photo titles/descriptions | Saved in the current browser |
| Theme | Saved in the current browser |
| Animation preference and interface scale | Saved in the current browser |
| Original photos | Static files in the repository, not browser storage |

Favorites and metadata can be exported/imported from **Settings** as a JSON archive. This archive does not contain the original images. Import merges the backup with the current browser's favorites and metadata. Export before clearing browser data or moving to another device.

## 3. Build and validation

Install dependencies with Bun:

```bash
bun install --frozen-lockfile
```

Useful checks:

```bash
bun run typecheck
bun run lint
bun run test:images
bun run build:pages
bun run test:seo
```

The image regression suite covers supported formats, nested paths, hidden/unsupported files, duplicate content, stable IDs, missing image folders, natural sorting, and a 1,000-image fixture.

The SEO regression suite checks the generated HTML for the homepage, About, Favorites, and Settings routes, including canonical URLs, robots directives, social metadata, structured data, sitemap entries, and the GitHub Pages base path.

## 4. GitHub Pages deployment

The deployment workflow is `.github/workflows/deploy.yml`.

- Trigger: push to `main` or manual workflow dispatch.
- Build command: `bun run build:pages`.
- Output directory: `dist-pages/`.
- Hosting base path: `/verse/`.
- A `404.html` SPA fallback and `.nojekyll` marker are added before upload.

Repository settings must use **Settings → Pages → Build and deployment → GitHub Actions**.

The PR validation workflow is `.github/workflows/image-pipeline-ci.yml`. It runs type checks, lint, image tests, the Pages build, and SEO regression tests for relevant pull requests.

## 5. SEO and route indexing

- Home and About are intended to be indexable and are listed in `public/sitemap.xml`.
- Favorites and Settings are marked `noindex` and excluded from the sitemap because they are browser-specific utility pages.
- `scripts/generate-seo-pages.mjs` creates route-specific static HTML entries after the Vite build. Keep this script and `test:seo` in sync if route paths or metadata change.
- The sitemap and canonical URLs use `https://ashutoshpalhare.github.io/verse/`.

## 6. Troubleshooting

**New images do not appear locally**
- Confirm the file is inside `public/images/` or a subfolder.
- Confirm its extension is supported.
- Restart `bun run dev`; the manifest is generated when the command starts.

**New images do not appear on the live site**
- Confirm the image files were committed and merged into `main`.
- Check the latest Pages deployment workflow.
- Confirm the manifest generation and build steps passed.

**Favorites or metadata disappeared**
- Browser storage may have been cleared or unavailable.
- Import a previously exported JSON archive.
- Remember that data does not sync between browsers or devices.

**Pages route returns a 404**
- Check that the Pages deployment completed.
- Confirm the workflow copied `index.html` to `404.html`.
- Keep the `/verse/` base path in the Pages Vite config.

## 7. Content and licensing

The MIT license covers the repository's project code, not automatically the rights to photographs or third-party assets. Confirm permission to publish each image. Do not commit API keys, credentials, private photos, or personal information to this public repository.

---
Maintained by Ashutosh Palhare.
