const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const logger = require('../src/logger.js').logger;
const hash = require('string-hash');
const guid = require('./guid').generateGUID;


exports.handler = (event, context, lambdaCallback) => {
    // create AWS service functions in handler to allow mocking
    const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });  
    const eventObj = event;

    const partyID = guid(hash(eventObj.lastName)).toString();

    console.log('LOG_LEVEL=' + process.env.LOG_LEVEL);

    logger.debug('putParty.js: partyID: ' + partyID);
    const param = {
        TableName: 'party',
        ReturnConsumedCapacity: 'TOTAL',
        Item: {
            partyID: {
                N: partyID,
            },
            firstName: {
                S: eventObj.firstName,
            },
            lastName: {
                S: eventObj.lastName,
            },
        },
    };

    function dynamoCallback(error, dynamoResponse) {
        logger.debug('putParty.js: dynamoResponse: ' + JSON.stringify(dynamoResponse, null, 4));
        if (error) {
            logger.error('putParty.js: '
                        + ' error:' + error
                        + ' event:' + JSON.stringify(event, null, 4)
                        + ' context:' + JSON.stringify(context, null, 4));
            lambdaCallback(
                error,
                {
                    StatusCode: '500',
                    Payload: {
                        message: error,
                    }
                }
            );
        } else {
            lambdaCallback(
                null, // errorCode
                {
                    partyID: partyID,
                    message: dynamoResponse,
                }
            );
        }
    }

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
    // console.log('main.js:Promise' + JSON.stringify(param));
    dynamodb.putItem(
        param,
        dynamoCallback);
};
