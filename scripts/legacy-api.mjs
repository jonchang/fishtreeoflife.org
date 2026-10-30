#!/usr/bin/env node
// Writes the legacy JSON API under public/api/, as the Jekyll site did. It is
// the entry point for every released version of the fishtree R package, so it
// stays frozen to the Rabosky et al. 2018 data and PFC taxonomy; see
// tests/README.md for what may and may not change.
//
//   /api/taxonomy.json                  rank -> taxon names
//   /api/taxonomy/{rank}.json           all taxa of a rank, copied from the data image
//   /api/taxonomy/{rank}/{name}.json    one taxon
//   /api/family.json, /api/order.json   used by fishtree 0.1.0
//
// Runs before `astro build` and `astro dev` (npm prebuild/predev); no dependencies.

import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const DATA = "data/_data/taxonomy";
const OUT = "public/api";

// The PFC ranks, in the order /api/taxonomy.json lists them.
const RANKS = [
    "class", "subclass", "infraclass", "megacohort", "supercohort", "cohort", "subcohort", "infracohort",
    "section", "subsection", "division", "subdivision", "series", "superorder", "order", "suborder",
    "infraorder", "family",
];

await rm(OUT, { recursive: true, force: true });
const index = {};
let files = 0;
for (const rank of RANKS) {
    const source = `${DATA}/${rank}.json`;
    const taxa = JSON.parse(await readFile(source, "utf8"));
    index[rank] = Object.keys(taxa);
    await mkdir(`${OUT}/taxonomy/${rank}`, { recursive: true });
    await copyFile(source, `${OUT}/taxonomy/${rank}.json`);
    for (const [name, taxon] of Object.entries(taxa)) {
        await writeFile(`${OUT}/taxonomy/${rank}/${name}.json`, JSON.stringify(taxon, null, 2));
    }
    files += 1 + index[rank].length;
    if (rank === "family" || rank === "order") {
        await writeFile(`${OUT}/${rank}.json`, JSON.stringify(taxa));
        files += 1;
    }
}
await writeFile(`${OUT}/taxonomy.json`, JSON.stringify(index));
console.log(`legacy-api: wrote ${files + 1} files to ${OUT}/`);
