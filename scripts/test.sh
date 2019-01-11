#!/bin/bash

set -eux

# only error if stuff was found
! grep ERROR_ERROR_ERROR -lr _site

# ensure internal links are valid
bundle exec htmlproofer --allow-hash-href --disable-external --empty-alt-ignore --assume-extension ./_site
