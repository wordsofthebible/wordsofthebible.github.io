#!/bin/bash

mkdir -p ./modules

for version in ACV ABP AKJV ASV Anderson BBE BWE CPDV DRC Darby EMTV Etheridge Geneva1599 GodsWord ISV Jubilee2000 KJV LEB LITV MKJV NETtext NHEB Noyes OEB OEBcth; do
    echo "Downloading $version"
    if [ ! -f "./modules/$version.zip" ]; then
        wget http://www.crosswire.org/ftpmirror/pub/sword/packages/rawzip/$version.zip -O ./modules/$version.zip
    fi
done
