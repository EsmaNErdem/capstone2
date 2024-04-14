#!/bin/bash

# Give appropriate permissions to the express-app directory
sudo chown -R ec2-user:ec2-user /home/ec2-user/express-app
sudo chmod -R 755 /home/ec2-user/express-app

# Navigate to the working directory
cd /home/ec2-user/express-app

# Install Node.js modules
npm install

# Start the Node.js application
node server.js > server.out.log 2> server.err.log < /dev/null &
