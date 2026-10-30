// html-validate config for `npm run validate` (checks dist/**/*.html).
// This is the JS form of .htmlvalidate.json: JSON cannot hold the comments
// below, and html-validate's schema rejects "$comment" keys.
/** @type {import('html-validate').ConfigData} */
export default {
  extends: ['html-validate:recommended'],
  rules: {
    // Markdown tables with aligned columns (|:---|---:|) put
    // style="text-align: ..." on their cells, e.g. in methods.md. Allow that
    // one property on top of the rule's default ("display").
    'no-inline-style': ['error', { allowedProperties: ['display', 'text-align'] }],

    // The 70-character limit is a search-snippet heuristic, not an HTML error.
    // Page titles come from the content: the 2018 update page is titled after
    // its paper (129 characters with the site name).
    'long-title': 'off',
  },
};
