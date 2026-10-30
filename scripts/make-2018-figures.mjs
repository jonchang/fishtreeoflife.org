#!/usr/bin/env node
// Regenerates the figures of the 2018 update page in
// public/assets/img/rabosky2018figures/ from the original and updated PDFs of
// the reanalysis. Each becomes {name}-{original,updated}.avif with a PNG
// fallback, rendered at 260 dpi: twice the content width for a full-width
// figure. regression.png gets an AVIF copy. The outputs are committed; this
// only needs to run if the figures change. Needs pdftoppm (poppler).
//
// usage: node scripts/make-2018-figures.mjs REANALYSIS_DIR
//   REANALYSIS_DIR holds original/{name}.pdf and updated/{name}.pdf

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
    console.error("usage: node scripts/make-2018-figures.mjs REANALYSIS_DIR");
    process.exit(1);
}
const OUT = "public/assets/img/rabosky2018figures";
const FIGURES = ["figmain", "fig2", "fig3", "fig4", "fig5", "fig7", "fig8", "fig9", "fig10"];
const AVIF = { quality: 40, chromaSubsampling: "4:2:0", effort: 6 };

const tmp = mkdtempSync(`${tmpdir()}/figures-`);
try {
    for (const name of FIGURES) {
        for (const version of ["original", "updated"]) {
            const png = `${tmp}/${name}-${version}`;
            execFileSync("pdftoppm", ["-r", "260", "-png", "-singlefile", `${src}/${version}/${name}.pdf`, png]);
            const image = sharp(`${png}.png`).flatten({ background: "#fff" });
            await image.clone().avif(AVIF).toFile(`${OUT}/${name}-${version}.avif`);
            await image.clone().png({ palette: true, effort: 10, compressionLevel: 9 }).toFile(`${OUT}/${name}-${version}.png`);
        }
        console.log(`${name}: original, updated`);
    }
    await sharp(`${OUT}/regression.png`).avif(AVIF).toFile(`${OUT}/regression.avif`);
    console.log("regression: avif");
} finally {
    rmSync(tmp, { recursive: true, force: true });
}
