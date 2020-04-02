---
title: Downloads by taxonomic rank
layout: page
description: Download sequence and phylogenetic data on a rank basis for the Fish Tree of Life
---

{% assign families = site.data.family %}


<ul>
{% for family_hash in site.data.family %}
{% assign family = family_hash[1] %}
{% if family.chronogram %}
<li>{{ family.family[0] }}
<ul>
<li><a href="{{ family.chronogram | relative_url }}">Chronogram</a></li>
<li><a href="{{ family.phylogram | relative_url }}">Phylogram</a></li>
{% if family.chronogram_mrca %}
<li><a href="{{ family.chronogram_mrca | relative_url }}">MRCA Chronogram</a></li>
<li><a href="{{ family.phylogram_mrca | relative_url }}">MRCA Phylogram</a></li>
{% endif %}
</ul>
</li>
{% endif %}
{% endfor %}
</ul>

## Downloads

We have a limited number of skeletal phylogenies available for download, using exemplars for each rank. Some groups may be missing or incorrectly placed, as it is difficult to determine via an algorithm which species best represents where a given taxon when those taxa are non-monophyletic. These phylogenies should only be used for a high-level, approximate visualization of our result. They are **not intended** to be used for actual comparative analyses.

* [Skeletal order phylogeny]({% link downloads/taxonomy/order_skeletal.tre %})
* [Skeletal family phylogeny]({% link downloads/taxonomy/family_skeletal.tre %})
