#!/bin/bash

set -eux

docker pull docker.pkg.github.com/jonchang/fishtreeoflife-docker/data:latest
id=$(docker create docker.pkg.github.com/jonchang/fishtreeoflife-docker/data:latest)
docker cp $id:_assets _assets_tmp
docker cp $id:_fossils _fossils
docker cp $id:_data _data_tmp
docker cp $id:downloads downloads_tmp
docker rm $id
rsync -av _assets_tmp/ _assets/
rsync -av _data_tmp/ _data/
rsync -av downloads_tmp/ downloads/
rm -rf _assets_tmp _data_tmp downloads_tmp
