#!/bin/bash

docker run -i -v "$PWD"/fishtree:/fishtree rocker/tidyverse:latest /bin/bash << EOBASH

apt update
apt install -y --no-install-recommends libmagick++-dev libgsl-dev

R --slave << EOR
options(repos = "https://cloud.r-project.org")
install.packages(c("fishtree", "pkgdown"), dependencies = TRUE, Ncpus = 4)
requireNamespace("pkgdown")
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
