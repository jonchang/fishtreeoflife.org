---
layout: page
title: Taxonomy
---

- PFC taxonomy
- Compare to CoL/EToL

Tax page
- Picture
- Name
- Stats
- Fossil calibrations
- Outgroups
- Genetic tree
- Full distribution
- Download sequences
- Download calibration info
- Download BEAST/RAXML/TREEPL/mcmctree files
- API integration: EOL/fishbase

## Families

{% for family in site.family %}
* [{{ family.title }}]({{ family.url | relative_url }}) --- {{ site.data.family[family.title] | where:"sampled","1" | size }}/{{ site.data.family[family.title] | size }} species {% endfor %}


