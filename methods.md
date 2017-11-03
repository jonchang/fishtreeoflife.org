---
layout: page
title: Methods
---

# Matrix

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


# Phylo

# Taxonomic reconstructions

# Spatial

# Taxonomic addition

# Diversification rate estimates


