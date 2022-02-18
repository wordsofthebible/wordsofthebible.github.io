#!/bin/bash


mkdir -p ./versions

for file in ./json/*; do
    echo "Converting $file"

    name=$(basename $file | tr '[:upper:]' '[:lower:]')
    if [ ! -f "./versions/$name" ]; then
        cat $file | jq '.books | map(.chapters | map(.verses | map({ref: .name | split(" (?=[0-9])|:";"g") | join("."), text: .text}))) | flatten' > "./versions/$name"
    fi
done
