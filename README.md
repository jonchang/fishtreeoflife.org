[![Build status](https://github.com/jonchang/fishtreeoflife.org/workflows/Jekyll%20site%20CI/badge.svg)](https://github.com/jonchang/fishtreeoflife.org/actions)
[![Digital object identifier](https://zenodo.org/badge/DOI/10.1111/2041-210x.13182.svg)](https://doi.org/10.1111/2041-210x.13182)


# The Fish Tree of Life website

This is the primary git repository for the Fish Tree of Life website at https://fishtreeoflife.org. Data sources are hosted in the [Docker repository](https://github.com/jonchang/fishtreeoflife-docker).

# Building

```
git clone https://github.com/jonchang/fishtreeoflife.org.git
cd fishtreeoflife.org
scripts/docker.sh
bundle install
bundle exec rake -j build
bundle exec rake serve
```

# Sponsorship

Please consider sponsoring the maintenance of fishtreeoflife.org via [GitHub Sponsors](https://github.com/sponsors/jonchang).
