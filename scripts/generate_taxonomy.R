#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(glue)
library(stringr)
library(future)

# Set futures max size to 1GB
options(future.globals.maxSize = 1024^3)

# Travis has problems with very parallel jobs (IO issue?)
if (Sys.getenv("TRAVIS") == "true") {
    options(mc.cores = parallel::detectCores() / 2)
} else {
    options(mc.cores = parallel::detectCores())
}

cat(getOption("mc.cores"))

plan(multicore)

tre %<-% read.tree("downloads/actinopt_12k_treePL.tre.xz")
tre2 %<-% read.tree("downloads/actinopt_12k_raxml.tre.xz")
tax %<-% read_csv("downloads/PFC_short_classification.csv.xz")
dna %<-% scan("downloads/final_alignment.phylip.xz", what = list(character(), character()), quiet = TRUE, nlines = 11650, strip.white = TRUE, skip = 1)
charsets <- readLines("downloads/final_alignment.partitions") %>% str_replace_all(fixed("DNA, "), "")
fossils <- read_csv("_data/fossil_data.csv")

template <- "
---
title: {family_name}
order: {order}
num_rogues: {num_rogues}
---
"

nexus_data <- "#nexus
begin data;
dimensions ntax={ntax} nchar={nchar};
format datatype=dna interleave=no gap=-;
matrix
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
    if (length(sampled_species) > 2) {
        tree_species <- str_replace_all(sampled_species, " ", "_")
        mrca_tree <- extract.clade(tre, getMRCA(tre, tree_species))
        mrca_tree2 <- extract.clade(tre2, getMRCA(tre2, tree_species))
        good_filename <- paste0(family_name, ".tre")
        mrca_filename <- paste0(family_name, "_mrca.tre")
        phylogram_good_filename <- paste0(family_name, "_phylogram.tre")
        phylogram_mrca_filename <- paste0(family_name, "_phylogram_mrca.tre")
        pruned_tree <- drop.tip(mrca_tree, mrca_tree$tip.label[!mrca_tree$tip.label %in% tree_species])
        pruned_tree2 <- drop.tip(mrca_tree2, mrca_tree2$tip.label[!mrca_tree2$tip.label %in% tree_species])
        num_rogues <- length(mrca_tree$tip.label) - length(pruned_tree$tip.label)
        if (num_rogues == 0) {
            write.tree(mrca_tree, file.path(downloadpath, good_filename))
            write.tree(mrca_tree2, file.path(downloadpath, phylogram_good_filename))
        } else {
            write.tree(mrca_tree, file.path(downloadpath, mrca_filename))
            write.tree(pruned_tree, file.path(downloadpath, good_filename))
            write.tree(mrca_tree2, file.path(downloadpath, phylogram_mrca_filename))
            write.tree(pruned_tree2, file.path(downloadpath, phylogram_good_filename))
        }
    }

    if (length(sampled_species) > 0) {
        wanted_spp <- dna[[1]][dna[[1]] %in% sampled_species] %>% str_replace_all(" ", "_")
        wanted_dna <- dna[[2]][dna[[1]] %in% sampled_species]
        ntax <- length(wanted_spp)
        ncha <- nchar(wanted_dna[1])
        # Generate PHYLIP file
        sink(file.path(downloadpath, paste0(family_name, ".phylip")))
        cat(paste(ntax, ncha), fill = TRUE)
        for (ii in 1:length(wanted_spp)) {
            cat(wanted_spp[ii])
            cat(" ")
            cat(wanted_dna[ii], fill = TRUE)
        }
        sink(NULL)

        # Generate NEXUS file
        sink(file.path(downloadpath, paste0(family_name, ".nex")))
        glue(nexus_data, ntax = ntax, nchar = ncha) %>% cat(fill = TRUE)
        for (ii in 1:length(wanted_spp)) {
            cat(wanted_spp[ii])
            cat(" ")
            cat(wanted_dna[ii], fill = TRUE)
        }
        cat(";\nend;\n\nbegin assumptions;\n")
        for (ii in 1:length(charsets)) {
            cat(paste0("charset ", charsets[ii], ";\n"))
        }
        cat("end;\n\n")
        if (length(sampled_species) > 2) {
            cat("begin trees;\n")
            cat("tree time_calibrated =", write.tree(pruned_tree))
            cat("\nend;\n")
        }
        sink(NULL)
    }

    sink(file.path(mdpath, paste0(family_name, ".md")))
    cat(glue(template), fill = T)
    sink(NULL)
}

# ensure the futures are resolved
invisible(dna)
invisible(tre)
invisible(tre2)

splat <- split(tax, tax$family)

res <- parallel::mclapply(splat, generate_family_data)

files <- str_replace_all(basename(Sys.glob(file.path(mdpath, "*.md"))), ".md", "")

# check that we have all the output and if not re-run in serial mode
notrun <- setdiff(names(splat), files)

if (length(notrun) > 0) {
    cat(paste0("rerunning ", length(notrun), " jobs in serial mode\n"))
    res2 <- lapply(splat[notrun], generate_family_data)
    res <- c(res, res2)
}


cmd <- glue("find downloads \\( -name '*.phylip' -o -name '*.nex' \\) -print | xargs -n20 -P{parallel::detectCores()} xz -6e")
system(cmd)
