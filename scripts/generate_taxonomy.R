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
if (Sys.getenv("TRAVIS") == "true") {
    options(mc.cores = 4)
}

# get rank to build from command line arguments
RANK <- commandArgs(TRUE)
if (length(RANK) < 1) q(status = 1)


plan(multicore)

tre %<-% read.tree("downloads/actinopt_12k_treePL.tre.xz")
tre2 %<-% read.tree("downloads/actinopt_12k_raxml.tre.xz")
tax %<-% read_csv("downloads/PFC_short_classification.csv.xz")
#fulltree %<-% read.tree("downloads/actinopt_full.trees.xz")
dna %<-% scan("downloads/final_alignment.phylip.xz", what = list(character(), character()), quiet = TRUE, nlines = 11650, strip.white = TRUE, skip = 1)
charsets <- readLines("downloads/final_alignment.partitions") %>% str_replace_all(fixed("DNA, "), "")
tiprates <- read_csv("downloads/tiprates.csv.xz")

datapath <- "_data/taxonomy"

dir.create(datapath, recursive = T)

tips <- str_replace_all(tre$tip.label, "_", " ")
dna[[1]] <- str_replace_all(dna[[1]], "_", " ")

two_col_to_list <- function(df) {
    xx <- lapply(as.list(df[[2]]), unbox)
    names(xx) <- df[[1]]
    xx
}

generate_rank_data <- function(df, current_rank, downloadpath) {
    out <- list()
    out$species <- df$genus.species
    out$sampled_species <- out$species[out$species %in% tips]
    out$order <- unique(df$order)
    out$family <- unique(df$family)
    rankname <- out[[current_rank]]
    cat(rankname, "...\n")
    wanted_rates <- tiprates %>% filter(species %in% out$sampled_species)
    out$tiprates_dr <- filter(wanted_rates, !is.na(dr)) %>% select(species, dr) %>% two_col_to_list()
    out$tiprates_bamm_lambda <- filter(wanted_rates, !is.na(lambda.tv)) %>% select(species, lambda.tv) %>% two_col_to_list()
    out$tiprates_bamm_mu <- filter(wanted_rates, !is.na(mu.tv)) %>% select(species, mu.tv) %>% two_col_to_list()
    out$mean_dr <- mean(as.numeric(out$tiprates_dr))
    out$mean_bamm_lambda <- mean(as.numeric(out$tiprates_bamm_lambda))
    out$mean_bamm_mu <- mean(as.numeric(out$tiprates_bamm_mu))

#     out$chronogram_full <- file.path(downloadpath, paste0(rankname, "_full.trees"))
#     ss <- str_replace_all(out$species, " ", "_")
#     to_drop <- fulltree$tip.label[!fulltree$tip.label %in% str_replace_all(out$species, " ", "_")]
#     fullt <- lapply(fulltree, drop.tip, to_drop)
#     class(fullt) <- "multiPhylo"
#     write.tree(fullt, out$chronogram_full)

    if (length(out$sampled_species) > 0) {
        wanted_spp <- dna[[1]][dna[[1]] %in% out$sampled_species] %>% str_replace_all(" ", "_")
        wanted_dna <- dna[[2]][dna[[1]] %in% out$sampled_species]
        out$matrix_phylip <- file.path(downloadpath, paste0(rankname, ".phylip.xz"))
        out$matrix_nexus <- file.path(downloadpath, paste0(rankname, ".nex.xz"))
        make_phylip(out$matrix_phylip, wanted_spp, wanted_dna)
        make_nexus(out$matrix_nexus, wanted_spp, wanted_dna)
        if (length(out$sampled_species) > 2) {
            chrono <- get_rank_trees(tre, out$sampled_species)
            phylog <- get_rank_trees(tre2, out$sampled_species)
            out$chronogram <- file.path(downloadpath, paste0(rankname, ".tre"))
            out$phylogram <- file.path(downloadpath, paste0(rankname, "_phylogram.tre"))
            write.tree(chrono$pruned_tree, out$chronogram)
            write.tree(phylog$pruned_tree, out$phylogram)
            make_nexus(out$matrix_nexus, wanted_spp, wanted_dna, tree = chrono$pruned_tree, charsets = charsets)
            out$rogues <- chrono$rogues
            if (length(out$rogues) > 0) {
                out$chronogram_mrca <- file.path(downloadpath, paste0(rankname, "_mrca.tre"))
                out$phylogram_mrca <- file.path(downloadpath, paste0(rankname, "_mrca_phylogram.tre"))
                write.tree(chrono$mrca_tree, out$chronogram_mrca)
                write.tree(phylog$mrca_tree, out$phylogram_mrca)
            }
        }
    }

    no_unbox <- c("species", "sampled_species", "family", "order", "rogues", "tiprates_dr", "tiprates_bamm_lambda", "tiprates_bamm_mu")
    for (nn in names(out)) {
        if (!nn %in% no_unbox) out[[nn]] <- unbox(out[[nn]])
    }
    out
}

# ensure the futures are resolved
invisible(dna)
invisible(tre)
invisible(tre2)
#invisible(fulltree)

cat("Starting", RANK, fill = TRUE)
downloadpath <- file.path("downloads/taxonomy", RANK)
dir.create(downloadpath, recursive = TRUE)

splat <- split(tax, tax[[RANK]])
res <- parallel::mclapply(splat, generate_rank_data, current_rank = RANK, downloadpath = downloadpath)
cat(toJSON(res), file = file.path(datapath, paste0(RANK, ".json")))

# Error out if Travis gives us grief
if (length(res) != length(splat)) {
    cat("Wanted", length(splat), "results of rank", RANK, "but got", length(res), "results", fill = T)
    q(status = 1)
}
