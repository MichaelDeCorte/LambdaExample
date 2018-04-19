const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const logger = require('../src/logger.js').logger;
const hash = require('string-hash');
const guid = require('./guid').generateGUID;

let lambdaProxyIntegration = null;

exports.handler = (event, context, lambdaCallback) => {
    // create AWS service functions in handler to allow mocking
    const dynamodb = new AWS.DynamoDB({ 'apiVersion': '2012-08-10' });  
    let body = null;

    console.log('LOG_LEVEL=' + process.env.LOG_LEVEL);

    logger.debug('putParty.js: event: ' + JSON.stringify(event, null, 4));
    logger.debug('putParty.js: context: ' + JSON.stringify(context, null, 4));
    
    // called from AWS API Gateway
    if (Object.prototype.hasOwnProperty.call(event, 'body')) { 
        lambdaProxyIntegration = true;
    } else {
        lambdaProxyIntegration = false;
    }
    
    logger.debug('putParty.js: lambdaProxyIntegration: ' + lambdaProxyIntegration);

    if (lambdaProxyIntegration) {
        body = JSON.parse(event.body);
    } else {
        body = event;
    }

    logger.debug('putParty.js: body: ' + JSON.stringify(body, null, 4));

    const partyID = guid(hash(body.lastName)).toString();
    logger.debug('putParty.js: partyID: ' + partyID);
    const param = {
        'TableName': 'party',
        'ReturnConsumedCapacity': 'TOTAL',
        'Item': {
            'partyID': {
                'N': partyID,
            },
            'firstName': {
                'S': body.firstName,
            },
            'lastName': {
                'S': body.lastName,
            },
        },
    };

    function dynamoCallback(error, dynamoResponse) {
        logger.debug('putParty.js: dynamoResponse: ' + JSON.stringify(dynamoResponse, null, 4));

        if (error) {
            let lambdaError = {
                'statusCode': 500,
                'isBase64Encoded': false,
                'headers': {
                    'Content-Type': '*/*'
                },
                'body': {
                    'message': 'error',
                }
            };

            if (lambdaProxyIntegration) {
                lambdaError.body = JSON.stringify(lambdaError.body);
            }

            logger.error('putParty.js: lambdaError:' + JSON.stringify(lambdaError, null, 4));
            lambdaCallback(
                error,
                lambdaError
            );
        } else {
            let lambdaResult = {
                'statusCode': 200,
                'isBase64Encoded': false,
                'headers': {
                    'Content-Type': '*/*'
                },
                'body': {
                    'partyID': partyID,
                    'message': dynamoResponse,
                }
            };

            if (lambdaProxyIntegration) {
                lambdaResult.body = JSON.stringify(lambdaResult.body);
            }

            logger.debug('putParty.js: lambdaResult:' +
                         JSON.stringify(lambdaResult, null, 4));

            lambdaCallback(
                null, // errorCode
                lambdaResult
            );
        }
    }

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
    // console.log('main.js:Promise' + JSON.stringify(param));
    dynamodb.putItem(
        param,
        dynamoCallback);
};
