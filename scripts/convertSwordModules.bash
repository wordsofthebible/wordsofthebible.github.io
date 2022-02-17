#!/bin/bash

mkdir -p ./json

for file in ./modules/*; do

    echo "Converting $file"

    s="$file"
    s=${s##*/}
    n=${s%.*}

    if [ ! -f "./json/$n.json" ]; then

        python3 convertSwordToJson.py --source_file="$file" --bible_version="$n" --output_file="./json/$n.json"

    fi

done
