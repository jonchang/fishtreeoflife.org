[![Build Status](https://travis-ci.com/jonchang/fishtreeoflife.org.svg?token=CAAYReeKsDcnZM7jk2wY&branch=master)](https://travis-ci.com/jonchang/fishtreeoflife.org)

```
bundle install
Rscript -e 'install.packages(c("tidyverse", "ape", "glue", "future"))'
scripts/generate_fossils.R
scripts/generate_taxonomy.R
bundle exec jekyll serve
```
