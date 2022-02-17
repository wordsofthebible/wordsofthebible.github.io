#!/bin/bash


mkdir -p ./versions

for file in ./json/*; do
    echo "Converting $file"

    base=$(basename $file)
    if [ ! -f "./versions/$base" ]; then
        cat $file | jq '.books | map(.chapters | map(.verses | map({ref: .name | split(" (?=[0-9])|:";"g") | join("."), text: .text}))) | flatten' > "./versions/$base"
    fi
done
