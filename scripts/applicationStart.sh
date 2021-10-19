#!/bin/bash

#navigate into our working directory where we have all our github files
cd /home/ec2-user/express-app

#install node modules
sudo npm install

#start our node app in the background
pm2 start src/server.js --name delilah --watch