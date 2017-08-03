#!/bin/bash

echo "======================== build start ========================"

rm -rf output
mkdir output

echo "======================== npm install ========================"
npm config set registry "http://registry.npm.baidu.com"
npm install -g npm --registry=http://registry.npm.baidu.com
echo 'npm version>>>'
npm -v
npm install --registry=http://registry.npm.baidu.com
cd client
npm install --registry=http://registry.npm.baidu.com

echo "======================== build VUE ========================"
npm run build


echo "======================== zip ========================"
cd ..
zip lavas-web.zip -r ./* -x "logs/*" -x "outputProjects/*" -x "client/*" -x "dev.sh" -x "install.sh"
mv lavas-web.zip output/

echo "======================== build complete ========================"
