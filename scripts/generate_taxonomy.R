#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(glue)
library(stringr)

tre <- read.tree("downloads/actinopt_12k_treePL.tre")
tax <- read_csv("downloads/PFC_short_classification.csv")

template <- "
---
title: {family_name}
species:
{species_yaml}

sampled_species:
{sampled_species_yaml}

order: {order}

---
"

basepath <- "_family/"
dir.create(basepath, recursive = T)
tips <- str_replace_all(tre$tip.label, "_", " ")

for (family in split(tax, tax$family)) {
    family_name <- unique(family$family)
    species <- family$genus.species
    sampled_species <- species[species %in% tips]
    species_yaml <- paste0("    - ", paste(species, collapse = "\n    - "))
    sampled_species_yaml <- paste0("    - ", paste(sampled_species, collapse = "\n    - "))
    order <- unique(family$order)
    sink(paste0(basepath, paste0(family_name, ".md")))
    cat(glue(template), fill = T)
    sink(NULL)
}
