#!/bin/bash

docker pull ubuntu:latest
docker run --rm -i -v "$PWD"/fishtree:/fishtree ubuntu:latest /bin/bash << EOBASH

set -euo pipefail

apt-get update -qq
apt-get -y --no-install-recommends install gnupg ca-certificates
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
echo "deb https://cloud.r-project.org/bin/linux/ubuntu focal-cran40/" >> /etc/apt/sources.list

apt-get update -qq
apt-get -y --no-install-recommends install \
    r-base-dev \
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

overrides <- list(template = list(params = list(ganalytics = "UA-15180347-2")), destination = "/fishtree")
withr::with_envvar(c("NOT_CRAN" = "true"), pkgdown::build_site(extpath, override = overrides))

EOR

EOBASH
