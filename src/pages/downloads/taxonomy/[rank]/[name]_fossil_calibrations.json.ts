// The fossil calibrations of each taxon that has any, at
// /downloads/taxonomy/{rank}/{name}_fossil_calibrations.json.
import type { APIRoute, GetStaticPaths } from 'astro';
import { fossilJson, taxonPages } from '../../../../lib/summary';

export const getStaticPaths = (() =>
  taxonPages()
    .filter((page) => page.fossilDataUrl !== null)
    .map((page) => ({ params: { rank: page.rank, name: page.name } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const { rank, name } = params;
  if (!rank || !name) throw new Error('fossil JSON: missing rank or name');
  return new Response(fossilJson(rank, name), { headers: { 'Content-Type': 'application/json' } });
};
