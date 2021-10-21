#!/bin/bash

DIR="/home/ubuntu/Deliah-resto-API"

if [ -d "$DIR" ]; then
    echo "$DIR exists"
    rm -rf ${DIR}/{*,.+}
else
    echo "Creating ${DIR} directory"
    mkdir ${DIR}
fi

cd ${DIR}

cp ../tmp/.env .env