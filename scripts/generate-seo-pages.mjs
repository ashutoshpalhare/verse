import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("dist-pages");
const siteUrl = "https://ashutoshpalhare.github.io/verse";
const shareImage = "https://github.com/ashutoshpalhare.png?size=1200";

const person = {
  "@type": "Person",
  "@id": siteUrl + "/#ashutosh-palhare",
  name: "Ashutosh Palhare",
  url: "https://github.com/ashutoshpalhare",
  image: shareImage,
};

const pages = [
  {
    route: "",
    title: "AP VERSE — AP's Visual Universe",
    description: "Explore AP VERSE, a cinematic public portrait gallery and visual collection by developer Ashutosh Palhare.",
    robots: "index, follow",
    type: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", "@id": siteUrl + "/#website", name: "AP VERSE", url: siteUrl + "/", description: "A cinematic public portrait gallery and visual collection by Ashutosh Palhare.", creator: { "@id": person["@id"] } },
        person,
      ],
    },
  },
  {
    route: "about",
    title: "About Ashutosh Palhare | AP VERSE",
    description: "Meet Ashutosh Palhare, developer and creator of AP VERSE, a cinematic public portrait gallery and visual collection.",
    robots: "index, follow",
    type: "profile",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: "About Ashutosh Palhare",
      url: siteUrl + "/about/",
      mainEntity: person,
    },
  },
  {
    route: "favorites",
    title: "Favorites | AP VERSE",
    description: "Your locally curated favorite portraits in AP VERSE.",
    robots: "noindex, follow",
    type: "website",
  },
  {
    route: "settings",
    title: "Settings | AP VERSE",
    description: "Manage local appearance preferences and archive backups in AP VERSE.",
    robots: "noindex, nofollow",
    type: "website",
  },
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function removeExistingSeo(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\b(?=[^>]*\bname=["'](?:description|author|robots|twitter:[^"']+)["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:[^"']+["'])[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, "")
    .replace(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, "");
}

function renderMetadata(page) {
  const canonical = siteUrl + (page.route ? "/" + page.route + "/" : "/");
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const image = escapeHtml(shareImage);
  const tags = [
    "<title>" + title + "</title>",
    '<meta name="description" content="' + description + '" />',
    '<meta name="author" content="Ashutosh Palhare" />',
    '<meta name="robots" content="' + page.robots + '" />',
    '<meta name="theme-color" content="#050505" />',
    '<link rel="canonical" href="' + canonical + '" />',
    '<meta property="og:title" content="' + title + '" />',
    '<meta property="og:description" content="' + description + '" />',
    '<meta property="og:type" content="' + page.type + '" />',
    '<meta property="og:url" content="' + canonical + '" />',
    '<meta property="og:site_name" content="AP VERSE" />',
    '<meta property="og:image" content="' + image + '" />',
    '<meta property="og:image:alt" content="Ashutosh Palhare profile portrait" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + title + '" />',
    '<meta name="twitter:description" content="' + description + '" />',
    '<meta name="twitter:image" content="' + image + '" />',
  ];
  if (page.structuredData) {
    const json = JSON.stringify(page.structuredData).replaceAll("<", "\\u003c");
    tags.push('<script type="application/ld+json">' + json + "</script>");
  }
  return tags.join("\n    ");
}

const template = await readFile(path.join(outputDir, "index.html"), "utf8");
for (const page of pages) {
  const html = removeExistingSeo(template).replace("</head>", "    " + renderMetadata(page) + "\n  </head>");
  const destination = page.route
    ? path.join(outputDir, page.route, "index.html")
    : path.join(outputDir, "index.html");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html, "utf8");
  console.log("Generated SEO entry:", destination);
}
