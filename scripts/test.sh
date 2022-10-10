#!/bin/bash

set -eux

# only error if stuff was found
grep ERROR_ERROR_ERROR -lr _site && exit 1

# ensure internal links are valid
bundle exec htmlproofer \
    --allow-hash-href \
    --allow-missing-href \
    --disable-external \
    --ignore-empty-alt \
    --no-enforce-https \
    --assume-extension=.html \
    ./_site
