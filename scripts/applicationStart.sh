#!/bin/bash

#navigate into our working directory where we have all our github files
cd /home/ubuntu/Deliah-resto-API

#install node modules
sudo npm install

#start our node app in the background
pm2 start src/server.js --name delilah --watch