#!/bin/sh
source /data/config/.env
project=`pwd`
project=$(basename $project)
echo $project

# clean
pm2 stop $project
sudo systemctl stop nginx
rm -rf /home/appadm/.pm2/logs/
sudo rm -f /var/log/nginx/*

# refresh
git checkout src/utils/version.js
git pull
sh ./printVersion.sh
#yarn build:$env
yarn build

echo "         yarn build:uat "
echo "         yarn build:development "
echo "         sudo systemctl restart nginx "
pm2 restart $project

# restart
sudo systemctl stop nginx
sudo  rm -f /var/log/nginx/error.log
sudo  rm -f /var/log/nginx/access.log
sudo systemctl restart nginx
