---
layout: page
title: Taxonomy
description: Taxonomy of ray-finned fishes (Actinopterygii) based on a comprehensive fish phylogeny, the Phylogenetic Fish Classification
---

<style>
.autosize {
    font-size: calc(1vw + 1vmin);
}
</style>

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

## Downloads

We have a limited number of skeletal phylogenies available for download, using exemplars for each rank. Some groups may be missing or incorrectly placed, as it is not entirely clear which species serves as the best representative for a given taxon when that taxon is non-monophyletic. These phylogenies should therefore only be used for a high-level, approximate visualization of our result. They are **not intended** to be used for actual comparative analyses.

* [Skeletal order phylogeny]({% link downloads/taxonomy/order_skeletal.tre %})
* [Skeletal family phylogeny]({% link downloads/taxonomy/family_skeletal.tre %})
