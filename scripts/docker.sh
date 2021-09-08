#!/bin/bash

set -eux

docker pull ghcr.io/jonchang/fishtreeoflife-docker/data:latest
docker run --name temp ghcr.io/jonchang/fishtreeoflife-docker/data:latest /bin/true
docker cp temp:assets assets_tmp
docker cp temp:_fossils _fossils
docker cp temp:_data _data_tmp
docker cp temp:downloads downloads_tmp
docker rm temp
rsync -av assets_tmp/ assets/
rsync -av _data_tmp/ _data/
rsync -av downloads_tmp/ downloads/
rm -rf assets_tmp _data_tmp downloads_tmp
