#!/usr/bin/env node
// Checks the built site against its low-bandwidth rules:
//
//   - No client JS: every <script> is JSON-LD or the GA4 snippet, and there are
//     no .js files, inline event handlers or javascript: URLs.
//   - Every HTML page is at most 100 KB gzipped.
//   - The home page's first load is at most 250 KB: gzipped HTML and CSS, the
//     icon, and each eagerly loaded image as a 2x screen picks it. GA4 is
//     third-party and not counted.
//
// usage: node scripts/check-budget.mjs dist

import { globSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";

const dir = process.argv[2];
if (!dir) {
    console.error("usage: node scripts/check-budget.mjs DIST_DIR");
    process.exit(1);
}

const PAGE_LIMIT = 100 * 1024;
const HOME_LIMIT = 250 * 1024;
const IMAGE_WIDTH = 2 * 940;

const GA_LOADER = /^\s*async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+"\s*$/;
const GA_CONFIG =
    /^window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-[A-Z0-9]+'\);$/;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const gz = (file) => gzipSync(readFileSync(file)).length;
const errors = [];

function scriptErrors(html) {
    const found = [];
    for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (/\btype="application\/ld\+json"/.test(attrs)) continue;
        if (GA_LOADER.test(attrs) && body.trim() === "") continue;
        if (attrs.trim() === "" && GA_CONFIG.test(body.trim())) continue;
        found.push(`<script${attrs}>${body.slice(0, 60)}`);
    }
    for (const [tag] of html.matchAll(/<[a-z][^>]*\son[a-z]+\s*=[^>]*>/gi)) found.push(tag.slice(0, 80));
    for (const [attr] of html.matchAll(/\b(?:href|src)\s*=\s*"\s*javascript:[^"]*"/gi)) found.push(attr);
    return found;
}

const pages = globSync(`${dir}/**/*.html`);
let largest = { size: 0, page: "" };
for (const page of pages) {
    const html = readFileSync(page, "utf8");
    for (const e of scriptErrors(html)) errors.push(`${page}: script not allowed: ${e}`);
    const size = gz(page);
    if (size > PAGE_LIMIT) errors.push(`${page}: ${kb(size)} gzipped, over ${kb(PAGE_LIMIT)}`);
    if (size > largest.size) largest = { size, page };
}
for (const file of globSync(`${dir}/**/*.{js,mjs}`)) errors.push(`${file}: JavaScript file in the build`);
console.log(`Client JS: checked ${pages.length} pages`);
console.log(`Largest page: ${largest.page}, ${kb(largest.size)} gzipped (limit ${kb(PAGE_LIMIT)})`);

// Home page first load.
const local = (url) => `${dir}${url.split(/[?#]/)[0]}`;
const home = readFileSync(`${dir}/index.html`, "utf8");
const parts = { html: gz(`${dir}/index.html`), css: 0, icon: 0, images: 0 };
for (const [, href] of home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) parts.css += gz(local(href));
for (const [, href] of home.matchAll(/<link rel="icon" href="([^"]+)"/g)) parts.icon += statSync(local(href)).size;

/** The candidate a browser picks for IMAGE_WIDTH pixels from a "url 940w, ..." srcset. */
function pick(srcset) {
    const candidates = srcset
        .split(",")
        .map((c) => c.trim().split(/\s+/))
        .map(([url, w]) => ({ url, w: parseInt(w ?? "", 10) || 0 }))
        .sort((a, b) => a.w - b.w);
    return (candidates.find((c) => c.w >= IMAGE_WIDTH) ?? candidates.at(-1)).url;
}
for (const [, picture] of home.matchAll(/<picture>([\s\S]*?)<\/picture>/g)) {
    if (/loading="lazy"/.test(picture)) continue;
    const avif = /<source srcset="([^"]+)" type="image\/avif"/.exec(picture);
    const img = /<img [^>]*src="([^"]+)"/.exec(picture);
    parts.images += statSync(local(avif ? pick(avif[1]) : img[1])).size;
}
for (const [tag] of home.replace(/<picture>[\s\S]*?<\/picture>/g, "").matchAll(/<img [^>]*>/g)) {
    if (/loading="lazy"/.test(tag)) continue;
    parts.images += statSync(local(/src="([^"]+)"/.exec(tag)[1])).size;
}
const total = parts.html + parts.css + parts.icon + parts.images;
const detail = Object.entries(parts).map(([k, v]) => `${k} ${kb(v)}`).join(", ");
console.log(`Home page first load: ${kb(total)} (${detail}; limit ${kb(HOME_LIMIT)})`);
if (total > HOME_LIMIT) errors.push(`Home page first load is ${kb(total)}, over ${kb(HOME_LIMIT)}`);

if (errors.length > 0) {
    for (const e of errors.slice(0, 50)) console.error(e);
    if (errors.length > 50) console.error(`... and ${errors.length - 50} more`);
    process.exit(1);
}
