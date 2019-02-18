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
