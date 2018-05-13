---
layout: page
title: Fossils
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

## Calibration strategy

We devised an extensive list of fossil-based minima for divergences in actinopterygian phylogeny. Many of these derived from past molecular clock analyses, but others are new to this study. Extinct taxa, along with relevant phylogenetic and age justifications, are supplied in Supplemental Data: Calibration Report. We applied these fossils as node-based calibrations, with upper age bound specified by a modified implementation of the Whole Tree Extension of the Hedman Algorithm [WHETA; @Hedman2010; @Lloyd2016]. This approach yields probabilistic maximum age constraints on given nodes based on: a minimum age specified by the oldest fossil descended from that node; the stratigraphically consistent sequence of older fossil outgroups to that node; and a hard maximum age defined by the investigator. We adopted a composite approach to specifying these sequences of outgroups [c.f. @Harrington2016], applying both stratigraphically consistent calibrations included in our own set of fossil-based minima as well as sequences of fossils whose phylogenetic positions were well known, but which were not used as calibration minima themselves. Sequences based on the former were collated automatically by a custom algorithm. Where appropriate, this set of outgroups was appended with additional fossil outgroup ages.

We applied two such sequences: the stem teleost lineages successively more remote from the teleost crown specified by @Friedman2013 and updated by @Harrington2016, and a set of fossil outgroups to extant chondrosteans. The latter is novel to this study, and is based upon the cladistic hypotheses of chondrostean interrelationships given by @Grande1991, @Grande1996 and @Hilton2009. In increasing proximity to the chondrostean crown, with ages given in parentheses, this sequence is: *Birgeria groenlandia* (250.1 Ma), *Chondrosteus acipenseroides* (193.81), and *Peipiaosteus pani* (129.3). Age justifications follow those given for other taxa from the same geological units (e.g., *Chondrosteus acipenseroides* is co-occurs with *Dorsetichthys bechei*, which is included in the series of stem teleosts given by @Friedman2013 and @Harrington2016). Concatenated outgroup-age sequences were then submitted to the @Hedman2010 algorithm, with a hard upper age constraint of 430 Ma. This choice of maximum age is unlikely to bias our estimates substantially, as we only applied this method for nodes within the actinopteran crown where times of origin are generally accepted to be substantially younger than this Silurian bound. In practice, the credible intervals estimated by the algorithm are relatively insensitive to the choice of the hard maximum age constraint.

Our calibration set is restricted to fossils of Mesozoic and Cenozoic age. This reflects two factors. First, the clade of principal interest in this analysis---Teleostei---is known exclusively from Mesozoic and younger strata. Second, the relationships of many Paleozoic fossils relative to modern actinopterygian lineages is poorly constrained (see verbal arguments in @Sallan2014, @Friedman2015; analytical arguments in Giles et al. in press), with some fossils used as key calibrations in past studies [e.g., @Hurley2007] recovered in very different phylogenetic positions in subsequent analyses [e.g., Giles et al. in press; @Xu2014]. Rather than potentially applying misleading calibrations to deep divergences within actinopterygian phylogeny, we instead have selected to allow more securely placed fossils belonging to later-diverging clades inform our age estimates for more inclusive groups.

Our resulting timescale for actinopterygian history shows good agreement with the evolutionary timeline implied by fossils for groups with well-understood paleontological records. The mean origination date for crown Actinopterygii (368 Ma) is centered near the end-Devonian mass extinction (359 Ma), which preceded the first apparent radiation of the group in terms of both taxonomic and morphological diversity in the succeeding Carboniferous [359--299 Ma; @Sallan2010; @Sallan2012; @Friedman2012; @Sallan2014]. The origin of crown Neopterygii is centered on the early Permian (298 Ma). Crown Holostei (251 My) is centered shortly after the Permo-Triassic boundary, and corresponds closely to our fossil-based minimum for this clade (the earliest Triassic *Watsonulus*). The origin of crown teleosts (192 My) falls near the beginning of the Jurassic (201--145 Ma), before the appearance of the first diagnostic crown teleosts---members of the Elopomorpha, the sister group to all other teleosts---late in that period [@Arratia2000]. This estimate substantially closes the so-called the "teleost gap", a conspicuous temporal disagreement between the time of origin of crown teleosts implied by the fossil record and some molecular clock studies [e.g., @Hurley2007; @Near2012]. Among nested teleost clades, there is generally good agreement between our timeline and that implied by both previous molecular clock studies and the fossil record.
