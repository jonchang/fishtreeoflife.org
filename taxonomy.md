---
layout: page
title: Taxonomy
description: The new Phylogenetic Fish Classification based on the Fish Tree of Life, with species checklists, phylogenies, DNA sequences and fossil calibrations
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

Orders with * were not recovered as monophyletic in our phylogenetic analysis. Clade triangles are colored by their species richness.

### Alphabetical

{% include taxonomy-table.html rank="order" %}


## Families

### Backbone phylogeny

{% include monophyly-tree.html rank="family" df=site.data.monophyly.family_data svg=site.data.monophyly.family_svg tiplabel_offset=120 fontsize=9 %}

Families with * were not recovered as monophyletic in our phylogenetic analysis. Clade triangles are colored by their species richness.

### Alphabetical

{% include taxonomy-table.html rank="family" %}
