[![Build status](https://github.com/jonchang/fishtreeoflife.org/actions/workflows/astro.yml/badge.svg)](https://github.com/jonchang/fishtreeoflife.org/actions/workflows/astro.yml)
[![Digital object identifier](https://zenodo.org/badge/DOI/10.1111/2041-210x.13182.svg)](https://doi.org/10.1111/2041-210x.13182)


# The Fish Tree of Life website

This is the primary git repository for the Fish Tree of Life website at https://fishtreeoflife.org. Data sources are hosted in the [Docker repository](https://github.com/jonchang/fishtreeoflife-docker).

# Building

The site is built with [Astro](https://astro.build) and needs Node 26 (see `.nvmrc`).

```
git clone https://github.com/jonchang/fishtreeoflife.org.git
cd fishtreeoflife.org
scripts/fetch-data.sh   # data from the Docker image; uses docker, or skopeo as a fallback
npm ci
npm run dev             # or: npm run build && npm run preview
```

`npm run check` type-checks the templates, and `npm run validate` lints the built HTML in `dist/`.

# Sponsorship

Please consider sponsoring the maintenance of fishtreeoflife.org via [GitHub Sponsors](https://github.com/sponsors/jonchang).
