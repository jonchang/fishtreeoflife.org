#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(glue)
library(stringr)
library(future)
library(jsonlite)


source("scripts/lib.R")

# Set futures max size to 1GB
options(future.globals.maxSize = 1024^3)

# travis OOMs with 32 cores...
cores <- parallel::detectCores()
options(mc.cores = cores)
if (Sys.getenv("TRAVIS") == "true" && cores >= 32) {
    options(mc.cores = cores / 2)
}

plan(multicore)

tre %<-% read.tree("downloads/actinopt_12k_treePL.tre.xz")
tre2 %<-% read.tree("downloads/actinopt_12k_raxml.tre.xz")
tax %<-% read_csv("downloads/PFC_short_classification.csv.xz")
dna %<-% scan("downloads/final_alignment.phylip.xz", what = list(character(), character()), quiet = TRUE, nlines = 11650, strip.white = TRUE, skip = 1)
charsets <- readLines("downloads/final_alignment.partitions") %>% str_replace_all(fixed("DNA, "), "")
fossils <- read_csv("_data/fossil_data.csv")

datapath <- "_data/"
mdpath <- "_family/"
downloadpath <- "downloads/family"

dir.create(mdpath, recursive = T)
dir.create(datapath, recursive = T)
dir.create(downloadpath, recursive = T)

tips <- str_replace_all(tre$tip.label, "_", " ")
dna[[1]] <- str_replace_all(dna[[1]], "_", " ")

generate_family_data <- function(family) {
    out <- list()
    out$species <- family$genus.species
    out$sampled_species <- out$species[out$species %in% tips]
    out$order <- unique(family$order)
    family <- unique(family$family)
    out$family <- family

    out$num_rogues <- 0
    if (length(out$sampled_species) > 0) {
        wanted_spp <- dna[[1]][dna[[1]] %in% out$sampled_species] %>% str_replace_all(" ", "_")
        wanted_dna <- dna[[2]][dna[[1]] %in% out$sampled_species]
        out$matrix_phylip <- file.path(downloadpath, paste0(family, ".phylip.xz"))
        out$matrix_nexus <- file.path(downloadpath, paste0(family, ".nex.xz"))
        make_phylip(out$matrix_phylip, wanted_spp, wanted_dna)
        make_nexus(out$matrix_nexus, wanted_spp, wanted_dna)
        if (length(out$sampled_species) > 2) {
            chrono <- get_rank_trees(tre, out$sampled_species)
            phylog <- get_rank_trees(tre, out$sampled_species)
            out$chronogram <- file.path(downloadpath, paste0(family, ".tre"))
            out$phylogram <- file.path(downloadpath, paste0(family, "_phylogram.tre"))
            write.tree(chrono$pruned_tree, out$chronogram)
            write.tree(phylog$pruned_tree, out$phylogram)
            make_nexus(out$matrix_nexus, wanted_spp, wanted_dna, tree = chrono$pruned_tree, charsets = charsets)
            out$num_rogues <- chrono$num_rogues
            if (out$num_rogues > 0) {
                out$chronogram_mrca <- file.path(downloadpath, paste0(family, "_mrca.tre"))
                out$phylogram_mrca <- file.path(downloadpath, paste0(family, "_mrca_phylogram.tre"))
                write.tree(chrono$mrca_tree, out$chronogram_mrca)
                write.tree(phylog$mrca_tree, out$phylogram_mrca)
            }
        }
    }

    no_unbox <- c("species", "sampled_species")
    for (nn in names(out)) {
        if (!nn %in% no_unbox) out[[nn]] <- unbox(out[[nn]])
    }
    cat("---\n\n---\n", file = file.path(mdpath, paste0(family, ".md")))
    out
}

# ensure the futures are resolved
invisible(dna)
invisible(tre)
invisible(tre2)

splat <- split(tax, tax$family)
res <- parallel::mclapply(splat, generate_family_data)

cat(toJSON(res), file = file.path(datapath, "family.json"))

q()

# implement exponential backoff for multicore runs because travis is bad with IO or something
repeat {
    notrun <- setdiff(names(splat), names(res))
    if (length(notrun) == 0) break
    cores <- getOption("mc.cores")
    if (cores <= 1) {
        cat(paste("running", length(notrun), "jobs serially\n"))
        res2 <- lapply(notrun, function(x) generate_family_data(splat[[x]]))
        names(res2) <- notrun
        res <- c(res, res2)
    } else {
        cat(paste("running", length(notrun), "jobs with", getOption("mc.cores"), "cores\n"))
        res2 <- parallel::mclapply(notrun, function(x) generate_family_data(splat[[x]]))
        res <- c(res, res2)
    }
    options(mc.cores = cores / 2)
}
