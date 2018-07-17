---
layout: page
title: Methods
description: How the Fish Tree of Life was built
---

# Sequence matrix construction

PHLAWD uses a baited approach where sequences for a clade of interest are compared to NCBI GenBank sequences and used to download homologous gene regions. We acquired bait sequences for 24 genes from several sources: the "ETOL" set, from the Euteleost Tree of Life project, the "Rabosky" set, and the "Near" set.

All PHLAWD analyses used a modified version of the original software. The [original version of PHLAWD](https://github.com/blackrim/phlawd) entered maintenance mode September 2012, and was subsequently [modified by Cody Hinchliff](https://github.com/chinchliff/phlawd) to fix a number of bugs and speed up analyses. [Our modified version](https://github.com/jonchang/phlawd) fixes other bugs and supports including daily updates in addition to the bimonthly GenBank releases.

Our modified version of PHLAWD then assesses these homologous sequences for saturation, and if saturated, broken up into sub-matrices aligned with MAFFT corresponding to a user taxonomy or guide tree. We conducted a PHLAWD-mediated GenBank search for each gene with the parameters MAD (median average deviation) = 0.01, coverage = 0.2, and identity = 0.2 for NCBI taxon Actinopterygii. Using the NCBI taxonomy, these sub-matrices were then aligned together using profile alignment as provided in MUSCLE. We used GNU Parallel to parallelize this search, as the built-in parallelization in PHLAWD can occasionally stall using high numbers of threads.

To further increase the genetic coverage of our dataset, we downloaded the full Barcode of Life (BOLD) database sequences and extracted the longest cytochrome oxidase subunit 1 (*coi*) gene for each species in Actinopterygii. We also downloaded full mitochondrial chromosomes for each actinopterygian species and extracted the *nd2* and *nd4* genes. This preliminary alignment included 15,606 species. 


|             | ETOL | Rabosky | Near | BOLD* | mt-genome* |
|-------------|------|---------|------|-------|------------|
| *12s*       |      | &#10004;     |      |       |            |
| *16s*       | &#10004;  | &#10004;     |      |       |            |
| *4c4*       |      | &#10004;     |      |       |            |
| *coi*       |      |         |      | &#10004;   |            |
| *cytb*      |      | &#10004;     |      |       |            |
| *enc1*      | &#10004;  | &#10004;     | &#10004;  |       |            |
| *ficd*      |      |         |      |       |            |
| *glyt*      | &#10004;  | &#10004;     | &#10004;  |       |            |
| *hoxc6a*    | &#10004;  |         |      |       |            |
| *kiaa1239*  | &#10004;  |         |      |       |            |
| *myh6*      | &#10004;  | &#10004;     | &#10004;  |       |            |
| *nd2*       |      |         |      |       | &#10004;        |
| *nd4*       |      |         |      |       | &#10004;        |
| *panx2*     | &#10004;  |         |      |       |            |
| *plagl2*    | &#10004;  | &#10004;     | &#10004;  |       |            |
| *ptr*       | &#10004;  |         | &#10004;  |       |            |
| *rag1*      | &#10004;  | &#10004;     | &#10004;  |       |            |
| *rag2*      | &#10004;  |         |      |       |            |
| *rhodopsin* | &#10004;  | &#10004;     |      |       |            |
| *ripk4*     | &#10004;  |         |      |       |            |
| *sh3px3*    | &#10004;  |         | &#10004;  |       |            |
| *sidkey*    | &#10004;  |         |      |       |            |
| *sreb2*     | &#10004;  | &#10004;     | &#10004;  |       |            |
| *svep1*     | &#10004;  |         |      |       |            |
| *tbr1*      | &#10004;  | &#10004;     | &#10004;  |       |            |
| *vcpip*     | &#10004;  |         |      |       |            |
| *zic1*      | &#10004;  | &#10004;     | &#10004;  |       |            |

Table: Gene sources for PHLAWD analyses. Sources marked (*) were not used for baited PHLAWD searches and instead included directly into the character matrix.

# Fossil calibrations

We devised an extensive list of fossil-based minima for divergences in actinopterygian phylogeny. Many of these derived from past molecular clock analyses, but others are new to this study. Extinct taxa, along with relevant phylogenetic and age justifications, are supplied in Supplemental Data: Calibration Report. We applied these fossils as node-based calibrations, with upper age bound specified by a modified implementation of the Whole Tree Extension of the Hedman Algorithm [WHETA; @Hedman2010; @Lloyd2016]. This approach yields probabilistic maximum age constraints on given nodes based on: a minimum age specified by the oldest fossil descended from that node; the stratigraphically consistent sequence of older fossil outgroups to that node; and a hard maximum age defined by the investigator. We adopted a composite approach to specifying these sequences of outgroups [c.f. @Harrington2016], applying both stratigraphically consistent calibrations included in our own set of fossil-based minima as well as sequences of fossils whose phylogenetic positions were well known, but which were not used as calibration minima themselves. Sequences based on the former were collated automatically by a custom algorithm. Where appropriate, this set of outgroups was appended with additional fossil outgroup ages.

We applied two such sequences: the stem teleost lineages successively more remote from the teleost crown specified by @Friedman2013 and updated by @Harrington2016, and a set of fossil outgroups to extant chondrosteans. The latter is novel to this study, and is based upon the cladistic hypotheses of chondrostean interrelationships given by @Grande1991, @Grande1996 and @Hilton2009. In increasing proximity to the chondrostean crown, with ages given in parentheses, this sequence is: *Birgeria groenlandia* (250.1 Ma), *Chondrosteus acipenseroides* (193.81), and *Peipiaosteus pani* (129.3). Age justifications follow those given for other taxa from the same geological units (e.g., *Chondrosteus acipenseroides* is co-occurs with *Dorsetichthys bechei*, which is included in the series of stem teleosts given by @Friedman2013 and @Harrington2016). Concatenated outgroup-age sequences were then submitted to the @Hedman2010 algorithm, with a hard upper age constraint of 430 Ma. This choice of maximum age is unlikely to bias our estimates substantially, as we only applied this method for nodes within the actinopteran crown where times of origin are generally accepted to be substantially younger than this Silurian bound. In practice, the credible intervals estimated by the algorithm are relatively insensitive to the choice of the hard maximum age constraint.

Our calibration set is restricted to fossils of Mesozoic and Cenozoic age. This reflects two factors. First, the clade of principal interest in this analysis---Teleostei---is known exclusively from Mesozoic and younger strata. Second, the relationships of many Paleozoic fossils relative to modern actinopterygian lineages is poorly constrained (see verbal arguments in @Sallan2014, @Friedman2015; analytical arguments in Giles et al. in press), with some fossils used as key calibrations in past studies [e.g., @Hurley2007] recovered in very different phylogenetic positions in subsequent analyses [e.g., Giles et al. in press; @Xu2014]. Rather than potentially applying misleading calibrations to deep divergences within actinopterygian phylogeny, we instead have selected to allow more securely placed fossils belonging to later-diverging clades inform our age estimates for more inclusive groups.

Our resulting timescale for actinopterygian history shows good agreement with the evolutionary timeline implied by fossils for groups with well-understood paleontological records. The mean origination date for crown Actinopterygii (368 Ma) is centered near the end-Devonian mass extinction (359 Ma), which preceded the first apparent radiation of the group in terms of both taxonomic and morphological diversity in the succeeding Carboniferous [359--299 Ma; @Sallan2010; @Sallan2012; @Friedman2012; @Sallan2014]. The origin of crown Neopterygii is centered on the early Permian (298 Ma). Crown Holostei (251 My) is centered shortly after the Permo-Triassic boundary, and corresponds closely to our fossil-based minimum for this clade (the earliest Triassic *Watsonulus*). The origin of crown teleosts (192 My) falls near the beginning of the Jurassic (201--145 Ma), before the appearance of the first diagnostic crown teleosts---members of the Elopomorpha, the sister group to all other teleosts---late in that period [@Arratia2000]. This estimate substantially closes the so-called the "teleost gap", a conspicuous temporal disagreement between the time of origin of crown teleosts implied by the fossil record and some molecular clock studies [e.g., @Hurley2007; @Near2012]. Among nested teleost clades, there is generally good agreement between our timeline and that implied by both previous molecular clock studies and the fossil record.

# Placing unsampled species


We compared the taxonomic classification across Fishbase [@Froese2014], the Catalog of Fishes [@Eschmeyer2017], and the Euteleost Tree of Life project [@Betancur-R2013]. Based on these taxonomic authors, we built a new classification scheme and explored shallower phylogenetic groups where non-monophyly was found in our phylogeny. This combined "Phylogenetic Fish Classification" (PFC) was then used for the purpose of taxonomic back-filling of taxa without molecular data or those that were removed during the curation stage. Using the time-calibrated phylogeny as a backbone, we generated a distribution of trees where missing taxa were placed according to our PFC taxonomy.

For each of the unsampled species of ray-finned fish, we assigned the most restrictive taxonomic rank (e.g., genus, family, order) that was recovered as monophyletic in our maximum likelihood phylogeny. We computed rank-specific estimates of the speciation and extinction rate under a constant rate model, conditioned on the sampling fraction [@Stadler2009], and used these rates to generate waiting times for unsampled species. However, if the taxonomic node had fewer than 3 tips, or if the probability of sampling the crown age of that node given the number of sampled taxa [@Sanderson1996] was less than 0.8, we searched all the ancestors of that taxonomic node that fulfilled the previous criteria. The generated waiting times were bounded between the crown age of that clade and the present time ($t=0$). However, if the crown capture probability was less than 0.8, the maximum generated age was extended to the stem age of the taxonomic node. If placement was impossible due to monophyletic constraints (see below), the waiting time was then bounded between the stem age and the crown age of that taxonomic node.

These waiting times were used to randomly attach unsampled species to an existing branch within their assigned taxonomic rank, as long as these new species did not break the monophyly of nodes that were recovered as monophyletic and assigned a taxonomic rank, and constrained to not produce negative branch lengths due to a child node being added that was older than a parent node. If all of the child branches of a taxonomic node belonged to a monophyletic node, or if the crown capture probability was less than 0.8, the new species was instead assigned to the stem of that clade.

These functions were all implemented in a custom Python script based on the code from the R packages TreePar and SimTree [@Stadler2009; @Stadler2011a; @Stadler2011b]. This procedure was repeated 100 times to generate a distribution of fully-sampled ray-finned fish phylogenies.
