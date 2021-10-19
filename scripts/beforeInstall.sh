#!/bin/bash

DIR="home/ubuntu/deliah-resto-API"

if [ -d "$DIR" ]; then
    echo "$DIR exists"
else
    echo "Creating ${DIR} directory"
    mkdir ${DIR}
fi
