#!/bin/bash

# this script is used for AWS launch configuration that accordingly used in load balancing and auto scaling

cd /root
export HOME=/root

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. /root/.nvm/nvm.sh
nvm install node
yum install -y git
git clone https://github.com/kxalex/SiteMinderTask.git
cd SiteMinderTask
npm install
npm install pm2 -g
sed -i 's/SENDGRID_KEY/PLACE_YOUR_KEY_HERE/g' ./config/default.json
sed -i 's/MAILGUN_KEY/PLACE_YOUR_KEY_HERE/g' ./config/default.json

mkdir -p /root/.aws
echo "[default]" > /root/.aws/credentials
echo "aws_access_key_id = PLACE_YOUR_KEY_HERE" >> /root/.aws/credentials
echo "aws_secret_access_key = PLACE_YOUR_KEY_HERE" >> /root/.aws/credentials
echo "region = us-east-1" >> /root/.aws/credentials
echo "output = json" >> /root/.aws/credentials

pm2 start ecosystem.config.js --env production
