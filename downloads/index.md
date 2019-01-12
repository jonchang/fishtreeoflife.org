---
layout: page
title: Downloads
description: Download sequence and phylogenetic data for the Fish Tree of Life
---

To save space, many of our files are distributed as compressed XZ format files. Windows users can download [7-Zip](http://www.7-zip.org/) to uncompress these files, while macOS users can use [The Unarchiver](https://theunarchiver.com/). R should also be able to read XZ files natively without decompressing the file first.

- [RAxML phylogram](actinopt_12k_raxml.tre.xz) (Newick format)
- [Timetree](actinopt_12k_treePL.tre.xz) (Newick format)
- [Complete "all-taxon assembled" chronograms](actinopt_full.trees.xz)[^1]
- [Taxonomy-only tree, used to generate ATA chronograms](taxonomy.tre.xz)
- [Taxonomy spreadsheet](PFC_taxonomy.csv.xz)
- [Computed diversification rates](tiprates.csv.xz)
- [Full alignment](final_alignment.phylip.xz)
- [Alignment partitions](final_alignment.partitions)
- [Fossil calibrations]({% link downloads/fossil_data.csv %})


[^1]: Please see [the methods page]({% link methods.md %}) as well as this [update notice]({% link rabosky-et-al-2018-update.md %}) for important details on how these tree distributions were generated. Using ATA phylogenies in conjunction with trait data? Keep [some caveats in mind](https://doi.org/10.1111/evo.12817).
