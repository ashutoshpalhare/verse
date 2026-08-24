# AP VERSE - Systems Documentation

This guide provides the operational protocols for maintaining the AP VERSE visual sanctuary.

## Archival Discovery
The universe automatically expands when new portraits are detected in the local infrastructure.

### 1. Adding Portraits
- **Registry**: `public/images/`
- **Supported Modules**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Protocol**: Drop files into the registry. The universe will scan and integrate them upon next initialization.

### 2. Metadata Sanity
All edits to portrait identities (Titles, Descriptions) are preserved within the local visual engine (LocalStorage).
- **Favorites**: Stored locally to maintain a private curated stream.
- **Portability**: To migrate your universe, retain the `public/images/` registry and export your metadata stream from Settings.

## Visual Engine
AP VERSE utilizes a perceptually uniform color space (OKLCH) to maintain its mysterious, cinematic atmosphere.

- **Cinematic (Default)**: Pure deep dark matter aesthetic.
- **Midnight**: Deep blue-tinted shadows for reduced eye strain.
- **Obsidian**: True black backgrounds for OLED displays.
- **Emerald/Crimson**: High-contrast futuristic accents.

## Performance Optimization
- **Masonry Layout**: Uses `react-masonry-css` with dynamic breakpoints.
- **Image Loading**: Native lazy loading enabled by default.
- **State**: Managed via Zustand for zero-latency UI updates.

---
*Archival Protocol v1.0.42 | Maintained by Ashutosh Palhare*
