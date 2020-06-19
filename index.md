---
layout: home
---


<style>
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 50%;
    vertical-align: middle;
    overflow: hidden;
    background-size: contain;
    background-image: url('{% resize src='assets/img/front-page-tree.png' width=940 %}');
}

@media
only screen and (-webkit-min-device-pixel-ratio: 1.25),
only screen and (   min--moz-device-pixel-ratio: 1.25),
only screen and (     -o-min-device-pixel-ratio: 5/4),
only screen and (        min-device-pixel-ratio: 1.25),
only screen and (                min-resolution: 1.25dppx) {
    .svg-container {
        background-image: url('{% resize src='assets/img/front-page-tree.png' width=1880 %}');
    };
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2.25),
only screen and (   min--moz-device-pixel-ratio: 2.25),
only screen and (     -o-min-device-pixel-ratio: 9/4),
only screen and (        min-device-pixel-ratio: 2.25),
only screen and (                min-resolution: 2.25dppx) {
    .svg-container {
        background-image: url('{% link assets/img/front-page-tree.png %}');
    };
}

.svg-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
}
</style>

{% assign tree = assets["front-page-tree@3x.png"] %}

<div class="svg-container">
<svg id="example1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin meet" class="svg-content" viewBox="0 0 {{ tree.dimensions.width }} {{ tree.dimensions.height }}">
{% for row in site.data.front_page_coords %}
<a xlink:href="{{ "/taxonomy/family/" | append: row.taxa | relative_url }}" class="svg-tooltip">
  <title>{{ row.taxa }}</title>
  <rect x="{{ row.x }}" y="{{ row.y }}" width="{{ row.w }}" height="{{ row.h }}" fill="red" stroke="black" opacity="0" />
</a>
{% endfor %}
</svg>
</div>



## Quick links

* [Visualize our fossil calibration points]({% link fossils.md %})
* [Download the time-calibrated phylogeny]({% link downloads/index.md %})
* [Browse our new "Phylogenetic Fish Classification"]({% link taxonomy.md %})
