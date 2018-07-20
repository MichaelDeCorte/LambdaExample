#!/bin/sh


echo ========== install pip
if ! which pip
then
    sudo easy_install pip
fi

echo ========== install aws
if ! which aws
then
    sudo -H pip install awscli --upgrade --user
    sudo chmod 755 $(sudo find ~/Library/Python/ -type d -print)
fi


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

if [ ! which node ]
then
    NODE=node-v8.10.0-darwin-x64
    echo ========== install node
    curl -L https://nodejs.org/download/release/v8.10.0/"$NODE".tar.gz > "$NODE".tar.gz
    tar -xf "$NODE".tar.gz
    rm "$NODE".tar.gz
    mv "$NODE" "$HOME"/bin
    ln -fs  "$HOME"/bin/"$NODE"/bin/node /usr/local/bin/node
fi

# echo ========== install brew
# if ! which brew
# then
#     ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# fi


if ! which node
then
   brew install node
fi

echo ========== upgrade node
brew upgrade node


echo ========== install git-crypt
if ! which git-crypt
then
    brew install git-crypt
fi    

if [ -f $HOME/.ssh/git-crypt.key ]
then
    git-crypt keygen $HOME/.ssh/git-crypt.key
fi

if [ ! -f $HOME/.ssh/git-crypt.key ]
then
    git-crypt keygen $HOME/.ssh/mdecorte-git-crypt.key
fi
echo RUN
echo cd REPO
echo git-crypt unlock ~/.ssh/mdecorte-git-crypt.key 
echo emacs .gitattributes
echo add
echo "secrets.tf filter=git-crypt diff=git-crypt"
