#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(glue)
library(stringr)

options(mc.cores = parallel::detectCores())

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

generate_family_data <- function(family) {
    family_name <- unique(family$family)
    species <- family$genus.species
    sampled_species <- species[species %in% tips]
    species_yaml <- paste0("    - ", paste(species, collapse = "\n    - "))
    sampled_species_yaml <- paste0("    - ", paste(sampled_species, collapse = "\n    - "))
    order <- unique(family$order)

    if (length(sampled_species) > 4) {
        tree_species <- str_replace_all(sampled_species, " ", "_")
        mrca_tree <- extract.clade(tre, getMRCA(tre, tree_species))
        pruned_tree <- drop.tip(mrca_tree, mrca_tree$tip.label[!mrca_tree$tip.label %in% tree_species])
        mrca_filename <- paste0(family_name, "_mrca.tre")
        pruned_filename <- paste0(family_name, "_pruned.tre")
        write.tree(mrca_tree, file.path("downloads/family", mrca_filename))
        write.tree(pruned_tree, file.path("downloads/family", pruned_filename))
    }

    sink(paste0(basepath, paste0(family_name, ".md")))
    cat(glue(template), fill = T)
    sink(NULL)
}

parallel::mclapply(split(tax, tax$family), generate_family_data)
