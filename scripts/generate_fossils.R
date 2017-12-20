#!/usr/bin/env Rscript

library(ape)
library(dplyr)
library(readr)
library(ggplot2)
library(stringr)

width <- 1000 - (30 * 2)
height <- width * 3

slugify <- function(str) {
    str %>% str_replace_all("[^a-zA-Z0-9-]", "-") %>% str_replace_all("-+", "-") %>% str_replace("-$", "") %>% tolower()
}

tree <- read.tree("downloads/actinopt_12k_treePL.tre.xz")
fossil_nodes <- read_csv("downloads/fossil/output_data.csv")

fossil_nodes$idx <- seq_len(nrow(fossil_nodes))

# Add a new column `node` with the node number of that calibration
fossil_nodes <- group_by(fossil_nodes, group) %>% mutate(node = getMRCA(tree, c(left, right)))

png("_assets/img/vertical_tree@3x.png", width = width * 3, height = height * 3)
plot(tree, show.tip.label = FALSE, no.margin = TRUE)
lastPP <- get("last_plot.phylo", envir = .PlotPhyloEnv)
res <- fossil_nodes %>% mutate(x = lastPP$xx[node], y = lastPP$yy[node],
                               devx = grconvertX(x, to = "device"),
                               devy = grconvertY(y, to = "device"),
                               slug = slugify(fossil)) %>% ungroup()
dev.off()

png("_assets/img/vertical_tree@2x.png", width = width * 2, height = height * 2)
plot(tree, show.tip.label = FALSE, no.margin = TRUE)
dev.off()

png("_assets/img/vertical_tree@1x.png", width = width, height = height)
plot(tree, show.tip.label = FALSE, no.margin = TRUE)
dev.off()


res %>% write_csv("_data/fossil_data.csv")
res %>% transmute(clade = clade_pretty, fossil, left, right, min, max, locality, authority) %>% write_csv("_data/fossil_pretty.csv")

mdpath <- "_fossils/"
dir.create(mdpath, recursive = T)

for (ii in 1:nrow(res)) {
    sink(file.path(mdpath, paste0(res$idx[ii], ".md")))
    cat(paste0("---\ntitle: ", res$fossil[ii], "\nslug: ", res$slug[ii], "\n\n---\n"))
    sink(NULL)
}
