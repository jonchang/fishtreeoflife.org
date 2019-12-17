#!/bin/bash

set -eux

docker pull docker.pkg.github.com/jonchang/fishtreeoflife-docker/data:latest
docker run --name temp jonchang/fishtreeoflife-docker /bin/true
docker cp temp:_assets _assets_tmp
docker cp temp:_fossils _fossils
docker cp temp:_data _data_tmp
docker cp temp:downloads downloads_tmp
docker rm temp
rsync -av _assets_tmp/ _assets/
rsync -av _data_tmp/ _data/
rsync -av downloads_tmp/ downloads/
rm -rf _assets_tmp _data_tmp downloads_tmp
