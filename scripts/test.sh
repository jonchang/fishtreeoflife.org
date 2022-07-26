#!/bin/bash

set -eux

# only error if stuff was found
grep ERROR_ERROR_ERROR -lr _site && exit 1

# ensure internal links are valid
bundle exec htmlproofer \
    --allow-hash-href=true \
    --allow-missing-href=true \
    --assume-extension=.html \
    --disable-external=true \
    --enforce-https=false \
    --ignore-empty-alt=true \
    ./_site
