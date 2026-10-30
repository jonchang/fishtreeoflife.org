#!/usr/bin/env node
// Regenerates the figures of the 2018 update page in
// public/assets/img/rabosky2018figures/. Each source GIF alternates the
// original and the updated figure; they become {name}-original and
// {name}-updated, as AVIF with a PNG fallback, at full size (resizing the line
// art makes the files larger). regression.png gets an AVIF copy. The outputs
// are committed; this only needs to run if the figures change. Uses sharp,
// which comes with Astro.
//
// The GIFs are in git history:
//   mkdir /tmp/gifs && git archive 343b2a3 public/assets/img/rabosky2018figures | tar -x -C /tmp/gifs
//   node scripts/make-2018-figures.mjs /tmp/gifs/public/assets/img/rabosky2018figures

import { readdirSync } from "node:fs";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
    console.error("usage: node scripts/make-2018-figures.mjs GIF_DIR");
    process.exit(1);
}
const OUT = "public/assets/img/rabosky2018figures";

async function write(image, base) {
    await image.clone().avif({ quality: 50, effort: 6 }).toFile(`${base}.avif`);
    await image.clone().png({ palette: true, effort: 10, compressionLevel: 9 }).toFile(`${base}.png`);
}

for (const file of readdirSync(src).filter((f) => f.endsWith("_flicker.gif")).sort()) {
    const name = file.replace(/_flicker\.gif$/, "");
    const { pages } = await sharp(`${src}/${file}`).metadata();
    if (pages !== 2) throw new Error(`${file}: expected 2 frames, found ${pages}`);
    for (const [page, label] of [[0, "original"], [1, "updated"]]) {
        await write(sharp(`${src}/${file}`, { page }), `${OUT}/${name}-${label}`);
    }
    console.log(`${name}: original, updated`);
}

await sharp(`${OUT}/regression.png`).avif({ quality: 50, effort: 6 }).toFile(`${OUT}/regression.avif`);
console.log("regression: avif");
