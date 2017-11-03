---
layout: page
---

{% assign family_trees = site.static_files | where_exp: "item", "item.path contains '/downloads/family/'" | sort: "basename"  %}

<ul>

{% for tree in family_trees %}
{% if tree.name contains "mrca" %}
{% assign family_name = tree.basename | replace: "_mrca", "" %}
<li>{{ family_name }}: (<a href="{{ tree.path | relative_url }}">MRCA</a>)
{% elsif tree.name contains "pruned" %}
(<a href="{{ tree.path | relative_url}}">pruned</a>)</li>
{% endif %}
{% endfor %}

</ul>
