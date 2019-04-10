#!/bin/sh
#

eval $(cat $* | jq -r 'to_entries | .[] | .key + "=\"" + ( .value  | tostring )+ "\""')


echo ============================== admin-delete-user
aws cognito-idp admin-delete-user --cli-input-json \
"{
    \"UserPoolId\": \"$cognitoUserPoolId\", 
    \"Username\": \"$Username\"
}" > /dev/null 2>&1

set -e

# https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html
echo ============================== admin-create-user
aws cognito-idp admin-create-user --cli-input-json \
"{
    \"UserPoolId\": \"$cognitoUserPoolId\", 
    \"Username\": \"$Username\",
    \"TemporaryPassword\": \"$InitialPassword\",
    \"MessageAction\": \"SUPPRESS\"
}"


# https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
INITIATEAUTH=$(
    aws cognito-idp initiate-auth --cli-input-json --output json \
                "{
                    \"ClientId\": \"$cognitoClientId\", 
                    \"AuthFlow\": \"USER_PASSWORD_AUTH\", 
                    \"AuthParameters\": {
                        \"USERNAME\": \"$Username\",
                        \"PASSWORD\": \"$InitialPassword\"
                    }    
                }"
            )

echo ============================== initiate-auth 
echo $INITIATEAUTH |  jq -r '.'
eval $(echo $INITIATEAUTH |  jq -r '"SESSION=" + .Session, "CHALLENGENAME=" + .ChallengeName ')


# https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_RespondToAuthChallenge.html
AUTHCHALLENGE=$(
    aws cognito-idp respond-to-auth-challenge --cli-input-json --output json \
        "{
            \"ChallengeName\": \"$CHALLENGENAME\", 
            \"ClientId\": \"$cognitoClientId\", 
            \"Session\": \"$SESSION\",
            \"ChallengeResponses\": {
                \"USERNAME\": \"$Username\",
                \"NEW_PASSWORD\": \"$FinalPassword\"
            }
        }"
)

echo ============================== respond-to-auth-challenge
echo $AUTHCHALLENGE |  jq -r '.'

