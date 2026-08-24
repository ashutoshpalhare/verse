// Static build config for GitHub Pages (no SSR / no Nitro).
// Usage: bun run build:pages  ->  outputs a static site (with index.html) into dist-pages/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  base: "/verse/",
  root: path.resolve(process.cwd(), "pages"),
  publicDir: path.resolve(process.cwd(), "public"),
  plugins: [react(), tailwindcss(), tsconfigPaths({ root: process.cwd() })],
  define: {
    "import.meta.env.VITE_SPA_MODE": JSON.stringify("true"),
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  build: {
    outDir: path.resolve(process.cwd(), "dist-pages"),
    emptyOutDir: true,
  },
});
