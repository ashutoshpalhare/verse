import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = "dist-pages";
const expected = [
  { path: "index.html", canonical: "https://ashutoshpalhare.github.io/verse/", robots: "index, follow", schema: true },
  { path: "about/index.html", canonical: "https://ashutoshpalhare.github.io/verse/about/", robots: "index, follow", schema: true },
  { path: "favorites/index.html", canonical: "https://ashutoshpalhare.github.io/verse/favorites/", robots: "noindex, follow", schema: false },
  { path: "settings/index.html", canonical: "https://ashutoshpalhare.github.io/verse/settings/", robots: "noindex, nofollow", schema: false },
];

for (const page of expected) {
  const html = await readFile(root + "/" + page.path, "utf8");
  assert.ok(html.includes('rel="canonical" href="' + page.canonical + '"'), page.path + ": canonical URL");
  assert.ok(html.includes('name="robots" content="' + page.robots + '"'), page.path + ": robots directive");
  assert.ok(html.includes('property="og:title"'), page.path + ": Open Graph title");
  assert.ok(html.includes('property="og:image"'), page.path + ": Open Graph image");
  assert.ok(html.includes('name="twitter:card"'), page.path + ": Twitter card");
  assert.ok(html.includes('src="/verse/assets/') || html.includes('src="/verse/'), page.path + ": GitHub Pages base path");
  assert.equal(html.includes('type="application/ld+json"'), page.schema, page.path + ": structured data presence");
}

const sitemap = await readFile(root + "/sitemap.xml", "utf8");
assert.ok(sitemap.includes("https://ashutoshpalhare.github.io/verse/"));
assert.ok(sitemap.includes("https://ashutoshpalhare.github.io/verse/about/"));
assert.ok(!sitemap.includes("/favorites"), "Favorites must not be in sitemap");
assert.ok(!sitemap.includes("/settings"), "Settings must not be in sitemap");

const robots = await readFile(root + "/robots.txt", "utf8");
assert.ok(robots.includes("https://ashutoshpalhare.github.io/verse/sitemap.xml"));

console.log("SEO regression checks passed for homepage and all static route entries.");
