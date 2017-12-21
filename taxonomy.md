---
layout: page
title: Taxonomy
---
<style>
.autosize {
    font-size: calc(1vw + 1vmin);
}
</style>

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

## Families

<table>
<tbody>
<tr><th>Family</th><th>Sampled richness</th><th>Total richness</th><th></th></tr>
{% for family in site.family %}
<tr>
<td><a href="{{ family.url | relative_url }}">{{ family.title }}</a></td>
<td>{{ site.data.family[family.title] | where:"sampled","1" | size }}</td>
<td>{{ site.data.family[family.title] | size }}</td>
<td></td>
</tr>
{% endfor %}
</tbody>
</table>

