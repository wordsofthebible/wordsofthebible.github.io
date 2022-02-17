#!/bin/bash

mkdir -p ./modules

for version in ACV ABP; do
    echo "Downloading $version"
    if [ ! -f "./modules/$version.zip" ]; then
        wget http://www.crosswire.org/ftpmirror/pub/sword/packages/rawzip/$version.zip -O ./modules/$version.zip
    fi
done
