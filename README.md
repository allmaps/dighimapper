# @allmaps/dighimapper

Create [`maps.ndjson`](data/maps.ndjson):

    ./maps.js > ./data/maps.ndjson

Download all `info.json` files, per batch:

    ./batches.js

Create manifest from single batch

    cat batches/2/*.json | node ../../allmaps/allmaps/apps/cli/dist/index.js iiif manifest --id https://allmaps.org/dighimapper/manifests/batch2.json > manifests/batch2.json
