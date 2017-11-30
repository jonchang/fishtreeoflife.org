#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(ggplot2)
library(stringr)
library(glue)

width <- 1000 - (30 * 2)
height <- width * 3
retina_scale <- 2

tree <- read.tree("downloads/actinopt_12k_treePL.tre.xz")
fossil_nodes <- read_csv("downloads/fossil/output_data.csv")

fossil_nodes$idx <- seq_len(nrow(fossil_nodes))

# Add a new column `node` with the node number of that calibration
fossil_nodes <- group_by(fossil_nodes, group) %>% mutate(node = getMRCA(tree, c(left, right)))

png("_assets/img/vertical_tree.png", width = width * retina_scale, height = height * retina_scale)
plot(tree, show.tip.label = FALSE, no.margin = TRUE)
lastPP <- get("last_plot.phylo", envir = .PlotPhyloEnv)
res <- fossil_nodes %>% mutate(x = lastPP$xx[node], y = lastPP$yy[node],
                               devx = grconvertX(x, to = "device"),
                               devy = grconvertY(y, to = "device"),
                               slug = tolower(str_replace_all(fossil, "[^a-zA-Z0-9-]", "-"))) %>% ungroup()
dev.off()

res %>% write_csv("_data/fossil_data.csv")

mdpath <- "_fossils/"
dir.create(mdpath, recursive = T)

for (ii in 1:nrow(res)) {
    sink(file.path(mdpath, paste0(res$idx[ii], ".md")))
    cat(paste0("---\ntitle: ", res$fossil[ii], "\nslug: ", res$slug[ii], "\n\n---\n"))
    sink(NULL)
}


