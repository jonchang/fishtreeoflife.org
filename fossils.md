---
layout: page
title: Fossils
description: Ray-finned fish fossils for time-calibrating the Actinopterygii phylogeny. Inclues node placements, fossil locality, and taxonomic authorities.
---

<style>
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 300%;
    vertical-align: middle;
    overflow: hidden;
    background-size: contain;
    background-image: url('{% asset vertical_tree@1x.png @optim @path %}');
}

@media
only screen and (-webkit-min-device-pixel-ratio: 1.25),
only screen and (   min--moz-device-pixel-ratio: 1.25),
only screen and (     -o-min-device-pixel-ratio: 5/4),
only screen and (        min-device-pixel-ratio: 1.25),
only screen and (                min-resolution: 1.25dppx) {
    .svg-container {
        background-image: url('{% asset vertical_tree@2x.png @optim @path %}');
    };
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2.25),
only screen and (   min--moz-device-pixel-ratio: 2.25),
only screen and (     -o-min-device-pixel-ratio: 9/4),
only screen and (        min-device-pixel-ratio: 2.25),
only screen and (                min-resolution: 2.25dppx) {
    .svg-container {
        background-image: url('{% asset vertical_tree@3x.png @optim @path %}');
    };
}

.svg-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
}
</style>

Click on a red circle to go to that fossil calibration.

* TOC
{:toc}

{% assign tree = assets["vertical_tree@3x.png"] %}

<div class="svg-container">
<svg id="example1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin meet" class="svg-content" viewBox="0 0 {{ tree.dimensions.width }} {{ tree.dimensions.height }}">
{% for fossil in site.data.fossil_data %}
<a xlink:href="{{ "/fossils/" | append: fossil.slug | relative_url }}" class="svg-tooltip">
  <title>{{ fossil.fossil }} ({{ fossil.min }} Ma)</title>
  <circle cx="{{ fossil.devx }}" cy="{{ fossil.devy }}" r="15" fill="red" stroke="black" />
</a>
{% endfor %}
</svg>
</div>

## Table of fossil calibrations

<table>
<tr><th>Index</th><th>Clade</th><th>Fossil</th><th>Min. age</th></tr>
{% for fossil in site.data.fossil_data %}
<tr>
    <td>{{ fossil.idx }}</td>
    <td><a href="{{ "/fossils/" | append: fossil.slug | relative_url }}">{{ fossil.clade_pretty }}</a></td>
    <td><em>{{ fossil.fossil }}</em></td>
    <td>{{ fossil.min }} Ma</td>
</tr>
{% endfor %}
</table>
