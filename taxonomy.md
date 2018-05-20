---
layout: page
title: Taxonomy
---

<style>
.autosize {
    font-size: calc(1vw + 1vmin);
}
</style>

* TOC
{:toc}

## Orders

<!--
- PFC taxonomy
- Compare to CoL/EToL

Tax page
- Picture
- Name
- Stats
- <s>Fossil calibrations</s>
- Outgroups
- <s>Genetic tree</s>
- Full distribution
- <s>Download sequences</s>
- <s>Download calibration info</s>
- Download BEAST/RAXML/TREEPL/mcmctree files
- API integration: EOL/fishbase
-->

### Backbone phylogeny

{% include monophyly-tree.html rank="order" df=site.data.monophyly.order_data svg=site.data.monophyly.order_svg tiplabel_offset=140 fontsize=9 %}

Note: * indicates that this order was not recovered as monophyletic in our phylogenetic analysis.

### Alphabetical

{% include taxonomy-table.html rank="order" %}


## Families

### Backbone phylogeny

{% include monophyly-tree.html rank="family" df=site.data.monophyly.family_data svg=site.data.monophyly.family_svg tiplabel_offset=120 fontsize=9 %}

Note: * indicates that this family was not recovered as monophyletic in our phylogenetic analysis.

### Alphabetical

{% include taxonomy-table.html rank="family" %}
