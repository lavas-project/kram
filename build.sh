#!/bin/bash

echo "======================== build start ========================"

rm -rf output
mkdir output

echo "======================== npm install ========================"
npm install -g npm
echo 'npm version>>>'
npm -v
npm install
cd client
npm install

echo "======================== build VUE ========================"
npm run build


echo "======================== zip ========================"
cd ..
zip lavas-web.zip -r ./* -x "logs/*" -x "outputProjects/*" -x "client/*" -x "dev.sh" -x "install.sh"
mv lavas-web.zip output/

echo "======================== build complete ========================"
