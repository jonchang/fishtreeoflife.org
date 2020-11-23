#!/bin/bash

docker pull rocker/r-ver:latest
docker run --rm -i -v "$PWD"/fishtree:/fishtree rocker/r-ver:latest /bin/bash << EOBASH

set -euo pipefail

apt-get update -qq
apt-get -y --no-install-recommends install \
    libcairo2-dev \
    libfribidi-dev \
    libgit2-dev \
    libglpk-dev \
    libgsl-dev \
    libharfbuzz-dev \
    libmagick++-dev \
    libssh2-1-dev \
    libxml2-dev \
    pandoc

R --no-echo << EOR
# Use RStudio package manager for most dependencies to avoid building the world from source
install.packages(c("fishtree", "pkgdown"), dependencies = TRUE, Ncpus = 4)

# But reinstall these needed packages from source
options(repos = "https://cloud.r-project.org")
update.packages(ask = FALSE, Ncpus = 4)
install.packages(c("fishtree", "pkgdown"), dependencies = TRUE, Ncpus = 4, type = "source")

# Ensure that pkgdown and fishtree were actually installed
requireNamespace("pkgdown")
requireNamespace("fishtree")

# Unpack the source and build with pkgdown
td <- tempdir()
xx <- download.packages("fishtree", type = "source", dest = td)
tf <- xx[, 2]
untar(tf, exdir = td, verbose = TRUE)
extpath <- file.path(td, "fishtree")

overrides <- list(template = list(params = list(ganalytics = "UA-15180347-2")), destination = "/fishtree")
withr::with_envvar(c("NOT_CRAN" = "true"), pkgdown::build_site(extpath, override = overrides))

EOR

EOBASH
