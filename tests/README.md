# URL contract

The site must keep serving the URLs that people, search engines and old copies of the `fishtree` R package depend on. `scripts/check-urls.mjs` enforces this against two fixtures, both generated from the Jekyll build of `master@2a7a2ab`:

- **`legacy-urls.txt`** (1,557 paths): every one must exist and be non-empty.
  - every HTML page, all 831 of them, except `/404/`, where Jekyll put the 404 page but GitHub Pages never serves it
  - the whole JSON API under `/api/` (706 files, plus `/api/` itself)
  - the top-level files in `/downloads/`, which papers cite, and the two skeletal trees in `/downloads/taxonomy/`
  - `/sitemap.xml`, `/robots.txt`, `/favicon.ico` and `/favicon.png`
- **`legacy-api.sha256`**: a hash of each API file's *canonical* JSON (keys sorted, whitespace ignored). Any change to the data fails the check, except to the six download-path fields described below.

## Why the per-taxon downloads aren't listed

Released `fishtree` versions (0.1.0–0.3.4) hard-code only six downloads:
- `actinopt_12k_treePL.tre.xz`
- `actinopt_12k_raxml.tre.xz`
- `actinopt_full.trees.xz`
- `final_alignment.phylip.xz`
- `final_alignment.partitions`
- `tiprates.csv.xz`

They also hard-code `api/taxonomy.json`, `api/taxonomy/{rank}/{name}.json`, and (0.1.0 only) `api/family.json` and `api/order.json`.

Every other file they download, the ~2,500 per-taxon trees and matrices, is found through six fields in the API JSON: `chronogram`, `phylogram`, `chronogram_mrca`, `phylogram_mrca`, `matrix_phylip` and `matrix_nexus`. `fishtree` requests `paste0("https://fishtreeoflife.org/", value)`. So these files can move, provided that:

1. the JSON is updated to point at the new location;
2. each value stays a **relative** path on fishtreeoflife.org, with no leading `/` and no other host;
3. the files keep their formats: Newick trees, and sequential PHYLIP with one line per sampled species, because `fishtree_alignment()` reads `nlines = sampled species + 2`.

The checker excludes those six fields from the hash, and instead checks that every value is relative and resolves to a non-empty file. Links from HTML pages to other files (CSS, images, the species CSVs) are covered by the lychee link check, not by this contract.

## Running it

```bash
npm run build && node scripts/check-urls.mjs dist                # a local build
node scripts/check-urls.mjs --live https://fishtreeoflife.org    # the deployed site
node scripts/check-urls.mjs --live https://fishtreeoflife.org --quick   # existence only
```

To regenerate the fixtures from a build, which you should only do when deliberately changing the contract:

```bash
node scripts/check-urls.mjs --update <site-dir> --source <label>
```

Review the diff before committing it: removing a path from these files means agreeing that its URL may stop working.
