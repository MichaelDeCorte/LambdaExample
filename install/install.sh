#!/bin/sh

echo ========== install pip
if ! which pip
then
    sudo easy_install pip
fi

echo ========== install aws
# if ! which aws
# then
    sudo -H pip install awscli --upgrade --user
# fi

sudo chmod 755 $(sudo find ~/Library/Python/ -type d -print)

cp aws-config ~/bin
chmod 755 ~/bin/aws-config

if ! grep -q 'source aws-config' ~/.bashrc
then
    echo 'source aws-config' >> ~/.bashrc
fi

source ~/bin/aws-config

echo ========== configure aws
if ! aws iam get-user
then
    cat ~/.aws/mdecorte.csv
    echo Default region name: us-east-1
    echo Default output format: text
    aws configure
# aws configure --profile Adminstrator
    aws iam get-user
fi

echo ========== install brew
if ! which brew
then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

echo ========== install node
if ! which node
then
    brew install node
fi

echo ========== upgrade node
brew upgrade node

echo ========== upgrade npm
npm i npm
