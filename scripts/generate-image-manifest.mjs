import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const imagesDir = path.resolve(process.env.AP_VERSE_IMAGES_DIR ?? "public/images");
const outputFile = path.resolve(
  process.env.AP_VERSE_MANIFEST_PATH ?? "src/generated/image-manifest.json",
);
const outputDir = path.dirname(outputFile);

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const naturalCompare = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
}).compare;

function collectImageFiles(directory, root = directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectImageFiles(absolutePath, root));
      continue;
    }

    // Symlinks and non-regular files are intentionally ignored.
    if (!entry.isFile()) continue;
    if (!supportedExtensions.has(path.extname(entry.name).toLowerCase())) continue;

    files.push({
      absolutePath,
      filename: path.relative(root, absolutePath).split(path.sep).join("/"),
    });
  }

  return files;
}

function legacyId(filename) {
  // Matches the previous browser-side btoa(filename).replace(/=/g, "") IDs
  // for the existing ASCII filenames, allowing saved data to migrate.
  return Buffer.from(filename, "utf8").toString("base64").replace(/=+$/g, "");
}

const sourceExists = fs.existsSync(imagesDir) && fs.statSync(imagesDir).isDirectory();
const files = sourceExists
  ? collectImageFiles(imagesDir).sort((a, b) => naturalCompare(a.filename, b.filename))
  : [];
const byContent = new Map();
let unreadableCount = 0;

for (const file of files) {
  try {
    const bytes = fs.readFileSync(file.absolutePath);
    const id = createHash("sha256").update(bytes).digest("hex");
    const existing = byContent.get(id);

    if (existing) {
      existing.legacyIds.push(legacyId(file.filename));
      existing.duplicates.push(file.filename);
      continue;
    }

    byContent.set(id, {
      id,
      filename: file.filename,
      size: bytes.byteLength,
      legacyIds: [legacyId(file.filename)],
      duplicates: [],
    });
  } catch (error) {
    unreadableCount += 1;
    console.warn(`Skipped unreadable image "${file.filename}": ${error.message}`);
  }
}

const images = [...byContent.values()].sort((a, b) =>
  naturalCompare(a.filename, b.filename),
);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputFile,
  JSON.stringify({ version: 2, sourceExists, images }, null, 2),
  "utf8",
);

const duplicateCount = files.length - unreadableCount - images.length;
console.log(
  `Generated image manifest: ${images.length} unique images, ${duplicateCount} duplicates skipped, ${unreadableCount} unreadable files.`,
);
if (files.length === 0) {
  console.log(`No supported images found in "${imagesDir}". An empty manifest was generated.`);
}
