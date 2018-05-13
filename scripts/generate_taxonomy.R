#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(glue)
library(stringr)
library(future)
library(yaml)


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
    if (length(sampled_species) > 0) {
        wanted_spp <- dna[[1]][dna[[1]] %in% sampled_species] %>% str_replace_all(" ", "_")
        wanted_dna <- dna[[2]][dna[[1]] %in% sampled_species]
        make_phylip(file.path(downloadpath, paste0(family_name, ".phylip.xz")), wanted_spp, wanted_dna)
        make_nexus(file.path(downloadpath, paste0(family_name, ".nex.xz")), wanted_spp, wanted_dna)
        if (length(sampled_species) > 2) {
            chrono <- get_rank_trees(tre, sampled_species)
            phylog <- get_rank_trees(tre, sampled_species)
            write.tree(chrono$pruned_tree, file.path(downloadpath, paste0(family_name, ".tre")))
            write.tree(phylog$pruned_tree, file.path(downloadpath, paste0(family_name, "_phylogram.tre")))
            make_nexus(file.path(downloadpath, paste0(family_name, ".nex.xz")), wanted_spp, wanted_dna, tree = chrono$pruned_tree, charsets = charsets)
            num_rogues <- chrono$num_rogues
            if (chrono$num_rogues > 0) {
                write.tree(chrono$mrca_tree, file.path(downloadpath, paste0(family_name, "_mrca.tre")))
                write.tree(phylog$mrca_tree, file.path(downloadpath, paste0(family_name, "_mrca_phylogram.tre")))
            }
        }
    }

    sink(file.path(mdpath, paste0(family_name, ".md")))
    yaml <- list(family_name = family_name, order = order, num_rogues = num_rogues)
    cat("---", as.yaml(yaml), "---", fill = T, sep = "\n")
    sink(NULL)
}

# ensure the futures are resolved
invisible(dna)
invisible(tre)
invisible(tre2)

splat <- split(tax, tax$family)
res <- list()

# implement exponential backoff for multicore runs because travis is bad with IO or something
repeat {
    files <- str_replace_all(basename(Sys.glob(file.path(mdpath, "*.md"))), ".md", "")
    notrun <- setdiff(names(splat), files)
    if (length(notrun) == 0) break
    cores <- getOption("mc.cores")
    if (cores <= 1) {
        cat(paste("running", length(notrun), "jobs serially\n"))
        res2 <- lapply(splat[notrun], generate_family_data)
        res <- c(res, res2)
    } else {
        cat(paste("running", length(notrun), "jobs with", getOption("mc.cores"), "cores\n"))
        res2 <- parallel::mclapply(splat[notrun], generate_family_data)
        res <- c(res, res2)
    }
    options(mc.cores = cores / 2)
}
