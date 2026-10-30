// The fossil calibration pages (/fossils/{slug}/) and the fossils index,
// computed at build time. Ported from the Jekyll _layouts/fossils.html and
// fossils.md.

import { extraCalibrations, fossilData, fossilStubs, ranks, taxaOf, type FossilRecord } from './data.ts';
import { capitalize, fossilUrl, taxonUrl } from './format.ts';

/** One entry of a fossil's outgroup sequence. */
export type Outgroup =
  /** Another calibration on this site. */
  | { kind: 'fossil'; url: string; fossil: string; clade: string; min: string }
  /** A stem fossil listed in src/data/extra_data.csv. */
  | { kind: 'extra'; fossil: string; clade: string; min: string }
  /** Just the clade name. */
  | { kind: 'clade'; clade: string };

export interface FossilTaxon {
  /** Capitalized rank, e.g. "Order". */
  rankLabel: string;
  name: string;
  /** null if the site has no page for this taxon. */
  url: string | null;
}

export interface FossilPage {
  slug: string;
  title: string;
  description: string;
  url: string;
  /** The clade this fossil calibrates. */
  clade: string;
  min: string;
  /** Maximum age as shown (first five characters, as the Jekyll site did), or null if none. */
  max: string | null;
  authority: string;
  locality: string;
  ageAuthority: string;
  outgroups: Outgroup[];
  taxa: FossilTaxon[];
}

const isMissing = (value: string) => value === 'NA';

/** Ruby's String#split("\t"): trailing empty fields are dropped. */
function splitTabs(value: string): string[] {
  const parts = value === '' ? [] : value.split('\t');
  while (parts.length > 0 && parts[parts.length - 1] === '') parts.pop();
  return parts;
}

function outgroupsOf(record: FossilRecord): Outgroup[] {
  const fossils = fossilData();
  const extras = extraCalibrations();
  return splitTabs(record.outgroup_sequence).map((clade): Outgroup => {
    const og = fossils.find((f) => f.clade_pretty === clade);
    if (og) return { kind: 'fossil', url: fossilUrl(og.slug), fossil: og.fossil, clade: og.clade_pretty, min: og.min };
    const extra = extras.find((e) => e.clade === clade);
    if (extra) return { kind: 'extra', fossil: extra.fossil, clade, min: extra.min };
    return { kind: 'clade', clade };
  });
}

function taxaOfFossil(record: FossilRecord): FossilTaxon[] {
  return ranks().flatMap((rank) => {
    const name = record.taxa[rank] ?? 'NA';
    if (isMissing(name)) return [];
    return [{ rankLabel: capitalize(rank), name, url: taxaOf(rank).has(name) ? taxonUrl(rank, name) : null }];
  });
}

let pagesCache: FossilPage[] | undefined;

/** One page per fossil stub, at the slug its front matter gives. */
export function fossilPages(): readonly FossilPage[] {
  if (pagesCache) return pagesCache;
  const records = fossilData();
  pagesCache = fossilStubs().map((stub) => {
    const record = records.find((r) => r.fossil === stub.title);
    if (!record) throw new Error(`Fossil page ${stub.slug}: no row for "${stub.title}" in fossil_data.csv`);
    return {
      slug: stub.slug,
      title: stub.title,
      description: stub.description,
      url: fossilUrl(stub.slug),
      clade: record.clade_pretty,
      min: record.min,
      max: isMissing(record.max) ? null : record.max.slice(0, 5),
      authority: record.authority,
      locality: record.locality,
      ageAuthority: record.age_authority,
      outgroups: outgroupsOf(record),
      taxa: taxaOfFossil(record),
    };
  });
  return pagesCache;
}

/** A row of the fossils index: a table row and a circle on the vertical tree. */
export interface FossilIndexRow {
  idx: string;
  clade: string;
  fossil: string;
  min: string;
  url: string;
  /** Circle center in the 2820x8460 tree image's pixels. */
  cx: number;
  cy: number;
}

export function fossilIndex(): readonly FossilIndexRow[] {
  return fossilData().map((f) => {
    const cx = Number(f.devx);
    const cy = Number(f.devy);
    if (Number.isNaN(cx) || Number.isNaN(cy)) throw new Error(`fossil_data.csv: ${f.fossil} has no tree position`);
    return { idx: f.idx, clade: f.clade_pretty, fossil: f.fossil, min: f.min, url: fossilUrl(f.slug), cx, cy };
  });
}
