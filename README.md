# @allmaps/dighimapper

Create [`maps.ndjson`](data/maps.ndjson):

    node maps.js

Download all `info.json` files, per batch:

    node batches.js

Create manifest from single batch

    cat batches/1/*.json | node ../../allmaps/allmaps/apps/cli/dist/index.js iiif --format manifest > manifests/batch1.json
