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

num_rogues: {num_rogues}
---
"

basepath <- "_family/"
downloadpath <- "downloads/family"
dir.create(basepath, recursive = T)
dir.create(downloadpath, recursive = T)
tips <- str_replace_all(tre$tip.label, "_", " ")

generate_family_data <- function(family) {
    family_name <- unique(family$family)
    species <- family$genus.species
    sampled_species <- species[species %in% tips]
    species_yaml <- paste0("    - ", paste(species, collapse = "\n    - "))
    sampled_species_yaml <- paste0("    - ", paste(sampled_species, collapse = "\n    - "))
    if (length(sampled_species) == 0) sampled_species_yaml <- ""
    order <- unique(family$order)

    num_rogues <- 0
    if (length(sampled_species) > 4) {
        tree_species <- str_replace_all(sampled_species, " ", "_")
        mrca_tree <- extract.clade(tre, getMRCA(tre, tree_species))
        good_filename <- paste0(family_name, ".tre")
        mrca_filename <- paste0(family_name, "_mrca.tre")
        pruned_tree <- drop.tip(mrca_tree, mrca_tree$tip.label[!mrca_tree$tip.label %in% tree_species])
        num_rogues <- length(mrca_tree$tip.label) - length(pruned_tree$tip.label)
        if (num_rogues == 0) {
            write.tree(mrca_tree, file.path(downloadpath, good_filename))
        } else {
            write.tree(mrca_tree, file.path(downloadpath, mrca_filename))
            write.tree(pruned_tree, file.path(downloadpath, good_filename))
        }
    }

    sink(file.path(basepath, paste0(family_name, ".md")))
    cat(glue(template), fill = T)
    sink(NULL)
}

parallel::mclapply(split(tax, tax$family), generate_family_data)
