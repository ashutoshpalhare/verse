import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "ap-verse-image-pipeline-"));
const generator = path.resolve("scripts/generate-image-manifest.mjs");

function runGenerator(imagesDir, manifestPath) {
  execFileSync(process.execPath, [generator], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      AP_VERSE_IMAGES_DIR: imagesDir,
      AP_VERSE_MANIFEST_PATH: manifestPath,
    },
    stdio: "pipe",
  });
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

try {
  const fixtureDir = path.join(root, "fixture");
  const manifestPath = path.join(root, "manifest.json");
  fs.mkdirSync(path.join(fixtureDir, "nested"), { recursive: true });

  fs.writeFileSync(path.join(fixtureDir, "Portrait 10.JPG"), "image-ten");
  fs.writeFileSync(path.join(fixtureDir, "Portrait 2.jpg"), "image-two");
  fs.writeFileSync(path.join(fixtureDir, "duplicate.png"), "image-two");
  fs.writeFileSync(path.join(fixtureDir, "nested", "Portrait 3.avif"), "image-three");
  fs.writeFileSync(path.join(fixtureDir, "Portrait 4.webp"), "image-four");
  fs.writeFileSync(path.join(fixtureDir, "unsupported.gif"), "not-supported");
  fs.writeFileSync(path.join(fixtureDir, ".hidden.jpg"), "hidden");

  let manifest = runGenerator(fixtureDir, manifestPath);
  assert.equal(manifest.version, 2);
  assert.equal(manifest.sourceExists, true);
  assert.equal(manifest.images.length, 4, "supported formats should be found and identical content deduplicated");
  assert.deepEqual(
    manifest.images.map((image) => image.filename),
    ["duplicate.png", "nested/Portrait 3.avif", "Portrait 4.webp", "Portrait 10.JPG"],
    "paths should be sorted naturally and nested images included",
  );
  assert.ok(manifest.images.every((image) => /^[a-f0-9]{64}$/.test(image.id)));
  assert.ok(manifest.images.some((image) => image.legacyIds.length === 2));

  const renameDir = path.join(root, "rename");
  fs.mkdirSync(renameDir);
  fs.writeFileSync(path.join(renameDir, "before-rename.jpeg"), "stable-binary");
  const before = runGenerator(renameDir, path.join(root, "before.json")).images[0].id;
  fs.renameSync(path.join(renameDir, "before-rename.jpeg"), path.join(renameDir, "after-rename.jpeg"));
  const afterManifest = runGenerator(renameDir, path.join(root, "after.json"));
  assert.equal(afterManifest.images[0].id, before, "content IDs must survive filename changes");

  const missingManifest = runGenerator(path.join(root, "does-not-exist"), path.join(root, "missing.json"));
  assert.equal(missingManifest.sourceExists, false);
  assert.deepEqual(missingManifest.images, [], "missing image folders should produce an empty manifest");

  const perfDir = path.join(root, "perf-1000");
  fs.mkdirSync(perfDir);
  for (let index = 1; index <= 1000; index += 1) {
    fs.writeFileSync(path.join(perfDir, `photo-${index}.jpg`), Buffer.from(`fixture-image-${index}`));
  }
  const startedAt = performance.now();
  const perfManifest = runGenerator(perfDir, path.join(root, "perf.json"));
  const elapsedMs = Math.round(performance.now() - startedAt);
  assert.equal(perfManifest.images.length, 1000, "the generator should handle a 1,000-image fixture");
  assert.equal(perfManifest.images[0].filename, "photo-1.jpg");
  assert.equal(perfManifest.images.at(-1).filename, "photo-1000.jpg");

  console.log("Image manifest tests passed: formats, nested paths, duplicates, rename stability, missing folder, and 1,000 images.");
  console.log(`1,000-image fixture generation: ${elapsedMs} ms (CI environment; informational only).`);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
