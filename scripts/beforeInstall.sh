#!/bin/bash

DIR="home/ubuntu/Deliah-resto-API"

if [ -d "$DIR" ]; then
    echo "$DIR exists"
else
    echo "Creating ${DIR} directory"
    mkdir ${DIR}
fi
