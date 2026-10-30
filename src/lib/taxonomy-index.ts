// The /taxonomy/ index (backbone trees and rank tables) and the
// /downloads/taxonomy/ list, computed at build time. Ported from the Jekyll
// _includes/monophyly-tree.html, _includes/taxonomy-table.html and
// downloads/taxonomy.md.

import { monophyly, taxaOf, type BackboneRank, type Rank } from './data.ts';
import { filePath, rubyFloatToS, taxonUrl } from './format.ts';

/** Coordinates to 3 decimals: plenty at this scale, and shorter HTML. */
const round = (v: number) => Math.round(v * 1000) / 1000;

export interface BackboneOptions {
  /** Height of one tip row. */
  yscale?: number;
  /** Room for the tip labels to the right of the tree. */
  tiplabelOffset?: number;
  fontsize?: number;
}

export interface BackboneLine {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface BackboneTip {
  /** Label as shown: the taxon name, with * if not monophyletic. */
  label: string;
  /** null if the site has no page for this taxon. */
  url: string | null;
  x: number;
  y: number;
  /** Clade triangle as an SVG points list, or null. */
  triangle: string | null;
  color: string;
}

export interface Backbone {
  viewBox: string;
  fontsize: number;
  /** Vertical offset that centers a label on its row. */
  dy: number;
  lines: BackboneLine[];
  tips: BackboneTip[];
}

/** The backbone tree of orders or families, as SVG primitives. */
export function backbone(rank: BackboneRank, options: BackboneOptions = {}): Backbone {
  const { yscale = 16, tiplabelOffset = 150, fontsize = 10 } = options;
  const yoffset = Math.floor(yscale / 4);
  const treeheightFudge = 20;
  const { tips, segments } = monophyly(rank);
  const taxa = taxaOf(rank);

  const xmax = Math.max(...tips.map((t) => t.x));
  const width = xmax + tiplabelOffset;
  const height = tips.length * yscale + treeheightFudge;

  return {
    viewBox: `-10 -10 ${round(width)} ${round(height)}`,
    fontsize,
    dy: yoffset,
    lines: segments.map((s) => ({
      x1: round(s.x),
      x2: round(s.xend),
      y1: round(s.y * yscale),
      y2: round(s.yend * yscale),
    })),
    tips: tips.map((t) => {
      const y = t.y * yscale;
      return {
        label: t.Monophyly === 'No' ? `${t.label}*` : t.label,
        url: taxa.has(t.label) ? taxonUrl(rank, t.label) : null,
        x: round(t.x),
        y: round(y),
        triangle:
          t.depth === undefined
            ? null
            : `${round(t.depth)} ${round(y)} ${round(t.x)} ${round(y + yoffset)} ${round(t.x)} ${round(y - yoffset)}`,
        color: t.color,
      };
    }),
  };
}

export interface RankTableRow {
  name: string;
  url: string;
  sampled: number;
  total: number;
  /** Mean rates as printed by the Jekyll site, or "" if not available. */
  bammLambda: string;
  dr: string;
}

const rate = (v: number | string) => (typeof v === 'number' ? rubyFloatToS(v) : '');

/** One row per taxon of a rank, sorted by name as Jekyll sorted the stub files. */
export function rankTable(rank: Rank): RankTableRow[] {
  return [...taxaOf(rank)]
    .sort(([a], [b]) => {
      const fa = `${a}.md`;
      const fb = `${b}.md`;
      return fa < fb ? -1 : fa > fb ? 1 : 0;
    })
    .map(([name, t]) => ({
      name,
      url: taxonUrl(rank, name),
      sampled: t.sampled_species.length,
      total: t.species.length,
      bammLambda: rate(t.mean_bamm_lambda),
      dr: rate(t.mean_dr),
    }));
}

export interface FamilyDownload {
  name: string;
  chronogram: string;
  phylogram: string;
  /** Trees of the family's most recent common ancestor, when it is not monophyletic. */
  mrca: { chronogram: string; phylogram: string } | null;
}

/** Families with trees, in data file order (/downloads/taxonomy/). */
export function familyDownloads(): FamilyDownload[] {
  return [...taxaOf('family')].flatMap(([name, t]): FamilyDownload[] => {
    if (!t.chronogram) return [];
    return [
      {
        name,
        chronogram: filePath(t.chronogram),
        phylogram: filePath(t.phylogram ?? ''),
        mrca: t.chronogram_mrca
          ? { chronogram: filePath(t.chronogram_mrca), phylogram: filePath(t.phylogram_mrca ?? '') }
          : null,
      },
    ];
  });
}
