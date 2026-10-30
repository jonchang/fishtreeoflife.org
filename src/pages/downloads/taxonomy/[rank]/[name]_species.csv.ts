// The species list of each taxon as CSV, at
// /downloads/taxonomy/{rank}/{name}_species.csv (the name as is, spaces
// included, as the Jekyll site's Rakefile wrote it). The other files in that
// directory come from the data image through public/.
import type { APIRoute, GetStaticPaths } from 'astro';
import { speciesCsv, taxonPages } from '../../../../lib/summary';

export const getStaticPaths = (() =>
  taxonPages().map((page) => ({ params: { rank: page.rank, name: page.name } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const { rank, name } = params;
  if (!rank || !name) throw new Error('species CSV: missing rank or name');
  return new Response(speciesCsv(rank, name), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
};
