// @ts-check
import { copyFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * @astrojs/sitemap writes sitemap-index.xml, but robots.txt and search
 * consoles already point at /sitemap.xml. Publish the index under that name
 * too. Runs after the sitemap integration (build:done hooks run in order).
 * @type {import('astro').AstroIntegration}
 */
const sitemapAlias = {
  name: 'sitemap-xml-alias',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      await copyFile(new URL('sitemap-index.xml', dir), new URL('sitemap.xml', dir));
    },
  },
};

export default defineConfig({
  site: 'https://fishtreeoflife.org',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  // No client-side JS: no prefetch script, no view transitions.
  prefetch: false,
  integrations: [sitemap(), sitemapAlias],
});
