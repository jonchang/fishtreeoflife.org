---
layout: page
title: About
description: Citing the ray-finned fish phylogeny, information about the Fish Tree of Life
---

# Citing

If you use any phylogenetic products derived from this website, including taxonomic resources and fossil calibration constraints, please cite:

<p markdown="0">
Daniel L. Rabosky*, Jonathan Chang*, Pascal O. Title*, Peter F. Cowman, Lauren Sallan, Matt Friedman, Kristin Kaschner, Cristina Garilao, Thomas J. Near, Marta Coll, Michael E. Alfaro* (2018).  An inverse latitudinal gradient in speciation rate for marine fishes. <em>Nature</em>, 559(7714), 392&ndash;395 doi:<a href="https://doi.org/10.1038/s41586-018-0273-1">10.1038/s41586-018-0273-1</a>
</p>

We also offer an R package that provides programmatic access to the data products on this website, [`fishtree`](https://cran.r-project.org/package=fishtree); you can browse [web documentation for `fishtree` here]({% link fishtree/index.html %}). If you use this R package or web API, please additionally cite:

Jonathan Chang, Daniel L. Rabosky, Stephen A. Smith, Michael E. Alfaro (2019). An R package and online resource for macroevolutionary studies using the ray‐finned fish tree of life. *Methods in Ecology and Evolution*, 10:1118--1124 doi:[10.1111/2041-210x.13182](https://doi.org/10.1111/2041-210x.13182)

We have also [released a set of enhanced ATA trees]({% link downloads/index.md %}); the details on how these ATA distributions differ are detailed in [Rabosky et al. 2018 update]({% link rabosky-et-al-2018-update.md %}). [The original set of ATA phylogenies are available via Dryad](https://doi.org/10.5061/dryad.fc71cp4). The taxonomic addition algorithm using stochastic polytomy resolution (TACT: Taxonomic Addition for Complete Trees) that generated these ATA phylogenies was published as:

Jonathan Chang, Daniel L. Rabosky, Michael E. Alfaro (2019). Estimating diversification rates on incompletely-sampled phylogenies: theoretical concerns and practical solutions. *Systematic Biology*, doi:[10.1093/sysbio/syz081](https://doi.org/10.1093/sysbio/syz081)

<!---

The manuscript detailing our Phylogentic Fish Classification is currently in preparation.
-->

# Contact

For issues or feature requests for the website, please contact [Jonathan Chang](https://jonathanchang.org).

Significant contributors to this website and its data sources include:

* [Dan Rabosky](http://www.raboskylab.org/)
* [Michael Alfaro](https://michaelalfaro.github.io/alfaro-lab/)
* [Jonathan Chang](https://jonathanchang.org)
* [Pascal Title](https://pascaltitle.weebly.com/)

Other critical contributors include:

* [Peter Cowman](http://petercowman.weebly.com/)
* [Lauren Sallan](http://www.laurensallan.com/)
* [Matt Friedman](https://lsa.umich.edu/paleontology/people/curators/mfriedm.html)
* [Kristin Kaschner](http://www.biom.uni-freiburg.de/mitarbeiter/Alumni/kaschner)
* [Cristina Garilao](https://www.geomar.de/en/mitarbeiter/fb3/ev/cgarilao/)
* [Tom Near](http://nearlab.yale.edu/)
* [Marta Coll](http://martacoll.science/)

# Future updates

We are also interested in fixing any phylogenetic and taxonomic errors in a future revision of the Fish Tree of Life, especially rogue taxa that break the monophyly of well-studied lineages. Known issues include:

* Total group *Hippocampus* age should be 11 Ma
* Relationships within Cichlidae are not quite correct
* *Chlorurus gibbus* has rogue behavior
* *Takifugu fasciatus* is actually *T. obscurus*
* Sister relationship of *Salvelinus*
* *Thalassenchelys coheni* = *Congriscus megastomus* (Kurogi et al 2015)
* Adding tip rate information for the following species:
    <details>
    <summary>Species list</summary>
    <ul>
    <li>Acheilognathus tabira erythropterus</li>
    <li>Acheilognathus tabira jordani</li>
    <li>Acheilognathus tabira nakamurae</li>
    <li>Acheilognathus tabira tohokuensis</li>
    <li>Anguilla australis schmidtii</li>
    <li>Anguilla bicolor pacifica</li>
    <li>Aphanius dispar richardsoni</li>
    <li>Aphredoderus gib</li>
    <li>Arctogadus borisovi</li>
    <li>Astronotus sp</li>
    <li>Astyanax hubbsi</li>
    <li>Astyanax sp</li>
    <li>Cheilopogon antoncichi</li>
    <li>Chirocentrus sp</li>
    <li>Cobitis sp</li>
    <li>Cyprinodon variegatus ovinus</li>
    <li>Elacatinus digueti</li>
    <li>Enigmapercis sp</li>
    <li>Esox americanus vermiculatus</li>
    <li>Etheostoma binotatum</li>
    <li>Etheostoma mediae</li>
    <li>Forbesichthys papilliferus</li>
    <li>Glyptothorax longinema</li>
    <li>Gobionotothen acuticeps</li>
    <li>Gymnotus sp</li>
    <li>Hemichromis sp</li>
    <li>Hypostomus panamensis</li>
    <li>Mastacembelus signatus</li>
    <li>Mastacembelus stappersii</li>
    <li>Melanotaenia splendida inornata</li>
    <li>Melanotaenia splendida tatei</li>
    <li>Mugil gyrans</li>
    <li>Mugil soiuy</li>
    <li>Paraneetroplus melanurus</li>
    <li>Percina cf</li>
    <li>Phoxinus lumaireul</li>
    <li>Plecoglossus altivelis ryukyuensis</li>
    <li>Pseudocrenilabrus sp</li>
    <li>Pseudophoxinus chaignoni</li>
    <li>Rhamdia cabrerae</li>
    <li>Rutilus ohridanus</li>
    <li>Rutilus prespensis</li>
    <li>Salvelinus leucomaenis imbrius</li>
    <li>Salvelinus leucomaenis pluvius</li>
    <li>Sarcocheilichthys nigripinnis morii</li>
    <li>Sarcocheilichthys sinensis fukiensis</li>
    <li>Schizothorax yunnanensis paoshanensis</li>
    <li>Schizothorax yunnanensis weiningensis</li>
    <li>Scleromystax kronei</li>
    <li>Simochromis pleurospilus</li>
    <li>Takifugu fasciatus</li>
    </ul>
    </details>



If you identify any issues, [please fill out this survey](https://docs.google.com/forms/d/e/1FAIpQLSeyE_NT5WiQA3Er62ZJzIHrRnOP0ASzPYrh294Nr5pOm4kTDg/viewform?usp=sf_link) so we can collate all fixes for a future revision. Thanks!

# Source code

The source code for this website is available on GitHub: [jonchang/fishtreeoflife.org](https://github.com/jonchang/fishtreeoflife.org/).

# Funding

Development of this website was supported in part by NSF grant DEB-1256330 (to D.L.R.) and DEB-1601830 (to J.C. and M.E.A.), an Encyclopedia of Life Rubenstein Fellowship EOL-33066-13 (to J.C.), the David and Lucile Packard Foundation (to D.L.R.), the Gaylord Donnelley Postdoctoral Environment Fellowship and the ARC Centre of Excellence for Coral Reef Studies (to P.F.C.).

This website's maintenance is not currently not supported by any grant or organization. Please consider sponsoring it [via a recurring donation](https://github.com/jonchang/fishtreeoflife.org/#sponsorship).
