---
layout: page
title: Methods
description: How the Fish Tree of Life was built
---

* TOC
{:toc}

# Sequence matrix construction

PHLAWD uses a baited approach where sequences for a clade of interest are compared to NCBI GenBank sequences and used to download homologous gene regions. We acquired bait sequences for 24 genes from several sources: the "ETOL" set, from the Euteleost Tree of Life project, the "Rabosky" set, and the "Near" set.

All PHLAWD analyses used a modified version of the original software. The [original version of PHLAWD](https://github.com/blackrim/phlawd) entered maintenance mode September 2012, and was subsequently [modified by Cody Hinchliff](https://github.com/chinchliff/phlawd) to fix a number of bugs and speed up analyses. [Our modified version](https://github.com/jonchang/phlawd) fixes other bugs and supports including daily updates in addition to the bimonthly GenBank releases.

Our modified version of PHLAWD then assesses these homologous sequences for saturation, and if saturated, broken up into sub-matrices aligned with MAFFT corresponding to a user taxonomy or guide tree. We conducted a PHLAWD-mediated GenBank search for each gene with the parameters MAD (median average deviation) = 0.01, coverage = 0.2, and identity = 0.2 for NCBI taxon Actinopterygii. Using the NCBI taxonomy, these sub-matrices were then aligned together using profile alignment as provided in MUSCLE. We used [GNU Parallel](https://www.gnu.org/software/parallel/) to parallelize this search, as the built-in parallelization in PHLAWD can occasionally stall using high numbers of threads.

To further increase the genetic coverage of our dataset, we downloaded the full Barcode of Life (BOLD) database sequences and extracted the longest cytochrome oxidase subunit 1 (*coi*) gene for each species in Actinopterygii. We also downloaded full mitochondrial chromosomes for each actinopterygian species and extracted the *nd2* and *nd4* genes. This preliminary alignment included 15,606 species. 


<details markdown="1">
<summary>Table: Gene sources for PHLAWD analyses. Sources marked (*) were not used for baited PHLAWD searches and instead included directly into the character matrix.</summary>

| Gene name   | ETOL | Rabosky | Near | BOLD* | mt-genome* |
|-------------|------|---------|------|-------|------------|
| *12s*       |      | ✔       |      |       |            |
| *16s*       | ✔    | ✔       |      |       |            |
| *4c4*       |      | ✔       |      |       |            |
| *coi*       |      |         |      | ✔     |            |
| *cytb*      |      | ✔       |      |       |            |
| *enc1*      | ✔    | ✔       | ✔    |       |            |
| *ficd*      |      |         |      |       |            |
| *glyt*      | ✔    | ✔       | ✔    |       |            |
| *hoxc6a*    | ✔    |         |      |       |            |
| *kiaa1239*  | ✔    |         |      |       |            |
| *myh6*      | ✔    | ✔       | ✔    |       |            |
| *nd2*       |      |         |      |       | ✔          |
| *nd4*       |      |         |      |       | ✔          |
| *panx2*     | ✔    |         |      |       |            |
| *plagl2*    | ✔    | ✔       | ✔    |       |            |
| *ptr*       | ✔    |         | ✔    |       |            |
| *rag1*      | ✔    | ✔       | ✔    |       |            |
| *rag2*      | ✔    |         |      |       |            |
| *rhodopsin* | ✔    | ✔       |      |       |            |
| *ripk4*     | ✔    |         |      |       |            |
| *sh3px3*    | ✔    |         | ✔    |       |            |
| *sidkey*    | ✔    |         |      |       |            |
| *sreb2*     | ✔    | ✔       | ✔    |       |            |
| *svep1*     | ✔    |         |      |       |            |
| *tbr1*      | ✔    | ✔       | ✔    |       |            |
| *vcpip*     | ✔    |         |      |       |            |
| *zic1*      | ✔    | ✔       | ✔    |       |            |

</details>

# Alignment error-correction

To filter out misidentified sequences, we ran a local nucleotide BLAST search on our combined PHLAWD and mitochondrial sequences. Using the closest non-self BLAST match, we ensured that no PHLAWD sequences matched with a high identity to a species outside of the original species family, and checked for contamination by excluding sequences that aligned with high identity to a non-actinopterygian such as *Homo*.

For example, the *enc1* sequence for *Amia calva* (Accession [EF032974.1](https://www.ncbi.nlm.nih.gov/nuccore/EF032974.1)), in family Amiidae, matches with 99.87% identity to *Lepomis cyanellus* (Accession [KF139483.1](https://www.ncbi.nlm.nih.gov/nuccore/KF139483.1)), in family Centrarchidae, despite there being other *enc1* closer for this species. This specific sequence was therefore excluded from the final analysis.

We used previously described sequencing protocols to generate new multilocus data for 442 species. These were directly added and aligned to the character matrix. Alignments were then quality checked by eye to ensure that coding genes were in frame. These alignments were then concatenated for downstream analysis.

<details markdown="1">
<summary>Table: New sequences by gene.</summary>

| Species                            | enc1 | glyt | myh6 | plagl2 | ptr | rag1 | sh3px3 | sreb2 | tbr1 | zic1 |
|------------------------------------|------|------|------|--------|-----|------|--------|-------|------|------|
| *Acanthistius cinctus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Acanthostracion quadricornis*     | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Achiropsetta tricholepis*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Acropoma japonicum*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Aethotaxis mitopteryx mitopteryx* | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Akarotaxis nudiceps*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Allotoca catarinae*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Altolamprologus calvus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Aluterus scriptus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Amanses scopas*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Amblyglyphidodon aureus*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Amblyopsis rosae*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Amblyopsis spelaea*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ammocrypta beanii*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ammocrypta bifascia*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ammocrypta clara*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Amphiprion chrysopterus*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Anableps anableps*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Anablepsoides hartii*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Andinoacara rivulatus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Aphredoderus gib*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Apistus carinatus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Aplodactylus arctidens*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Apogon binotatus*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Apogon maculatus*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Apogon planifrons*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ariomma bondi*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ariomma indicum*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ariomma melanum*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Arothron stellatus*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Arripis trutta*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Artedidraco mirus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Artedidraco orianae*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Artedidraco shackletoni*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Artedidraco skottsbergi*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Astatotilapia bloyeti*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Astatotilapia burtoni*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Astrapogon puncticulatus*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Astronotus sp*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Atypichthys latus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Aulonocranus dewindti*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Austrofundulus leohoignei*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Austrolebias nigripinnis*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Azurina hirundo*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathybates fasciatus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathyclupea argentea*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathyclupea gracilis*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathydraco antarcticus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathydraco macrolepis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathydraco marri*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathydraco scotiae*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bathystethus cultratus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Benitochromis batesii*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Benthochromis tricoti*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Biotoecus opercularis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Boulengerochromis microlepis*     | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Bovichtus variegatus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cantherhines pardalis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Canthigaster coronata*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Canthigaster rostrata*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Caquetaia kraussii*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cardiopharynx schoutedeni*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Centropomus ensiferus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chaenocephalus aceratus*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chaenodraco wilsoni*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Champsocephalus esox*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Champsocephalus gunnari*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Channichthys rhinoceratus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chaudhuria caudata*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cheilodipterus artus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chelonodon patoca*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chetia mola*                      | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chilomycterus reticulatus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chilotilapia rhoadesii*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chionodraco hamatus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chionodraco myersi*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chionodraco rastrospinosus*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chironemus bicornis*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chironemus maculosus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chonerhinos naritus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chrionema furunoi*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Chrysiptera brownriggii*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cichlasoma boliviense*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cleithracara maronii*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Congiopodus leucopaecilus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cottoperca gobio*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Crapatalus munroi*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Crenicichla sveni*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cryodraco antarcticus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cryodraco atkinsoni*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cryptoheros sajica*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Crystallaria asprella*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cygnodraco mawsoni*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cyphotilapia frontosa*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cyprichromis leptosoma*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Cyrtocara moorii*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dacodraco hunteri*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dascyllus aruanus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dichistius capensis*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dichistius multifasciatus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dicrossus filamentosus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dinolestes lewini*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dinoperca petersi*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Diodon hystrix*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dischistodus melanotus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dissostichus mawsoni*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Doederleinia berycoides*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Dolloidraco longedorsalis*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Echiichthys vipera*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Enigmapercis sp*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Epigonus telescopus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Eretmodus cyanostictus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Erilepis zonifer*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma akatulo*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma artesiae*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma asprigene*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma australe*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma baileyi*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma barbouri*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma barrenense*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma bellator*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma binotatum*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma blennioides*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma blennius*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma caeruleum*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma cervus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma cf*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma chienense*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma chlorosomum*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma cinereum*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma coosae*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma ditrema*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma duryi*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma euzonum*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma flabellare*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma forbesi*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma fusiforme*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma gracile*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma histrio*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma hopkinsi*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma jessiae*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma kanawhae*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma knt*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma lepidum*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma longimanum*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma luteovinctum*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma lynceum*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma mariae*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma mediae*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma microperca*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma nigrum*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma okaloosae*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma olivaceum*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma olmstedi*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma pallididorsum*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma parvipinne*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma phytophilum*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma proeliare*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma pseudovulatum*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma pyrrhogaster*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma rafinesquei*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma rupestre*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma sagitta*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma serrifer*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma smithi*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma stigmaeum*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma thalassinum*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma trisella*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma tuscumbia*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma vitreum*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Etheostoma zonale*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Eviota abax*                      | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Forbesichthys agassizii*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Forbesichthys papilliferus*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gambusia holbrooki*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Geophagus iporangensis*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gerlachea australis*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Girella nigricans*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Glossogobius olivaceus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Glyptauchen panduratus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gnathochromis pfefferi*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gobiocichla ethelwynnae*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gobionotothen acuticeps*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gobionotothen gibberifrons*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gobionotothen marionensis*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Goodea atripinnis*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Grahamichthys radiata*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Graus nigra*                      | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gymnapistes marmoratus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gymnocephalus cernua*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gymnodraco acuticeps*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Gymnogobius breunigii*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hapalogenys dampieriensis*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Haplochromis latifasciatus*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Haplochromis luteus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Haplotaxodon microlepis*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Harpagifer antarcticus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hemichromis elongatus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hemichromis letourneuxi*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hemichromis sp*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hemiglyphidodon plagiometopon*    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hermosilla azurea*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Histiodraco velifer*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hypselecara temporalis*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Hypsypops rubicundus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Inimicus didactylus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Konia eisentrauti*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Kraemeria bryani*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Kyphosus sectatrix*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lactarius lactarius*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lactoria cornuta*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Laetacara curviceps*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lagocephalus laevigatus*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lateolabrax latus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lates microlepis*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Latridopsis forsteri*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Latris lineata*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lepadichthys lineatus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lepidonotothen larseni*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lepidonotothen nudifrons*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lepidonotothen squamifrons*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lepidozygus tapeinosoma*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Leptobrama muelleri*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lesueurina platycephala*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Limnichthys fasciatus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Limnotilapia dardennii*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Liopropoma mowbrayi*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Liopropoma susumi*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lipogramma trilineata*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Lophotus capellei*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Marilyna darwinii*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Matsubaraea fusiforme*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Mecaenichthys immaculatus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Medialuna californiensis*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Mesonauta egregius*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Mesonauta festivus*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Mesonauta insignis*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Mesonauta mirificus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Metavelifer multiradiatus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Mikrogeophagus ramirezi*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Milyeringa veritas*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Minous trachycephalus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Monacanthus chinensis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Monotrete leiurus*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Myaka myaka*                      | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nandopsis salvini*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nandopsis tetracanthus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nanochromis parilus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Neoglyphidodon melas*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Neolamprologus brevis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Neolamprologus toae*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Neopagetopsis ionah*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Neopomacentrus nemurus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Neosebastes thetidis*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Normanichthys crockeri*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothobranchius furzeri*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus acuticeps*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus camurus*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus chuckwachatte*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus jordani*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus juliae*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus maculatus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus rufilineatus*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Nothonotus tippecanoe*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Notothenia angustata*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Notothenia coriiceps*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Notothenia rossii*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ocosia zaspilota*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ophiocara porocephala*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ophiodon elongatus*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ophthalmotilapia ventralis*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Oreochromis tanganicae*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Orthochromis luongoensis*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Osopsaron formosensis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Oxymonacanthus longirostris*      | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pagetopsis macropterus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pagetopsis maculatus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pagothenia borchgrevinki*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pagrus pagrus*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Paracentropogon rubripinnis*      | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Parachaenichthys charcoti*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Parachaenichthys georgianus*      | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Parachromis managuensis*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Paracyprichromis brieni*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Parahollardia lineata*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Paretroplus dambabe*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Parma microlepis*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen cornucola*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen elegans*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen guntheri*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen longipes*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen ramsayi*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen sima*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen squamiceps*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen tessellata*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Patagonotothen wiltoni*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Perca schrenkii*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina aurantiaca*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina aurolineata*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina bimaculata*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina carbonaria*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina cf*                       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina copelandi*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina crassa*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina evides*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina kusha*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina macrocephala*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina maculata*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina nevisense*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina oxyrhynchus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina palmaris*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina peltata*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina roanoka*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina sciera*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina shumardi*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina stictogaster*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percina vigil*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percophis brasiliensis*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Percopsis transmontana*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Petrochromis polyodon*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Phaeoptyx conklini*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Plecodus straeleni*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Plectroglyphidodon dickii*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pleuragramma antarctica*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pogonophryne barsukovi*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pogonophryne cerebropogon*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pogonophryne eakini*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pogonophryne immaculata*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pogonophryne macropogon*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pogonophryne marmorata*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pogonophryne scotti*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Polyprion americanus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pomacentrus nigromanus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pomachromis richardsoni*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Premnas biaculeatus*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Prionodraco evansii*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pristiapogon kallopterus*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Profundulus labialis*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Psammoperca waigiensis*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Psedocrenilabrus sp*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pseudaphritis urvillii*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pseudochaenichthys georgianus*    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pseudosimochromis curvifrons*     | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pseudotriacanthus strigilifer*    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Psilodraco breviceps*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pterophyllum leopoldi*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pteropsaron springeri*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ptilichthys goodei*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Ptychochromis oligacanthus*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Pungu maclareni*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Racovitzia glacialis*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Reganochromis calliurus*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Retroculus xinguensis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Rhinecanthus aculeatus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Rhyacichthys aspro*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Rocio octofasciata*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Romanichthys valsanicola*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Rosenblattia robusta*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Sander vitreus*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Sarotherodon galilaeus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Satanoperca jurupari*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Scombrolabrax heterolepis*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Scombrops boops*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Scombrops gilberti*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Scorpis violacea*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Serranochromis angusticeps*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Sicyopterus japonicus*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Spathodus marlieri*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Speoplatyrhinus poulsoni*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Sphaeramia nematoptera*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Sphoeroides pachygaster*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Spicara australis*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Spicara smaris*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Steatocranus tinanti*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Steatocranus ubanguiensis*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Stephanolepis cirrhifer*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Stomatepia pindu*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Symphysanodon berryi*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Symphysanodon octoactinus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Synagrops philippinensis*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Takifugu ocellatus*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tetragonurus cuvieri*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tetraodon mbu*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tewara cranwellae*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Thalasseleotris iota*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Thoracochromis brauschi*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Thorichthys meeki*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tilapia mariae*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tilapia ruweti*                   | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tilapia sparrmanii*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tilodon sexfasciatus*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tomocichla sieboldii*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Torquigener pleurogramma*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trachinus draco*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus bernacchii*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus eulepidotus*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus hansoni*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus lepidorhinus*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus loennbergii*           | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus newnesi*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus nicolai*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus pennellii*             | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus scotti*                | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus tokarevi*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trematomus vicarius*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Triacanthodes ethiops*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Triacanthus nieuhofii*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trichonotus elegans*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trichonotus filamentosus*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     |      | ✔    |
| *Trichonotus setiger*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Trixiphichthys weberi*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tropheus duboisi*                 | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tydemania navigatoris*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tylochromis lateralis*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tylochromis mylodon*              | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Typhlichthys subterraneus*        | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Tyrannochromis nigriventer*       | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Uaru amphiacanthoides*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Vomeridens infuscipinnis*         | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Yongeichthys criniger*            | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Zalembius rosaceus*               | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Zanclorhynchus spinifer*          | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Zaprora silenus*                  | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Zingel asper*                     | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Zingel zingel*                    | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     | ✔    | ✔    |
| *Zu elongatus*                     | ✔    | ✔    | ✔    | ✔      | ✔   | ✔    | ✔      | ✔     |      | ✔    |

</details>

# Taxonomic reconciliation

We wrote a custom web scraper in Python to download all accepted scientific names, synonyms, and taxonomy for Actinopterygii fishes from FishBase. We then loaded all aligned PHLAWD sequences into an SQLite database to record all taxonomic changes in a consistent format.


We then used a custom Python script to attempt to reconcile the GenBank species names against our known FishBase taxonomy. Species names were matched using the following algorithms, in order:

1. Exact scientific name
2. Exact valid synonym
3. Exact common name
4. Exact scientific name without subspecies epithet
5. Exact valid synonym, without subspecies epithet
6. Apply manual taxonomic corrections
7. Fuzzy match against scientific names based on the gestalt pattern matching algorithm
8. Fuzzy match against valid synonyms based on the gestalt pattern matching algorithm
9. Adding unambiguous-but-unmatched species with more than 2 genes, as these are likely to be new species that had not yet been included in FishBase


After these automated mechanisms, we examined matches by hand and manually corrected any mis-assignations, then checked for sequences that were identical, yet were mapped to different species. Our taxonomic reconciliation process matched 46/46 orders of fish (100%), 454/480 families (94.6%), and 3,368/4,853 genera (69.4%), as measured against FishBase.

|Matching method                      |  Count|
|:------------------------------------|------:|
|Exact scientific name                | 11,368|
|Exact synonym                        |    623|
|Manual taxonomic corrections         |    131|
|Unmatched-but-unambiguous            |     84|
|Exact scientific name, no subspecies |     69|
|Fuzzy scientific name                |     61|
|Fuzzy synonym                        |     12|
|Exact synonym, no subspecies         |      9|

Table: Taxonomic reconciliation by match type.

# Rogue searching

To eliminate rogue taxa, which reduce the bootstrap support of phylogenies due to their unstable position, we conducted a RogueNaRok analysis and searched for sets of up to 3 species that could be dropped to improve bootstrap support on an unconstrained phylogenetic analysis. RogueNaRok iteratively removes taxa and estimates their impact on bootstrap support; this impact is dependent on the identity of all other taxa removed before it. We therefore excluded all taxa or sets of taxa up to the point where dropping any subsequent taxa would fail to improve bootstrap support by more than 1. A total of 645 species were removed in this manner, with 152 and 102 species removed as part of a 2-species and 3-species set, respectively.


# Tree searching

We conducted an initial tree search using RAxML v8.1.17 using the fast ML search convergence criterion for large trees (option `-D`) and the SEV-based implementation for gap columns (option `-U`). The analysis took approximately 4 days of wall-clock time on a 24-core Intel Xeon E5-2690v3 x2 compute machine.


|gene          |   n|gene                |   n|
|:-------------|---:|:-------------------|---:|
|*12s*         |  27|*ptr*               |  13|
|*16s*         |  84|*rag1*              |  27|
|*4c4*         |  17|*rag2*              |   6|
|*coi*         | 175|*rhodopsin*         |  20|
|*cytb*        |  70|*ripk4*             |   8|
|*enc1*        |   9|*sh3px3*            |   8|
|*ficd*        |  14|*sidkey*            |   8|
|*glyt*        |   1|*sreb2*             |   4|
|*hoxc6a*      |   7|*svep1*             |   6|
|*kiaa1239*    |   5|*tbr1*              |  11|
|*myh6*        |  15|*vcpip*             |   8|
|*panx2*       |  11|*zic1*              |  14|
|*plagl2*      |   9|**total sequences** | 577|

Table: Gene sequences excluded due to rogue behavior or high identity BLAST matches outside of their species' assigned family.


We then generated individual family-level phylogenies by extracting the subtree descended from the most recent common ancestor of all species in each family, and automatically marked descendent taxa that were from outside the focal family. We then assessed the quality of the phylogeny on a family-by-family basis, and marked any taxa that exhibited rogue behavior.

We then removed tips that had extremely long branches, as these potentially indicated areas of poor sequence quality or alignment. Using the final filtered dataset, which contained 11,644 tips, we reran a maximum likelihood analysis in RAxML and computed node support values using the SH-like statistic, as it is conservative at estimating support values like standard bootstrapping but runs much faster.

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


# Computing tip-specific speciation rates

We computed speciation rates via three primary mechanisms: with BAMM, with the DR statistic, and with the interval-rates method.

BAMM uses a Bayesian reversible-jump Markov Chain Monte Carlo (MCMC) algorithm to identify the location and estimate the parameters of various diversification rate regimes on a time-calibrated. BAMM attempts to identify macroevolutionary rate shift configurations and generates a distribution of posterior samples. A full set of these posterior samples can be summarized, for example, by computing the mean rate for each tip in the phylogeny or as a marginal posterior distribution of tip rates.  We also check for sensitivity of the BAMM analysis to its priors for the time-varying BAMM analyses, and find that the posterior distribution is independent of the prior.


The DR statistic, for "diversification rate", is a summary statistic that infers recent speciation rates for all tips in the phylogeny without requiring a formal parametric inference model. DR is itself the inverse of the equal-splits measure, where the equal-splits measure (ES) for a tip i is equal to:

<math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>E</mi><msub><mi>S</mi><mi>i</mi></msub><mo>=</mo><munderover><mo>∑</mo><mrow><mi>j</mi><mo>=</mo><mn>1</mn></mrow><msub><mi>N</mi><mi>i</mi></msub></munderover><msub><mi>l</mi><mi>j</mi></msub><mfrac><mn>1</mn><msup><mn>2</mn><mrow><mi>j</mi><mo>-</mo><mn>1</mn></mrow></msup></mfrac></mrow><annotation encoding="TeX">ES_i = \sum_{j=1}^{N_i} l_j \frac{1}{2^{j-1}}</annotation></semantics></math>

where N<sub>i</sub> are the number of nodes between tip i and the root, l<sub>j</sub> is the length of edge j where j=1 is the edge leading to tip i. Intuitively, it is the weighted mean of the inverse of branch lengths. DR approximates the speciation rate of a phylogeny diversifying under a Yule (pure-birth) process; for a full proof see section 1.2.2 of the supplement of Jetz et al. (2012). DR's approximation of the true speciation rate is a useful property and can be used to cross-check speciation rate estimates obtained through BAMM.

As a third independent estimate of speciation rate, we use the interval-rates method, or node-density measure. This is an estimate of the speciation rate over a certain period of time. It is the number of nodes that exist on a phylogeny over a certain interval, divided by the amount of time that interval spans, and is an extremely simple way to compute a speciation rate.


# References

* [@Arratia2000](https://doi.org/10.1002/mmng.20000030108)
* [@Eschmeyer2017](http://www.calacademy.org/scientists/projects/catalog-of-fishes)
* [@Friedman2012](https://doi.org/10.1111/j.1475-4983.2012.01165.x)
* [@Friedman2013](https://doi.org/10.1098/rspb.2013.1733)
* [@Friedman2015](https://doi.org/10.1111/pala.12150)
* [@Froese2014](http://fishbase.org)
* [@Grande1991](https://doi.org/10.1080/02724634.1991.10011424)
* [@Grande1996](https://doi.org/10.1016/B978-012670950-6/50006-0)
* [@Harrington2016](https://doi.org/10.1186/s12862-016-0786-x)
* [@Hedman2010](https://doi.org/10.1666/0094-8373-36.1.16)
* [@Hilton2009](https://doi.org/10.1017/S1477201909002740)
* [@Hurley2007](https://doi.org/10.1098/rspb.2006.3749)
* [@Lloyd2016](https://doi.org/10.1111/bij.12746)
* [@Near2012](https://doi.org/10.1073/pnas.1206625109)
* [@Sallan2010](https://doi.org/10.1073/pnas.0914000107)
* [@Sallan2012](https://doi.org/10.1098/rspb.2011.2454)
* [@Sallan2014](https://doi.org/10.1111/brv.12086)
* [@Sanderson1996](https://doi.org/10.1093/sysbio/45.2.168)
* [@Stadler2009](https://doi.org/10.1016/j.jtbi.2009.07.018)
* [@Stadler2011a](https://doi.org/10.1073/pnas.1016876108)
* [@Stadler2011b](https://doi.org/10.1093/sysbio/syr029)
* [@Xu2014](https://doi.org/10.1080/02724634.2014.837053)
