---
layout: page
title: Taxonomy
---

<style>
.autosize {
    font-size: calc(1vw + 1vmin);
}
</style>

* A markdown unordered list which will be replaced with the ToC, excluding the "Contents header" from above
{:toc}

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

## Orders

<table>
<tbody>
<tr><th>Order</th><th>Sampled richness</th><th>Total richness</th><th>Stats</th></tr>
{% for order in site.order %}
<tr>
<td><a href="{{ order.url | relative_url }}">{{ order.title }}</a></td>
<td>{{ site.data.taxonomy.order[order.title].sampled_species | size }}</td>
<td>{{ site.data.taxonomy.order[order.title].species | size }}</td>
<td></td>
</tr>
{% endfor %}
</tbody>
</table>


## Families

<table>
<tbody>
<tr><th>Family</th><th>Sampled richness</th><th>Total richness</th><th>Stats</th></tr>
{% for family in site.family %}
<tr>
<td><a href="{{ family.url | relative_url }}">{{ family.title }}</a></td>
<td>{{ site.data.taxonomy.family[family.title].sampled_species | size }}</td>
<td>{{ site.data.taxonomy.family[family.title].species | size }}</td>
<td></td>
</tr>
{% endfor %}
</tbody>
</table>
