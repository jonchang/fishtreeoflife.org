// Everything a taxon page shows, computed at build time. A port of the Jekyll
// site's Rakefile `make_summary` (and of the logic in _layouts/rank.html).

import {
  familiarSpecies,
  fossilCalibrations,
  ranks,
  taxaOf,
  taxonomy,
  type FossilCalibration,
  type Rank,
  type Taxon,
} from './data.ts';
import { csvLine } from './csv.ts';
import {
  capitalize,
  defaultSlug,
  filePath,
  fmtDr,
  fmtInt,
  fmtPct,
  fossilUrl,
  prettySlug,
  rubyFloatToS,
  rubyRound,
  rubySum,
  taxonUrl,
  uriEscape,
} from './format.ts';

/**
 * Taxa with more species than this get no inline species list; the list is
 * linked as a CSV file instead.
 */
export const INLINE_SPECIES_LIMIT = 3000;

export interface TaxonLink {
  name: string;
  url: string;
}

/** Taxa of one rank, e.g. a step of the lineage or a group of enclosed taxa. */
export interface RankGroup {
  rank: Rank;
  /** Capitalized rank, e.g. "Subclass". */
  label: string;
  taxa: TaxonLink[];
}

/** A row of the Contents table: an immediate child taxon, or the unassigned rest. */
export interface ChildRow {
  rank: Rank;
  /** Capitalized rank, e.g. "Series". */
  rankLabel: string;
  /** null for the "Unassigned at {rank}" row. */
  name: string | null;
  url: string | null;
  /** Not recovered as monophyletic (it has rogue species). */
  nonmono: boolean;
  /** Mean tip rate with two decimals, or "". */
  meanDr: string;
  sampled: string;
  total: string;
  /** Sampled share, 0 to 1, rounded to 4 decimals and printed as Ruby did. */
  frac: string;
  pct: string;
}

export interface GenusRow {
  genus: string;
  sampled: string;
  total: string;
}

export interface FamiliarRow {
  species: string;
  commonName: string;
  sampled: boolean;
}

export interface GeneRow {
  gene: string;
  count: string;
  pct: string;
}

export interface FossilRow {
  clade: string;
  fossil: string;
  min: string;
  url: string;
}

export type Phylogenies =
  | { kind: 'monophyletic'; phylogram: string; chronogram: string }
  | {
      kind: 'paraphyletic';
      rogues: number;
      chronogram: string;
      chronogramMrca: string;
      phylogram: string;
      phylogramMrca: string;
    }
  | { kind: 'none'; reason: string };

export interface Sequences {
  phylip: string;
  nexus: string;
  /** The Nexus file also holds the phylogeny. */
  nexusHasTree: boolean;
}

/** Everything the taxon page at /taxonomy/{rank}/{slug}/ shows. */
export interface TaxonPage {
  rank: Rank;
  name: string;
  /** URL path segment, e.g. "Incertae-sedis-in-Carangaria". */
  slug: string;
  url: string;
  description: string;
  /** Higher taxa, from the top rank down; empty for top-level taxa. */
  lineage: RankGroup[];
  headline: string;
  nSampled: string;
  childRank: Rank | null;
  /** null for families, which have no lower ranks. */
  children: ChildRow[] | null;
  anyNonmono: boolean;
  genera: GenusRow[];
  familiar: FamiliarRow[];
  /** The species list is shown on the page (otherwise only as CSV). */
  inlineList: boolean;
  sampledSpecies: readonly string[];
  unsampledSpecies: readonly string[];
  /** null when no species is sampled. */
  genes: GeneRow[] | null;
  enclosed: RankGroup[];
  enclosedSummary: string;
  fossils: FossilRow[];
  /** data: URL with the calibrations as JSON, or null when there are none. */
  fossilDataUrl: string | null;
  apiUrl: string;
  /** URL of the species CSV. */
  csvUrl: string;
  /** Site-relative path of the species CSV, as the Rakefile wrote it. */
  csvPath: string;
  phylogenies: Phylogenies;
  sequences: Sequences | null;
}

/** "subclass" -> "subclasses", "family" -> "families"; "series" stays (Rakefile rank_plural). */
function rankPlural(rank: Rank, n: number): string {
  if (n === 1 || rank === 'series') return rank;
  if (rank === 'family') return 'families';
  if (rank.endsWith('class')) return `${rank}es`;
  return `${rank}s`;
}

function taxonLinks(rank: Rank, names: readonly string[]): RankGroup {
  return { rank, label: capitalize(rank), taxa: names.map((name) => ({ name, url: taxonUrl(rank, name) })) };
}

/** Byte-order comparison, as Ruby sorts strings. */
function byteCompare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Ruby's first word of a species name (String#split(" ").first). */
function genusOf(species: string): string {
  return species.trim().split(/\s+/)[0] ?? '';
}

/** Species -> taxon name, for each rank. A species listed twice keeps the last taxon, as in Ruby. */
let speciesIndexCache: Map<Rank, Map<string, string>> | undefined;
function speciesIndex(): Map<Rank, Map<string, string>> {
  if (speciesIndexCache) return speciesIndexCache;
  speciesIndexCache = new Map();
  for (const [rank, taxa] of taxonomy()) {
    const m = new Map<string, string>();
    for (const [name, taxon] of taxa) for (const sp of taxon.species) m.set(sp, name);
    speciesIndexCache.set(rank, m);
  }
  return speciesIndexCache;
}

/** Ruby's Enumerable#group_by: groups in order of first appearance. */
function groupBy<T, K>(items: readonly T[], key: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const g = groups.get(k);
    if (g) g.push(item);
    else groups.set(k, [item]);
  }
  return groups;
}

interface RawChild {
  name: string | null;
  n: number;
  ns: number;
  nonmono: boolean;
  meanDr: string;
}

/**
 * The immediate children: the first lower rank that splits this taxon's
 * species into two or more taxa, or into one taxon plus unassigned species.
 * If no rank splits it, fall back to its single family.
 */
function children(taxon: Taxon, below: readonly Rank[], sampled: ReadonlySet<string>) {
  const index = speciesIndex();
  const lookup = (rank: Rank) => {
    const m = index.get(rank);
    if (!m) throw new Error(`No species index for ${rank}`);
    return (sp: string) => m.get(sp) ?? null;
  };

  let childRank: Rank | null = null;
  let groups: Map<string | null, string[]> | null = null;
  for (const r of below) {
    const g = groupBy(taxon.species, lookup(r));
    const named = [...g.keys()].filter((k) => k !== null).length;
    if (named >= 2 || (named === 1 && g.has(null))) {
      childRank = r;
      groups = g;
      break;
    }
  }
  if (childRank === null || groups === null) {
    childRank = 'family';
    groups = groupBy(taxon.species, lookup('family'));
  }

  const rank = childRank;
  const rows: RawChild[] = [...groups].map(([cname, sps]) => {
    const ns = sps.filter((sp) => sampled.has(sp)).length;
    if (cname !== null) {
      const cv = taxaOf(rank).get(cname);
      if (!cv) throw new Error(`${rank} ${cname} is not in the taxonomy`);
      return { name: cname, n: sps.length, ns, nonmono: (cv.rogues ?? []).length > 0, meanDr: fmtDr(cv.mean_dr) };
    }
    const rates = sps.map((sp) => taxon.tiprates_dr[sp]).filter((r): r is number => r !== undefined && r !== null);
    return {
      name: null,
      n: sps.length,
      ns,
      nonmono: false,
      meanDr: rates.length === 0 ? '' : fmtDr(rubySum(rates) / rates.length),
    };
  });

  // Largest first; the unassigned remainder always goes last.
  rows.sort(
    (a, b) =>
      (a.name === null ? 1 : 0) - (b.name === null ? 1 : 0) || b.n - a.n || byteCompare(a.name ?? '', b.name ?? ''),
  );

  const out: ChildRow[] = rows.map((r) => ({
    rank,
    rankLabel: capitalize(rank),
    name: r.name,
    url: r.name === null ? null : taxonUrl(rank, r.name),
    nonmono: r.nonmono,
    meanDr: r.meanDr,
    sampled: fmtInt(r.ns),
    total: fmtInt(r.n),
    frac: rubyFloatToS(rubyRound(r.ns / r.n, 4)),
    pct: fmtPct(r.ns, r.n),
  }));
  return { childRank: rank, rows: out };
}

/** Familiar species, sorted as Ruby sorts [species, common_name] pairs. */
let familiarSorted: { species: string; commonName: string }[] | undefined;
function familiarList() {
  familiarSorted ??= familiarSpecies()
    .map((f) => ({ species: f.species, commonName: f.common_name }))
    .sort((a, b) => byteCompare(a.species, b.species) || byteCompare(a.commonName, b.commonName));
  return familiarSorted;
}

/** Calibrations whose two defining species are both sampled in this taxon. */
function fossilsOf(taxon: Taxon): FossilCalibration[] {
  const sampled = new Set(taxon.sampled_species.map((sp) => sp.replaceAll(' ', '_')));
  return fossilCalibrations().filter((row) => sampled.has(row.left) && sampled.has(row.right));
}

function phylogeniesOf(rank: Rank, taxon: Taxon): Phylogenies {
  if (taxon.chronogram) {
    if ((taxon.rogues ?? []).length === 0) {
      return { kind: 'monophyletic', phylogram: filePath(taxon.phylogram ?? ''), chronogram: filePath(taxon.chronogram) };
    }
    return {
      kind: 'paraphyletic',
      rogues: (taxon.rogues ?? []).length,
      chronogram: filePath(taxon.chronogram),
      chronogramMrca: filePath(taxon.chronogram_mrca ?? ''),
      phylogram: filePath(taxon.phylogram ?? ''),
      phylogramMrca: filePath(taxon.phylogram_mrca ?? ''),
    };
  }
  switch (taxon.sampled_species.length) {
    case 1:
      return { kind: 'none', reason: `${rank} is monotypic` };
    case 2:
      return { kind: 'none', reason: 'too few species' };
    default:
      return { kind: 'none', reason: 'too few sampled species' };
  }
}

/** Site-relative path of a taxon's species CSV (no leading slash). */
export function speciesCsvPath(rank: Rank, name: string): string {
  return `downloads/taxonomy/${rank}/${name}_species.csv`;
}

function buildPage(rank: Rank, ri: number, name: string, taxon: Taxon): TaxonPage {
  const allRanks = ranks();
  const above = allRanks.slice(0, ri);
  const below = allRanks.slice(ri + 1);
  const species = taxon.species;
  const sampled = new Set(taxon.sampled_species);
  const n = species.length;
  const ns = sampled.size;
  const index = speciesIndex();

  const groupsFor = (rs: readonly Rank[]) =>
    rs.flatMap((r) => {
      const names = taxon.taxonomy[r] ?? [];
      return names.length > 0 ? [taxonLinks(r, names)] : [];
    });
  const lineage = groupsFor(above);
  const enclosed = groupsFor(below);

  const kids = below.length > 0 ? children(taxon, below, sampled) : null;

  // A. Largest genera
  const genera = new Map<string, [number, number]>();
  for (const sp of species) {
    const g = genusOf(sp);
    const counts = genera.get(g) ?? [0, 0];
    counts[0] += 1;
    if (sampled.has(sp)) counts[1] += 1;
    genera.set(g, counts);
  }
  const largestGenera = [...genera]
    .sort(([ga, [ta]], [gb, [tb]]) => tb - ta || byteCompare(ga, gb))
    .slice(0, 5)
    .map(([genus, [total, gs]]) => ({ genus, sampled: fmtInt(gs), total: fmtInt(total) }));

  // B. Familiar species
  const rankIndex = index.get(rank);
  const familiar = familiarList()
    .filter((f) => rankIndex?.get(f.species) === name)
    .map((f) => ({ ...f, sampled: sampled.has(f.species) }));

  // Gene coverage, as a share of this taxon's sampled species
  let genes: GeneRow[] | null = null;
  if (ns > 0) {
    const sampling = Array.isArray(taxon.gene_sampling) ? [] : Object.entries(taxon.gene_sampling);
    genes = sampling
      .map(([gene, list]): [string, number] => [gene, list.length])
      .sort(([ga, ca], [gb, cb]) => cb - ca || byteCompare(ga, gb))
      .map(([gene, c]) => ({ gene, count: fmtInt(c), pct: fmtPct(c, ns) }));
  }

  const fossils = fossilsOf(taxon);
  const csvPath = speciesCsvPath(rank, name);

  return {
    rank,
    name,
    slug: prettySlug(name),
    url: taxonUrl(rank, name),
    description: `Taxonomy and phylogeny of ${name}, a ${rank} of ray-finned fishes. Based on the Phylogenetic Fish Classification. Also includes species checklists, fossil calibrations, DNA sequences.`,
    lineage,
    headline: `${fmtInt(ns)} of ${fmtInt(n)} species (${fmtPct(ns, n)}) ${ns === 1 ? 'has' : 'have'} genetic data.`,
    nSampled: fmtInt(ns),
    childRank: kids?.childRank ?? null,
    children: kids?.rows ?? null,
    anyNonmono: kids?.rows.some((r) => r.nonmono) ?? false,
    genera: largestGenera,
    familiar,
    inlineList: n <= INLINE_SPECIES_LIMIT,
    sampledSpecies: taxon.sampled_species,
    unsampledSpecies: taxon.unsampled_species,
    genes,
    enclosed,
    enclosedSummary: enclosed.map((g) => `${fmtInt(g.taxa.length)} ${rankPlural(g.rank, g.taxa.length)}`).join(', '),
    fossils: fossils.map((f) => ({ clade: f.clade, fossil: f.fossil, min: f.min, url: fossilUrl(defaultSlug(f.fossil)) })),
    // The calibrations as JSON, keys in the CSV's column order, as Liquid's jsonify wrote them.
    fossilDataUrl: fossils.length > 0 ? `data:application/json,${uriEscape(JSON.stringify(fossils))}` : null,
    apiUrl: filePath(`api/taxonomy/${rank}/${name}.json`),
    csvUrl: filePath(csvPath),
    csvPath,
    phylogenies: phylogeniesOf(rank, taxon),
    sequences: taxon.matrix_phylip
      ? {
          phylip: filePath(taxon.matrix_phylip),
          nexus: filePath(taxon.matrix_nexus ?? ''),
          nexusHasTree: Boolean(taxon.chronogram),
        }
      : null,
  };
}

let pagesCache: TaxonPage[] | undefined;

/** All taxon pages, by rank (highest first) and then in data file order. */
export function taxonPages(): readonly TaxonPage[] {
  if (pagesCache) return pagesCache;
  const pages: TaxonPage[] = [];
  ranks().forEach((rank, ri) => {
    for (const [name, taxon] of taxaOf(rank)) pages.push(buildPage(rank, ri, name, taxon));
  });
  // Two names that slugify alike would overwrite each other's page.
  const seen = new Set<string>();
  for (const p of pages) {
    if (seen.has(p.url)) throw new Error(`Two taxa share the URL ${p.url}`);
    seen.add(p.url);
  }
  pagesCache = pages;
  return pages;
}

/**
 * The species list of a taxon as CSV (species, genus, family, order, sampled),
 * sorted by species, as the Rakefile wrote downloads/taxonomy/{rank}/{name}_species.csv.
 */
export function speciesCsv(rank: Rank, name: string): string {
  const taxon = taxaOf(rank).get(name);
  if (!taxon) throw new Error(`No ${rank} named ${name}`);
  const index = speciesIndex();
  const family = index.get('family');
  const order = index.get('order');
  const sampled = new Set(taxon.sampled_species);
  let out = csvLine(['species', 'genus', 'family', 'order', 'sampled']);
  for (const sp of [...taxon.species].sort(byteCompare)) {
    out += csvLine([sp, genusOf(sp), family?.get(sp) ?? null, order?.get(sp) ?? null, sampled.has(sp) ? 'yes' : 'no']);
  }
  return out;
}
