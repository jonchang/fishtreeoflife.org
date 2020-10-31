#!/bin/bash

docker run --rm -i -v "$PWD"/fishtree:/fishtree rocker/tidyverse:latest /bin/bash << EOBASH

set -euo pipefail

apt-get update
apt-get install -y --no-install-recommends libmagick++-6.q16-8 libgsl23 libharfbuzz0b libfribidi0 libglpk40

R --no-echo << EOR
# Use RStudio package manager for most dependencies to avoid building the world from source
install.packages(c("fishtree", "pkgdown"), dependencies = TRUE, Ncpus = 4)

# But reinstall these needed packages from source
options(repos = "https://cloud.r-project.org")
install.packages(c("fishtree", "pkgdown"), dependencies = TRUE, Ncpus = 4)

# Ensure that pkgdown and fishtree were actually installed
requireNamespace("pkgdown")
requireNamespace("fishtree")

# Unpack the source and build with pkgdown
td <- tempdir()
xx <- download.packages("fishtree", type = "source", dest = td)
tf <- xx[, 2]
untar(tf, exdir = td, verbose = TRUE)
extpath <- file.path(td, "fishtree")
withr::with_envvar(c("NOT_CRAN" = "true"),
                   pkgdown::build_site(extpath, override = list(destination = "/fishtree"))
                  )
EOR

EOBASH
