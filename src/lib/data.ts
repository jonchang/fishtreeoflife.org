// The only module that knows where the site's build data lives and what it
// looks like. Everything is read once, at build time, and cached.
//
//   data/_data/, data/_fossils/  from the fishtreeoflife-docker data image
//                                (scripts/fetch-data.sh; gitignored)
//   src/data/                    small curated files tracked in this repo
//
// Plain Node (fs only, explicit .ts imports), so build scripts can import it
// too, e.g. `node scripts/x.mjs` with Node >= 23 type stripping.

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseCsvRecords } from './csv.ts';

/** Paths are relative to the project root, which is where astro and npm scripts run. */
const ROOT = process.cwd();
const IMAGE_DATA = path.join(ROOT, 'data', '_data');
const IMAGE_FOSSILS = path.join(ROOT, 'data', '_fossils');
const TRACKED = path.join(ROOT, 'src', 'data');

function read(file: string): string {
  try {
    return readFileSync(file, 'utf8');
  } catch (err) {
    const hint = file.startsWith(path.join(ROOT, 'data'))
      ? ' (run scripts/fetch-data.sh to fetch the build data)'
      : '';
    throw new Error(`Cannot read ${path.relative(ROOT, file)}${hint}`, { cause: err });
  }
}

function readJson(file: string): unknown {
  return JSON.parse(read(file));
}

/** Caches the result of a zero-argument loader. */
function once<T>(load: () => T): () => T {
  let value: { v: T } | undefined;
  return () => (value ??= { v: load() }).v;
}

function num(value: string, source: string): number {
  const n = Number(value);
  if (value.trim() === '' || Number.isNaN(n)) throw new Error(`${source}: not a number: ${JSON.stringify(value)}`);
  return n;
}

// ---------------------------------------------------------------------------
// Ranks and taxonomy

/** A taxonomic rank name, one of ranks() ("class" ... "family"). */
export type Rank = string;

/** The taxonomic ranks from highest to lowest (src/data/ranks.json). */
export const ranks = once((): readonly Rank[] => {
  const value = readJson(path.join(TRACKED, 'ranks.json'));
  if (!Array.isArray(value) || !value.every((r) => typeof r === 'string')) {
    throw new Error('src/data/ranks.json: expected an array of rank names');
  }
  return Object.freeze(value as Rank[]);
});

/** One taxon in data/_data/taxonomy/{rank}.json. Species names use spaces. */
export interface Taxon {
  species: string[];
  sampled_species: string[];
  unsampled_species: string[];
  /** Gene -> sampled species with data for it. An empty array when nothing is sampled. */
  gene_sampling: Record<string, string[]> | [];
  /** Rank -> names of the taxa at that rank that this taxon belongs to or encloses. */
  taxonomy: Record<Rank, string[] | undefined>;
  tiprates_dr: Record<string, number>;
  tiprates_bamm_lambda: Record<string, number>;
  tiprates_bamm_mu: Record<string, number>;
  /** "NaN" when no species is sampled. */
  mean_dr: number | 'NaN';
  mean_bamm_lambda: number | 'NaN';
  mean_bamm_mu: number | 'NaN';
  // Site-relative download paths (no leading slash); absent when not available.
  matrix_phylip?: string;
  matrix_nexus?: string;
  chronogram?: string;
  phylogram?: string;
  chronogram_mrca?: string;
  phylogram_mrca?: string;
  /** Species that made the taxon paraphyletic; present when there is a chronogram. */
  rogues?: string[];
}

function loadRank(rank: Rank): ReadonlyMap<string, Taxon> {
  const file = path.join(IMAGE_DATA, 'taxonomy', `${rank}.json`);
  const value = readJson(file);
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${path.relative(ROOT, file)}: expected an object of taxa`);
  }
  const map = new Map<string, Taxon>();
  for (const [name, taxon] of Object.entries(value as Record<string, Taxon>)) {
    if (!Array.isArray(taxon.species) || !Array.isArray(taxon.sampled_species) || !taxon.taxonomy) {
      throw new Error(`${path.relative(ROOT, file)}: ${name} is missing species or taxonomy`);
    }
    // The Jekyll site flagged this as ERROR_ERROR_ERROR in the taxonomy table.
    if (taxon.species.length === 0) throw new Error(`${path.relative(ROOT, file)}: ${name} has no species`);
    map.set(name, taxon);
  }
  return map;
}

/** All taxa, by rank (in ranks() order) and then by name (in file order). */
export const taxonomy = once((): ReadonlyMap<Rank, ReadonlyMap<string, Taxon>> => {
  return new Map(ranks().map((rank) => [rank, loadRank(rank)]));
});

/** The taxa of one rank, by name. */
export function taxaOf(rank: Rank): ReadonlyMap<string, Taxon> {
  const taxa = taxonomy().get(rank);
  if (!taxa) throw new Error(`Unknown rank: ${rank}`);
  return taxa;
}

// ---------------------------------------------------------------------------
// Backbone trees (data/_data/monophyly/)

/** A tip of a backbone tree: one order or family, drawn as a triangle. */
export interface MonophylyTip {
  x: number;
  /** Row number; multiply by the row height. */
  y: number;
  label: string;
  Monophyly: 'Yes' | 'No' | 'Monotypic';
  /** x of the triangle's apex; absent for tips with no triangle. */
  depth?: number;
  N: number;
  richness: number;
  /** Triangle fill, colored by species richness. */
  color: string;
}

/** A line segment of a backbone tree, in the same units as the tips. */
export interface MonophylySegment {
  x: number;
  y: number;
  xend: number;
  yend: number;
}

export interface MonophylyTree {
  tips: readonly MonophylyTip[];
  segments: readonly MonophylySegment[];
}

export type BackboneRank = 'order' | 'family';

const loadMonophyly = (rank: BackboneRank) => (): MonophylyTree => {
  const tips = readJson(path.join(IMAGE_DATA, 'monophyly', `${rank}_data.json`));
  if (!Array.isArray(tips)) throw new Error(`monophyly/${rank}_data.json: expected an array`);
  const source = `monophyly/${rank}_svg.csv`;
  const segments = parseCsvRecords(read(path.join(IMAGE_DATA, 'monophyly', `${rank}_svg.csv`)), ['x', 'y', 'xend', 'yend'], source).map(
    (r) => ({ x: num(r.x, source), y: num(r.y, source), xend: num(r.xend, source), yend: num(r.yend, source) }),
  );
  return { tips: tips as MonophylyTip[], segments };
};

const monophylyLoaders: Record<BackboneRank, () => MonophylyTree> = {
  order: once(loadMonophyly('order')),
  family: once(loadMonophyly('family')),
};

/** The order or family backbone tree. */
export function monophyly(rank: BackboneRank): MonophylyTree {
  return monophylyLoaders[rank]();
}

// ---------------------------------------------------------------------------
// Fossils

const FOSSIL_COLUMNS = [
  'group',
  'left',
  'right',
  'min',
  'max',
  'node',
  'clade_pretty',
  'fossil',
  'authority',
  'locality',
  'outgroup_sequence',
  'age_authority',
  'idx',
  'x',
  'y',
  'devx',
  'devy',
  'slug',
] as const;

/**
 * One fossil calibration with its placement (data/_data/fossil_data.csv).
 * Values are as in the file; "NA" marks a missing value.
 */
export type FossilRecord = Record<(typeof FOSSIL_COLUMNS)[number], string> & {
  /** Rank -> the taxon at that rank this fossil may belong to, or "NA". */
  taxa: Record<Rank, string>;
};

/** All fossil calibrations, in file order (by index). */
export const fossilData = once((): readonly FossilRecord[] => {
  const source = 'data/_data/fossil_data.csv';
  const records = parseCsvRecords(read(path.join(IMAGE_DATA, 'fossil_data.csv')), [...FOSSIL_COLUMNS, ...ranks()], source);
  return records.map((r) => {
    const taxa: Record<Rank, string> = {};
    for (const rank of ranks()) taxa[rank] = r[rank];
    const record = { taxa } as FossilRecord;
    for (const c of FOSSIL_COLUMNS) record[c] = r[c];
    return record;
  });
});

const CALIBRATION_COLUMNS = [
  'clade',
  'fossil',
  'left',
  'right',
  'min',
  'max',
  'locality',
  'authority',
  'age_authority',
] as const;

/**
 * One fossil calibration as offered for download on the taxon pages
 * (data/_data/fossil_pretty.csv). `left` and `right` are two living species
 * (with underscores) whose common ancestor the fossil calibrates.
 */
export type FossilCalibration = Record<(typeof CALIBRATION_COLUMNS)[number], string>;

/** Calibrations in file order; the key order is the file's column order. */
export const fossilCalibrations = once((): readonly FossilCalibration[] => {
  const source = 'data/_data/fossil_pretty.csv';
  const records = parseCsvRecords(read(path.join(IMAGE_DATA, 'fossil_pretty.csv')), CALIBRATION_COLUMNS, source);
  // The taxon pages offer these records as JSON in the file's column order,
  // so pin the exact columns (records hold every header column, in order).
  if (Object.keys(records[0] ?? {}).join(',') !== CALIBRATION_COLUMNS.join(',')) {
    throw new Error(`${source}: expected exactly the columns ${CALIBRATION_COLUMNS.join(',')}`);
  }
  return records;
});

/** Front matter of a fossil page stub (data/_fossils/*.md). */
export interface FossilStub {
  title: string;
  /** URL segment: the page is /fossils/{slug}/. */
  slug: string;
  description: string;
}

/** Reads the `key: value` lines of a simple YAML front matter block. */
function frontMatter(text: string, source: string): Record<string, string> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\s*$/m.exec(text);
  if (!match?.[1]) throw new Error(`${source}: no front matter`);
  const out: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv?.[1]) throw new Error(`${source}: cannot read front matter line ${JSON.stringify(line)}`);
    let value = (kv[2] ?? '').trim();
    if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replaceAll("''", "'");
    } else if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      value = JSON.parse(value) as string;
    }
    out[kv[1]] = value;
  }
  return out;
}

/** The fossil page stubs, ordered by file number. */
export const fossilStubs = once((): readonly FossilStub[] => {
  const files = readdirSync(IMAGE_FOSSILS)
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || (a < b ? -1 : a > b ? 1 : 0));
  return files.map((f) => {
    const source = `data/_fossils/${f}`;
    const fm = frontMatter(read(path.join(IMAGE_FOSSILS, f)), source);
    const { title, slug, description } = fm;
    if (!title || !slug || !description) throw new Error(`${source}: needs title, slug and description`);
    return { title, slug, description };
  });
});

/** An outgroup fossil that is not one of the site's calibrations (src/data/extra_data.csv). */
export interface ExtraCalibration {
  min: string;
  clade: string;
  fossil: string;
}

export const extraCalibrations = once((): readonly ExtraCalibration[] =>
  parseCsvRecords(read(path.join(TRACKED, 'extra_data.csv')), ['min', 'clade', 'fossil'], 'src/data/extra_data.csv'),
);

// ---------------------------------------------------------------------------
// Home page and taxon page extras

/** A clickable family on the home page tree, in the 2687x1350 image's pixels. */
export interface Hotspot {
  taxa: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const frontPageHotspots = once((): readonly Hotspot[] => {
  const source = 'src/data/front_page_coords.csv';
  return parseCsvRecords(read(path.join(TRACKED, 'front_page_coords.csv')), ['taxa', 'x', 'y', 'w', 'h'], source).map(
    (r) => ({ taxa: r.taxa, x: num(r.x, source), y: num(r.y, source), w: num(r.w, source), h: num(r.h, source) }),
  );
});

/** A well-known or model species, listed on the taxon pages that contain it. */
export interface FamiliarSpecies {
  species: string;
  common_name: string;
}

export const familiarSpecies = once((): readonly FamiliarSpecies[] =>
  parseCsvRecords(
    read(path.join(TRACKED, 'familiar_species.csv')),
    ['species', 'common_name'],
    'src/data/familiar_species.csv',
  ),
);
