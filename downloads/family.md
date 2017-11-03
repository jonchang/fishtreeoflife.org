---
title: Downloads by family
layout: page
---

{% assign family_trees = site.static_files | where_exp: "item", "item.path contains '/downloads/family/'" | sort: "basename"  %}

<ul>
{% for tree in family_trees %}
{% unless tree.name contains "mrca" %}
<li><a href="{{ tree.path | relative_url}}">{{ tree.basename }}</a>
{% assign mrca_tree_name = tree.basename | append: "_mrca" %}
{% assign mrca_tree = family_trees | where_exp: "item", "item.basename == mrca_tree_name" %}
{% if mrca_tree != empty %} (<a href="{{ mrca_tree[0].path | relative_url }}">MRCA</a>) {% endif %}
</li>
{% endunless %}
{% endfor %}
</ul>
