#!/bin/bash

DIR="/home/ubuntu/Deliah-resto-API"

if [ -d "$DIR" ]; then
    echo "$DIR exists"
    rm -rf ${DIR}
#    rm -rf ${DIR}/{*,.*}
fi

mkdir ${DIR}

cd ${DIR}

cp ../tmp/.env .env