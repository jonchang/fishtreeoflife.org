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

dir.create(datapath, recursive = T)

tips <- str_replace_all(tre$tip.label, "_", " ")
dna[[1]] <- str_replace_all(dna[[1]], "_", " ")

generate_rank_data <- function(df, current_rank, downloadpath, mdpath) {
    out <- list()
    out$species <- df$genus.species
    out$sampled_species <- out$species[out$species %in% tips]
    out$order <- unique(df$order)
    out$family <- unique(df$family)
    rankname <- out[[current_rank]]

    out$num_rogues <- 0
    if (length(out$sampled_species) > 0) {
        wanted_spp <- dna[[1]][dna[[1]] %in% out$sampled_species] %>% str_replace_all(" ", "_")
        wanted_dna <- dna[[2]][dna[[1]] %in% out$sampled_species]
        out$matrix_phylip <- file.path(downloadpath, paste0(rankname, ".phylip.xz"))
        out$matrix_nexus <- file.path(downloadpath, paste0(rankname, ".nex.xz"))
        make_phylip(out$matrix_phylip, wanted_spp, wanted_dna)
        make_nexus(out$matrix_nexus, wanted_spp, wanted_dna)
        if (length(out$sampled_species) > 2) {
            chrono <- get_rank_trees(tre, out$sampled_species)
            phylog <- get_rank_trees(tre, out$sampled_species)
            out$chronogram <- file.path(downloadpath, paste0(rankname, ".tre"))
            out$phylogram <- file.path(downloadpath, paste0(rankname, "_phylogram.tre"))
            write.tree(chrono$pruned_tree, out$chronogram)
            write.tree(phylog$pruned_tree, out$phylogram)
            make_nexus(out$matrix_nexus, wanted_spp, wanted_dna, tree = chrono$pruned_tree, charsets = charsets)
            out$num_rogues <- chrono$num_rogues
            if (out$num_rogues > 0) {
                out$chronogram_mrca <- file.path(downloadpath, paste0(rankname, "_mrca.tre"))
                out$phylogram_mrca <- file.path(downloadpath, paste0(rankname, "_mrca_phylogram.tre"))
                write.tree(chrono$mrca_tree, out$chronogram_mrca)
                write.tree(phylog$mrca_tree, out$phylogram_mrca)
            }
        }
    }

    no_unbox <- c("species", "sampled_species", "family", "order")
    for (nn in names(out)) {
        if (!nn %in% no_unbox) out[[nn]] <- unbox(out[[nn]])
    }
    cat("---\n\n---\n", file = file.path(mdpath, paste0(rankname, ".md")))
    out
}

# ensure the futures are resolved
invisible(dna)
invisible(tre)
invisible(tre2)

ranks <- c("family", "order")

for (rank in ranks) {
    downloadpath <- file.path("downloads", rank)
    mdpath <- paste0("_", rank)
    dir.create(downloadpath, recursive = TRUE)
    dir.create(mdpath, recursive = TRUE)

    splat <- split(tax, tax[[rank]])
    res <- parallel::mclapply(splat, generate_rank_data, current_rank = "family", downloadpath = "downloads/family", mdpath = "_family")
    cat(toJSON(res), file = file.path(datapath, paste0(rank, ".json")))
    # Error out if Travis gives us grief
    if (length(res) != length(splat)) q(status = 1)
}

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
