#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(glue)
library(stringr)
library(future)

# Set futures max size to 1GB
options(mc.cores = parallel::detectCores(), future.globals.maxSize = 1024^3)
cat(parallel::detectCores())

plan(multicore)

tre %<-% read.tree("downloads/actinopt_12k_treePL.tre.xz")
tax %<-% read_csv("downloads/PFC_short_classification.csv.xz")
dna %<-% scan("downloads/final_alignment.phylip.xz", what = list(character(), character()), quiet = TRUE, nlines = 11650, strip.white = TRUE, skip = 1)

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
dna[[1]] <- str_replace_all(dna[[1]], "_", " ")

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

    if (length(sampled_species) > 0) {
        wanted_spp <- dna[[1]][dna[[1]] %in% sampled_species]
        wanted_dna <- dna[[2]][dna[[1]] %in% sampled_species]
        sink(file.path(downloadpath, paste0(family_name, ".phylip")))
        cat(paste(length(wanted_spp), nchar(wanted_dna[1])), fill = TRUE)
        for (ii in 1:length(wanted_spp)) {
            cat(wanted_spp[ii])
            cat(" ")
            cat(wanted_dna[ii], fill = TRUE)
        }
        sink(NULL)
    }

    sink(file.path(mdpath, paste0(family_name, ".md")))
    cat(glue(template), fill = T)
    sink(NULL)
}

# ensure the DNA future is resolved
str(dna)

splat <- split(tax, tax$family)

res <- parallel::mclapply(splat, generate_family_data)

length(splat)
length(res)

cmd <- glue("ls {file.path(downloadpath, '*.phylip')} | xargs -n20 -P{parallel::detectCores()} xz -0e")
system(cmd)
