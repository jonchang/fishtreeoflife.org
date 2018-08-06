---
layout: page
title: Enhanced polytomy resolution strengthens evidence for global gradient in speciation rate for marine fishes
description: |
  We have updated the set of all-taxon assembled (ATA) phylogenies.
  We compared the original and updated ATA phylogenies and re-analyze results from Rabosky et al. 2018.
  These updates strengthen support of our original findings based on the DR speciation rate statistic.
---

* toc
{:toc}

## Highlights

* We updated the set of all-taxon assembled (ATA) phylogenies by improving monophyly constraints
* We compare the original and updated ATA phylogenies and re-analyze results from Rabosky et al. 2018[^Rabosky2018]
* These updates strengthen support of our original findings based on the λ<sub>DR</sub> speciation rate statistic

## Introduction

We recently documented an inverse global gradient in speciation rate for marine fishes, such that speciation rates are consistently elevated for high-latitude temperate and polar fishes relative to their tropical counterparts[^Rabosky2018]. We demonstrated that multiple estimators of speciation rate (λ<sub>BAMM</sub>, λ<sub>DR</sub>) are strongly correlated with absolute latitudinal midpoint, such that the fastest overall rates of speciation occur in geographic regions with low species richness, cold surface sea temperatures, and high endemism.

Our estimates of speciation rate that used the DR statistic[^Jetz2012] were based on a distribution of fully-resolved phylogenies (ATA phylogenies). To assemble the ATA phylogenies, we paired a backbone genetic phylogeny for 11,633 ray-finned fishes with taxonomic information for 19,888 taxa that lacked genetic taxa. Similar to other birth-death polytomy resolvers[^Thomas2013], our method generated a conservative distribution of taxonomic placements that satisfied a number of taxonomic constraints. Our original method[^Rabosky2018] incorporated hierarchical sets of constraints. For example, consider a family of fishes where 60 of 100 species have been genetically sampled, but where two genera within the family are known to be completely sampled (e.g., genus X with 10 species, and genus Y with 5 species). The polytomy resolver described in our article would allocate the unsampled 40 species across the phylogeny under estimated birth-death rates, while preserving the monophyly of genera X and Y.

However, one undesirable limitation of the complex hierarchy of constraints imposed in our analyses is that some higher taxa could not enforce the monophyly constraint. As a consequence, our algorithm would occasionally be forced to break the monophyly of some higher taxa that were nevertheless monophyletic in the genes-only phylogeny. There were three orders where species roamed outside of their order, all belonging to subdivision Percomorphaceae: [Blenniiformes](/taxonomy/order/Blenniiformes/) (111 out of 951 species), [Gobiiformes](/taxonomy/order/Gobiiformes) (547 out of 1,407 species), and [Tetraodontiformes](/taxonomy/order/Tetraodontiformes/) (30 out of 376 species). Species from these orders were placed in monophyletic orders [Percopsiformes](/taxonomy/order/Percopsiformes/), [Acanthuriformes](/taxonomy/order/Acanthuriformes/), [Anabantiformes](/taxonomy/order/Anabantiformes/), and [Kurtiformes](/taxonomy/order/Kurtiformes/); as well as non-monophyletic orders [Centrarchiformes](/taxonomy/order/Centrarchiformes/), [Pempheriformes](/taxonomy/order/Pempheriformes/), [Perciformes](/taxonomy/order/Perciformes/), [Scombriformes](/taxonomy/order/Scombriformes/), and [Syngnathiformes](/taxonomy/order/Syngnathiformes/). The other 47 named orders were not affected by this issue. Collectively, 3.5% of taxa lacking genetic data (688 of 19,888) were not maximally constrained across the full distribution of ATA phylogenies.

We implemented an enhanced polytomy resolver that could solve more sophisticated sets of monophyly constraints, ensuring that the overlapping, hierarchical constraints would not interfere with each other, and permitting the constraint of previously unconstrained taxa. We generated new ATA phylogenies and re-calculated λ<sub>DR</sub> speciation rate estimates. Our main results derived from λ<sub>BAMM</sub> speciation rate estimates were not affected.

To test for the effect of this improvement, we computed tip-specific λ<sub>DR</sub> speciation rates for the original set of ATA phylogenies and the new set of ATA phylogenies. We summarized on a per-tip basis the λ<sub>DR</sub> speciation rate and conducted a linear regression between the original and new ATA phylogenies. The two were significantly correlated (r = 0.98), and the slope of the linear model was β = 0.95.

<figure id="figmain">
{% asset rabosky2018figures/regression.png alt="Lambda DR speciation rates were strongly correlated between the original and updated ATA phylogenies" %}
<figcaption>λ<sub>DR</sub> speciation rates were strongly correlated between the original and updated ATA phylogenies. The dotted line is the 1:1 reference line.</figcaption>
</figure>

## Updated text

Based on these new ATA phylogenies, we can make the following changes to the text of Rabosky et al. 2018[^Rabosky2018]:

In the third sentence of the fourth paragraph of the main text, we originally stated that λ<sub>DR</sub> rate for tropical assemblages was 0.11; with our revised estimate, this rate is 0.10. In the fourth sentence, we stated that the λ<sub>DR</sub> rates for shallow-water tropical and high-latitude assemblages were 0.11, and 0.22, respectively. With our revised estimate, these rates are 0.10 and 0.23.


In the fourth sentence of the fifth paragraph, we originally stated that the λ<sub>DR</sub> rate for continental shelf and slope assemblages from the Coral Triangle was 0.11. With our revised estimate, this rate is 0.10. In the fifth sentence, we originally stated that the Arctic assemblages had a λ<sub>DR</sub> rate of 0.24; with our revised estimate, this rate is 0.26. In the seventh sentence, we originally stated that the correlation between λ<sub>DR</sub> and endemism was r = 0.79; our revised estimate for this correlation is r = 0.78.

In the fourth sentence of the sixth paragraph, we originally stated that the correlation between absolute latitudinal midpoint and λ<sub>DR</sub> was r = 0.27. Our revised estimate of this correlation is r = 0.26.

In the first and second sentences of the seventh paragraph, we originally stated that the λ<sub>DR</sub> mean speciation rates of tropical and high-latitude taxa were 0.12 and 0.25. With our revised estimates, these rates are 0.11 and 0.23, respectively. 

In the second sentence of the eighth paragraph, we originally stated that the λ<sub>DR</sub> speciation rates for wrasses, gobies, and damselfishes were 0.12,  0.10, and 0.14, respectively. With our revised phylogeny, these rates are 0.13, 0.12, and 0.15. In the fourth sentence, we stated that coldwater taxa were characterized by speciation rates that exceed λ<sub>DR</sub> = 0.34; with our revised estimate, λ<sub>DR</sub> is 0.38. In the sixth sentence, we state the 79.7% of marine speciation events in the ATA phylogenies occurred after the Oligocene-Miocene boundary.  In our revised phylogenies, these increase to 80.3% of marine speciation events.

In the fourth sentence of the ninth paragraph, we originally reported the mean rates for high-latitude deep-sea fishes as λ<sub>DR</sub> = 0.37; with our revised estimate, this rate is 0.36.

In the caption for Extended Data Figure 7c, we originally reported that the λ<sub>DR</sub> rate for high-latitude perciform species was 0.30. With our revised estimate, this rate is 0.29.

In the caption for Extended Data Figure 9, panels e and f, we originally reported that the relationship between root-to-tip distance and absolute latitudinal midpoint was r = 0.020. With our revised estimate, this correlation is 0.043.



## Updated figures

We updated the following figures: main text <a href="#figmain">Figure 3</a>, <a href="fig2">Extended Data Figures 2</a>, <a href="fig3">3</a>, <a href="fig4">4</a>, <a href="fig5">5</a>, <a href="fig7">7</a>, <a href="fig8">8</a>, <a href="fig9">9</a>, and <a href="fig10">Extended Data Table 1</a>. Each of the following figures is an animation comparing the original and updated figures. In some cases the figures here will differ slightly from the originals[^Rabosky2018]; this is due to randomness introduced to alleviate visual artifacts from overplotting.

<figure id="figmain">
{% asset rabosky2018figures/figmain_flicker.gif alt="Main text Figure 3 inset box plot" %}
<figcaption>Main text Figure 3 inset box plot</figcaption>
</figure>

<figure id="fig2">
{% asset rabosky2018figures/fig2_flicker.gif alt="Extended Data Figure 2" %}
<figcaption>Extended Data Figure 2</figcaption>
</figure>

<figure id="fig3">
{% asset rabosky2018figures/fig3_flicker.gif alt="Extended Data Figure 3" %}
<figcaption>Extended Data Figure 3</figcaption>
</figure>

<figure id="fig4">
{% asset rabosky2018figures/fig4_flicker.gif alt="Extended Data Figure 4" %}
<figcaption>Extended Data Figure 4</figcaption>
</figure>

<figure id="fig5">
{% asset rabosky2018figures/fig5_flicker.gif alt="Extended Data Figure 5" %}
<figcaption>Extended Data Figure 5</figcaption>
</figure>

<figure id="fig7">
{% asset rabosky2018figures/fig7_flicker.gif alt="Extended Data Figure 7a" %}
<figcaption>Extended Data Figure 7a</figcaption>
</figure>

<figure id="fig8">
{% asset rabosky2018figures/fig8_flicker.gif alt="Extended Data Figure 8" %}
<figcaption>Extended Data Figure 8</figcaption>
</figure>

<figure id="fig9">
{% asset rabosky2018figures/fig9_flicker.gif alt="Extended Data Figure 9" %}
<figcaption>Extended Data Figure 9</figcaption>
</figure>

<figure id="fig10">
{% asset rabosky2018figures/fig10_flicker.gif alt="Extended Data Table 1" %}
<figcaption>Extended Data Table 1</figcaption>
</figure>

## References

[^Rabosky2018]: Rabosky, D. L., Chang, J., Title, P. O., Cowman, P. F., Sallan, L., Friedman, M., Kashner, K., Garilao, C., Near, T. J., Coll, M., Alfaro, M. E. (2018). An inverse latitudinal gradient in speciation rate for marine fishes. Nature, 559(7714), 392–395. doi:[10.1038/s41586-018-0273-1](https://doi.org/10.1038/s41586-018-0273-1)

[^Jetz2012]: Jetz, W., Thomas, G. H., Joy, J. B., Hartmann, K., & Mooers, A. O. (2012). The global diversity of birds in space and time. Nature, 491(7424), 444–448. doi:[10.1038/nature11631](https://doi.org/10.1038/nature11631)

[^Thomas2013]: Thomas, G. H., Hartmann, K., Jetz, W., Joy, J. B., Mimoto, A., & Mooers, A. O. (2013). PASTIS: an R package to facilitate phylogenetic assembly with soft taxonomic inferences. Methods in Ecology and Evolution, 4(11), 1011–1017. doi:[10.1111/2041-210x.12117](https://doi.org/10.1111/2041-210x.12117)

