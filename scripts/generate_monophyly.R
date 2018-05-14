#!/usr/bin/env Rscript
library(ape)
library(dplyr)
library(readr)
library(MonoPhy)

tre <- read.tree("downloads/actinopt_12k_treePL.tre.xz")
tax_orig <- read_csv("downloads/PFC_short_classification.csv.xz") %>% transmute(tip = gsub(" ", "_", genus.species), family, order)

tax <- tax_orig %>% filter(tip %in% tre$tip.label) %>% as.data.frame()

res <- AssessMonophyly(tre, tax, verbosity = 0)

# purge the wicked
evil <- c(do.call(c, res$order$IntruderTips), do.call(c, res$order$OutlierTips))

tre2 <- drop.tip(tre, evil)
tax2 <- filter(tax, !tip %in% evil)
mono <- res$order$result["Monophyly"]
mono$label <- rownames(res$order$result)

# wrapper for mrca that returns NA instead of null if the clade is monotypic
mrca_na <- function(phy, tip) {
    r <- getMRCA(phy, tip)
    if (is.null(r)) return(NA)
    return(r)
}

# compute mcra nodes and the ages of those
btimes <- branching.times(tre2)
stats <- tax2 %>% group_by(order) %>% summarise(node = mrca_na(tre2, tip), depth = btimes[as.character(node)], N = n(), exemplar = first(tip)) %>% rename(label = order)

# drop the extra tips that we don't need
skeleton <- drop.tip(tre2, which(!tre2$tip.label %in% stats$exemplar))
skeleton$tip.label <- stats$label[match(skeleton$tip.label, stats$exemplar)]
skeleton <- ladderize(skeleton, right = FALSE)

# open a null plot device to extract plot metrics
pdf(NULL)
plot(skeleton)
metrics <- .PlotPhyloEnv$last_plot.phylo
dev.off()

# extracted from ape
compute_phylogram <- function(edge, Ntip, Nnode, xx, yy) {
    nodes <- (Ntip + 1):(Ntip + Nnode)
    x0v <- xx[nodes]
    y0v <- y1v <- numeric(Nnode)
    NodeInEdge1 <- vector("list", Nnode)
    e1 <- edge[, 1]
    for (i in seq_along(e1)) {
        j <- e1[i] - Ntip
        NodeInEdge1[[j]] <- c(NodeInEdge1[[j]], i)
    }
    for (i in 1:Nnode) {
        j <- NodeInEdge1[[i]]
        tmp <- range(yy[edge[j, 2]])
        y0v[i] <- tmp[1]
        y1v[i] <- tmp[2]
    }
    x0h <- xx[edge[, 1]]
    x1h <- xx[edge[, 2]]
    y0h <- yy[edge[, 2]]
    data_frame(x = c(x0h, x0v), y = c(y0h, y0v), xend = c(x1h, x0v), yend = c(y0h, y1v))
}

write_csv(with(metrics, compute_phylogram(edge, Ntip, Nnode, xx, yy)), "_data/monophyly_order_svg.csv")

# implementation detail: 1:Ntip should be the coordinates of the terminal eges

xx <- metrics$xx[1:metrics$Ntip]
yy <- metrics$yy[1:metrics$Ntip]

ramp <- colorRamp(RColorBrewer::brewer.pal(9, "BuGn")[1:8])

to_svg <- data_frame(x = xx, y = yy, label = skeleton$tip.label) %>% left_join(mono) %>% left_join(stats) %>% select(-exemplar, -node) %>% mutate(depth = max(x) - depth) %>% left_join(tax %>% group_by(order) %>% summarise(richness=n()) %>% rename(label = order)) %>% mutate(color = rgb(ramp(log(richness) / log(max(richness))), maxColorValue = 255))


js <- jsonlite::toJSON(to_svg)
cat(js, file = "_data/monophyly_order_data.json")



