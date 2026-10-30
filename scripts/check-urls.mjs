#!/usr/bin/env node
// Checks the fishtreeoflife.org URL contract described in tests/README.md.
//
//   node scripts/check-urls.mjs <site-dir>                  check a build (dist/ or _site/)
//   node scripts/check-urls.mjs --live <base-url> [--quick] check the deployed site
//   node scripts/check-urls.mjs --update <site-dir> --source <label>
//                                                           regenerate the fixtures from a build
//
// No dependencies; runs on Node 18+.

import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const URLS_FILE = new URL("../tests/legacy-urls.txt", import.meta.url);
const API_FILE = new URL("../tests/legacy-api.sha256", import.meta.url);

// Download paths embedded in the API JSON. fishtree <= 0.3.x requests
// paste0("https://fishtreeoflife.org/", value), so these may point anywhere on
// the site as long as they stay relative, but they are excluded from the hash.
const PATH_FIELDS = new Set(["chronogram", "phylogram", "chronogram_mrca", "phylogram_mrca", "matrix_phylip", "matrix_nexus"]);

// JSON with PATH_FIELDS removed, keys sorted, arrays kept in order.
function canonical(value) {
    if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
    if (value !== null && typeof value === "object") {
        const keys = Object.keys(value).filter((k) => !PATH_FIELDS.has(k)).sort();
        return `{${keys.map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
    }
    return JSON.stringify(value);
}

function embeddedPaths(value, out = []) {
    if (Array.isArray(value)) value.forEach((v) => embeddedPaths(v, out));
    else if (value !== null && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) {
            if (PATH_FIELDS.has(k) && typeof v === "string") out.push(v);
            else embeddedPaths(v, out);
        }
    }
    return out;
}

const sha256 = (text) => createHash("sha256").update(text).digest("hex");

async function readLines(file) {
    return (await readFile(file, "utf8")).split("\n").filter((l) => l && !l.startsWith("#"));
}

async function readFixtures() {
    const urls = await readLines(URLS_FILE);
    const api = (await readLines(API_FILE)).map((line) => {
        const m = line.match(/^([0-9a-f]{64}) {2}(\/.+)$/);
        if (!m) throw new Error(`Malformed line in ${API_FILE.pathname}: ${line}`);
        return { hash: m[1], path: m[2] };
    });
    return { urls, api };
}

// --- reading a site, either a local build or the live site -----------------

function localSite(dir) {
    // Fixture paths are stored unencoded (some API files have spaces in their names).
    const file = (path) => join(dir, path.replace(/\/$/, "/index.html"));
    return {
        async size(path) {
            try {
                const s = await stat(file(path));
                return s.isFile() ? s.size : -1;
            } catch {
                return -1;
            }
        },
        text: (path) => readFile(file(path), "utf8"),
    };
}

// Retries network errors, 429s and 5xx responses so one blip during a run
// of several thousand requests isn't reported as a broken URL.
async function fetchWithRetry(url, init, attempts = 4) {
    for (let i = 1; ; i++) {
        try {
            const res = await fetch(url, init);
            if ((res.status === 429 || res.status >= 500) && i < attempts) throw new Error(`HTTP ${res.status}`);
            return res;
        } catch (e) {
            if (i >= attempts) throw e;
            await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (i - 1)));
        }
    }
}

function liveSite(base) {
    const url = (path) => new URL(encodeURI(path), base);
    return {
        async size(path) {
            const res = await fetchWithRetry(url(path), { method: "HEAD", redirect: "follow" });
            if (!res.ok) return -1;
            const length = res.headers.get("content-length");
            return length === null ? 1 : Number(length); // compressed responses may omit it
        },
        async text(path) {
            const res = await fetchWithRetry(url(path));
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        },
    };
}

async function pool(items, limit, fn) {
    const results = new Array(items.length);
    let next = 0;
    const worker = async () => {
        while (next < items.length) {
            const i = next++;
            results[i] = await fn(items[i]);
        }
    };
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
}

async function check(site, { quick = false, concurrency = 16 } = {}) {
    const { urls, api } = await readFixtures();
    const failures = { missing: [], hash: [], absolute: [], unresolved: [] };

    const sizes = await pool(urls, concurrency, (p) => site.size(p).catch(() => -1));
    urls.forEach((p, i) => sizes[i] <= 0 && failures.missing.push(sizes[i] === 0 ? `${p} (empty)` : p));

    let embedded = 0;
    if (!quick) {
        const targets = new Set();
        await pool(api, concurrency, async ({ hash, path }) => {
            let data;
            try {
                data = JSON.parse(await site.text(path));
            } catch (e) {
                failures.hash.push(`${path} (${e.message})`);
                return;
            }
            if (sha256(canonical(data)) !== hash) failures.hash.push(path);
            for (const target of embeddedPaths(data)) {
                if (target.startsWith("/") || /^[a-z]+:/i.test(target)) failures.absolute.push(`${path}: ${target}`);
                else targets.add(target);
            }
        });
        embedded = targets.size;
        const list = [...targets];
        const targetSizes = await pool(list, concurrency, (t) => site.size(`/${t}`).catch(() => -1));
        list.forEach((t, i) => targetSizes[i] <= 0 && failures.unresolved.push(t));
    }

    console.log(`Listed URLs: ${urls.length - failures.missing.length}/${urls.length} present and non-empty`);
    if (quick) console.log("API hashes and embedded paths: skipped (--quick)");
    else {
        console.log(`API JSON: ${api.length - failures.hash.length}/${api.length} match their canonical hash`);
        console.log(`Embedded download paths: ${embedded - failures.unresolved.length}/${embedded} resolve; ${failures.absolute.length} not relative`);
    }
    const labels = {
        missing: "Missing or empty",
        hash: "API JSON changed (other than download paths)",
        absolute: "Embedded paths that are not relative (fishtree <= 0.3.x prepends the site URL)",
        unresolved: "Embedded paths that do not resolve",
    };
    let failed = false;
    for (const [key, list] of Object.entries(failures)) {
        if (!list.length) continue;
        failed = true;
        console.log(`\n${labels[key]} (${list.length}):`);
        list.slice(0, 25).forEach((l) => console.log(`  ${l}`));
        if (list.length > 25) console.log(`  ... and ${list.length - 25} more`);
    }
    return !failed;
}

// --- regenerating the fixtures from a build ---------------------------------

async function walk(dir, root = dir, out = []) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) await walk(full, root, out);
        else out.push("/" + relative(root, full).split(sep).join("/"));
    }
    return out;
}

// Which built files are part of the contract. Everything else (CSS, images,
// icons, per-taxon downloads) may move: internal links to them are covered by
// the link checker, and per-taxon downloads by the embedded-path check.
function inContract(path) {
    // Jekyll's pretty permalinks put the 404 page at /404/, where GitHub Pages
    // never serves it for missing URLs; nothing links there, so it's excluded.
    if (path === "/404/index.html") return false;
    if (path.endsWith("/index.html") || path === "/404.html") return true; // every HTML page
    if (path.startsWith("/api/")) return true; // the JSON API, fishtree's entry point
    if (/^\/downloads\/[^/]+$/.test(path)) return true; // top-level downloads, cited in papers
    if (/^\/downloads\/taxonomy\/[^/]+\.tre$/.test(path)) return true; // skeletal order/family trees
    return ["/sitemap.xml", "/robots.txt", "/favicon.ico", "/favicon.png"].includes(path);
}

const toUrl = (path) => path.replace(/\/index\.html$/, "/");

async function update(dir, source) {
    const files = (await walk(dir)).sort();
    const urls = files.filter(inContract).map(toUrl).sort();
    const apiFiles = files.filter((p) => p.startsWith("/api/") && p.endsWith(".json"));
    const site = localSite(dir);
    const hashes = await pool(apiFiles, 16, async (p) => `${sha256(canonical(JSON.parse(await site.text(p))))}  ${p}`);
    const date = new Date().toISOString().slice(0, 10);
    const header = [
        "# fishtreeoflife.org URL contract. See tests/README.md.",
        `# Generated by scripts/check-urls.mjs --update from ${source} on ${date}.`,
    ];
    await writeFile(URLS_FILE, [...header, "# Every path below must exist and be non-empty.", ...urls, ""].join("\n"));
    await writeFile(API_FILE, [...header, "# sha256 of each API file's canonical JSON, ignoring the embedded download paths.", ...hashes, ""].join("\n"));
    console.log(`Wrote ${urls.length} URLs and ${hashes.length} API hashes from ${files.length} built files.`);
}

// --- command line -----------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => {
    const i = args.indexOf(name);
    return i === -1 ? undefined : args.splice(i, 2)[1];
};
const quick = args.includes("--quick") ? (args.splice(args.indexOf("--quick"), 1), true) : false;
const live = flag("--live");
const updateDir = flag("--update");
const source = flag("--source");

if (updateDir) {
    if (!source) throw new Error("--update needs --source <label>, e.g. master@2a7a2ab");
    await update(updateDir, source);
} else if (live) {
    process.exit((await check(liveSite(live), { quick, concurrency: 8 })) ? 0 : 1);
} else if (args.length === 1) {
    process.exit((await check(localSite(args[0]), { quick })) ? 0 : 1);
} else {
    console.error("Usage: check-urls.mjs <site-dir> | --live <base-url> [--quick] | --update <site-dir> --source <label>");
    process.exit(2);
}
