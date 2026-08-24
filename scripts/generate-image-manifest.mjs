import fs from "node:fs";
import path from "node:path";

const imagesDir = path.resolve("public/images");
const outputDir = path.resolve("src/generated");
const outputFile = path.join(outputDir, "image-manifest.json");

const supportedExtensions = /\.(jpg|jpeg|png|webp)$/i;

const files = fs
  .readdirSync(imagesDir)
  .filter((file) => supportedExtensions.test(file))
  .sort((a, b) => a.localeCompare(b));

fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  outputFile,
  JSON.stringify(files, null, 2),
  "utf8",
);

console.log(`Generated image manifest with ${files.length} images.`);