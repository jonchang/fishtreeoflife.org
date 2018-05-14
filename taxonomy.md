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

{% assign df = site.data.monophyly_order_data %}
{% assign svg = site.data.monophyly_order_svg %}

{% assign cap = df | sort: "y" | last %}
{% assign ymax = cap.y %}
{% assign cap = df | sort: "N" | last %}
{% assign Nmax = cap.N %}
{% assign yscale = 18 %}
{% assign yoffset = yscale | divided_by: 4 %}

<svg id="order_tree" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin meet" viewBox="-10 -10 600 1200" width="100%" height="120%">
{% for row in svg %}
<line x1="{{ row.x }}" x2="{{ row.xend }}" y1="{{ row.y | times: yscale }}" y2="{{ row.yend | times: yscale }}" stroke="black"/>
{% endfor %}
{% for row in df %}
<a xlink:href="{{ "/taxonomy/order/" | append: row.label | relative_url }}">
  <text x="{{ row.x }}" y="{{ row.y | times: yscale }}" dx="5" dy="{{ yoffset }}" font-size="12">{{ row.label }}{% if row.Monophyly == 'No' %}*{% endif %}</text>
{% if row.depth %}
<polygon points="{{ row.depth }} {{ row.y | times: yscale }} {{ row.x }} {{ row.y | times: yscale | plus: yoffset }} {{ row.x }} {{ row.y | times: yscale | minus: yoffset }}" stroke="black" fill="{{ row.color }}" stroke-width="1"/>
{% endif %}
</a>
{% endfor %}
</svg>

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


<div style="overflow-x:auto;">
<table>
<tbody>
<tr><th>Order</th><th>Sampled richness</th><th>Total richness</th></tr>
{% for order in site.order %}
<tr>
<td><a href="{{ order.url | relative_url }}">{{ order.title }}</a></td>
<td>{{ site.data.taxonomy.order[order.title].sampled_species | size }}</td>
<td>{{ site.data.taxonomy.order[order.title].species | size }}</td>
</tr>
{% endfor %}
</tbody>
</table>
</div>


## Families

<div style="overflow-x:auto;">
<table>
<tbody>
<tr><th>Family</th><th>Sampled richness</th><th>Total richness</th></tr>
{% for family in site.family %}
<tr>
<td><a href="{{ family.url | relative_url }}">{{ family.title }}</a></td>
<td>{{ site.data.taxonomy.family[family.title].sampled_species | size }}</td>
<td>{{ site.data.taxonomy.family[family.title].species | size }}</td>
</tr>
{% endfor %}
</tbody>
</table>
</div>
