requireNamespace("glue")
requireNamespace("stringr")
requireNamespace("ape")

make_nexus <- function(path, spp, seqs, tree = NULL, charsets = NULL) {
    nexus_data <- "#nexus
    begin data;
    dimensions ntax={ntax} nchar={nchar};
    format datatype=dna interleave=no gap=-;
    matrix
    "
    xz <- xzfile(path, "w")
    sink(xz)
    glue::glue(nexus_data, ntax = length(spp), nchar = nchar(seqs[1])) %>% cat(fill = TRUE)
    for (ii in 1:length(spp)) {
        cat(spp[ii])
        cat(" ")
        cat(seqs[ii], fill = TRUE)
    }
    cat(";\nend;\n\n")
    if (!is.null(charsets)) {
        cat("begin assumptions;\n")
        for (ii in 1:length(charsets)) {
            cat(paste0("charset ", charsets[ii], ";\n"))
        }
        cat("end;\n\n")
    }
    if (!is.null(tree)) {
        cat("begin trees;\n")
        cat("tree time_calibrated =", write.tree(tree))
        cat("\nend;\n")
    }
    sink(NULL)
    close(xz)
}

make_phylip <- function(path, spp, seqs) {
    xz <- xzfile(path, "w")
    sink(xz)
    cat(paste(length(spp), nchar(seqs[1])), fill = TRUE)
    for (ii in 1:length(spp)) {
        cat(spp[ii])
        cat(" ")
        cat(seqs[ii], fill = TRUE)
    }
    sink(NULL)
    close(xz)
}

get_rank_trees <- function(tree, spp) {
    tree_species <- stringr::str_replace_all(spp, " ", "_")
    mrca_tree <- ape::extract.clade(tree, ape::getMRCA(tree, tree_species))
    pruned_tree <- ape::drop.tip(mrca_tree, mrca_tree$tip.label[!mrca_tree$tip.label %in% tree_species])
    num_rogues <- length(mrca_tree$tip.label) - length(pruned_tree$tip.label)
    list(num_rogues = num_rogues, mrca_tree = mrca_tree, pruned_tree = pruned_tree)
}
