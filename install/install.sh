#!/bin/sh

sudo easy_install pip

sudo pip install awscli --upgrade --user

sudo chmod 755 $(sudo find ~/Library/Python/ -type d -print)

cp aws-config ~/bin
chmod 755 ~/bin/aws-config

if ! grep -q 'source aws-config' ~/.bashrc
then
    echo 'source aws-config' >> ~/.bashrc
fi


echo ============================================================
cat ~/.aws/mdecorte.csv
echo Default region name: us-east-1
echo Default output format: text
aws configure
aws configure --profile Adminstrator

aws ec2 list-functions 
