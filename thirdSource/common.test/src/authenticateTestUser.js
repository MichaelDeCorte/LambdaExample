// const logger = require('./logger.js').logger;
global.fetch = require('node-fetch');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// const AWS = require('aws-sdk'); 
const Promise = require('promise');

const environment = require('environment').environment;
const testUser = require('./testUser');

let authorizationToken = null;

function authenticateTestUser() {
    let poolData = {
        'UserPoolId': environment().cognitoUserPoolId,
        'ClientId': environment().cognitoClientId,
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
        'Username': testUser().Username,
        'Pool': userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


    let authenticationData = {
        'Username': testUser().Username,
        'Password': testUser().FinalPassword
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

    return new Promise(
        (resolve, reject) => {
            cognitoUser.authenticateUser(
                authenticationDetails,
                {
                    'onSuccess': (result) => {
                        // console.log('result' + JSON.stringify(result, null, 4));
                        // let accessToken = result.getAccessToken().getJwtToken();
                        authorizationToken = result.getIdToken().getJwtToken();
                        resolve(result);
                    },
                    'onFailure': (err) => {
                        reject(err);
                    },
                }
            );
        }
    );
}

function getAuthorizationToken() {
    return authorizationToken;
}

module.exports.authenticateTestUser = authenticateTestUser;
module.exports.getAuthorizationToken = getAuthorizationToken;
