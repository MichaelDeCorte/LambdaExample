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

echo ========== install node
NODE_VERSION=v8.10.0
if ! which node || ! (node --version | grep "$NODE_VERSION" )
then
    NODE=node-"$NODE_VERSION"-darwin-x64
    echo ========== install node
    curl -L https://nodejs.org/download/release/"$NODE_VERSION"/"$NODE".tar.gz > "$NODE".tar.gz
    tar -xf "$NODE".tar.gz
    rm "$NODE".tar.gz
    mv -v "$NODE" "$HOME"/bin
#    sudo ln -fs  "$HOME"/bin/"$NODE"/bin/node /usr/local/bin/node
#    sudo ln -fs  "$HOME"/bin/"$NODE"/bin/npm /usr/local/bin/npm
#    sudo ln -fs  "$HOME"/bin/"$NODE"/bin/npx /usr/local/bin/npx
fi

echo ========== install brew
if ! which brew
then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi


echo ========== install jq
if ! which jq
then
    brew install jq
fi    

echo ========== install git-crypt
if ! which git-crypt
then
    brew install git-crypt
fi    

if [ -f $HOME/.ssh/git-crypt.key ]
then
    git-crypt keygen $HOME/.ssh/git-crypt.key
fi

if [ ! -f $HOME/.ssh/mdecorte-git-crypt.key ]
then
    git-crypt keygen $HOME/.ssh/mdecorte-git-crypt.key
fi

echo '******************************'
echo RUN the below commands
echo cd REPO
echo git-crypt unlock ~/.ssh/mdecorte-git-crypt.key 
echo emacs .gitattributes
echo add
echo "secrets.tf filter=git-crypt diff=git-crypt"


echo 'create s3 bucket thirdsource-terraform in us-east-1'
echo
echo Activate cost explorer
echo https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/grantaccess.html
