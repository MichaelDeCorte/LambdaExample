#!/bin/sh

set -e

ENV=$1

if [ -z "$ENV" ]
then
    ENV=$THIRDSOURCEROOT/common.test/src/environment.json
fi

eval $(cat $ENV | jq -r 'to_entries | .[] | .key + "=\"" + .value + "\""')


############################################################

# https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
INITIATEAUTH=$(
    aws cognito-idp initiate-auth --cli-input-json --output json \
                "{
                    \"ClientId\": \"$cognitoClientId\", 
                    \"AuthFlow\": \"USER_PASSWORD_AUTH\", 
                    \"AuthParameters\": {
                        \"USERNAME\": \"$Username\",
                        \"PASSWORD\": \"$FinalPassword\"
                    }    
                }"
            )

# echo $INITIATEAUTH |  jq -r '.'
echo $INITIATEAUTH |  jq -r '"IDTOKEN=" + .AuthenticationResult.IdToken'


