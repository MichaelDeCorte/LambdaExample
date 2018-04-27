// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk'); 
const hash = require('string-hash');
const logger = require('common').logger;
const guid = require('common').generateGUID;

exports.handler = (event, context, lambdaCallback) => {
    logger.debug('event: ' + JSON.stringify(event, null, 4));
    logger.debug('context: ' + JSON.stringify(context, null, 4));

    const partyID = guid(hash(event.lastName)).toString();
    logger.debug('partyID: ' + partyID);
    const param = {
        'TableName': 'party',
        'ReturnConsumedCapacity': 'TOTAL',
        'Item': {
            'partyID': {
                'N': partyID,
            },
            'firstName': {
                'S': event.firstName,
            },
            'lastName': {
                'S': event.lastName,
            },
        },
    };

    // create AWS service functions in handler to allow mocking
    const dynamodb = new AWS.DynamoDB({ 'apiVersion': '2012-08-10' });  

    function dynamoCallback(error, dynamoResponse) {
        logger.debug('dynamoResponse: ' + JSON.stringify(dynamoResponse, null, 4));

        logger.trace('error:' + error);
        logger.trace('error:' + JSON.stringify(error));

        if (error) {
            let lambdaError = {
                'statusCode': 500,
                'isBase64Encoded': false,
                'headers': {
                    'Content-Type': '*/*'
                },
                'body': {
                    'message': error,
                }
            };

            logger.error('lambdaError:' + JSON.stringify(lambdaError, null, 4));
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

            logger.debug('lambdaResult:' +
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
