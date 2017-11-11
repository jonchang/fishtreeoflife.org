#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(glue)
library(stringr)

options(mc.cores = parallel::detectCores())
cat(parallel::detectCores())

tre <- read.tree("downloads/actinopt_12k_treePL.tre.xz")
tax <- read_csv("downloads/PFC_short_classification.csv.xz")

template <- "
---
title: {family_name}
order: {order}
num_rogues: {num_rogues}
---
"

datapath <- "_data/family/"
mdpath <- "_family/"
downloadpath <- "downloads/family"

dir.create(mdpath, recursive = T)
dir.create(datapath, recursive = T)
dir.create(downloadpath, recursive = T)

tips <- str_replace_all(tre$tip.label, "_", " ")

generate_family_data <- function(family) {
    family_name <- unique(family$family)
    species <- family$genus.species
    sampled_species <- species[species %in% tips]
    order <- unique(family$order)

    fam_df <- data_frame(species = species) %>% mutate(sampled = as.integer(species %in% sampled_species))
    write_csv(fam_df, file.path(datapath, paste0(family_name, ".csv")))

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

    sink(file.path(mdpath, paste0(family_name, ".md")))
    cat(glue(template), fill = T)
    sink(NULL)
}

parallel::mclapply(split(tax, tax$family), generate_family_data)
