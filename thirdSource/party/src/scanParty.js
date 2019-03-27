// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk'); 
const logger = require('common').logger;
const Promise = require('promise');
const dynamoEnvironment = require('common').dynamoEnvironment;

function handler(event, context, lambdaCallback) {
    logger.debug('event: ' + JSON.stringify(event, null, 4));

    // create AWS service functions in handler to allow mocking
    const dynamodb = new AWS.DynamoDB({ 'apiVersion': '2012-08-10' });  

    const dynamoClient = new AWS.DynamoDB.DocumentClient(
        {
            'service': dynamodb,
            'convertEmptyValues': true
        });

    // prepare a dynamo request object
    function prepScanRequest(data) {
        return new Promise(
            // eslint-disable-next-line no-unused-vars
            (resolve, reject) => {
                let scanRequest = {
                    'TableName': 'party',
                    'FilterExpression': data.FilterExpression,
                    'ExpressionAttributeValues': data.ExpressionAttributeValues,
                    'ProjectionExpression': 'partyID, firstName, lastName',
                    'ReturnConsumedCapacity': 'TOTAL',
                };
                resolve(scanRequest);
            }
        );
    }

    // call dynamo scan
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
    function scanParty(data) {
        return new Promise(
            (resolve, reject) => {
                dynamoClient.scan(
                    data,
                    (error, result) => {
                        if (error) {
                            logger.error('scan: error: ' + error 
                                         + ' data: ' + JSON.stringify(data, null, 4) 
                                         + 'result: ' + JSON.stringify(result, null, 4));
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
            }
        );
    }

    let lambdaResult = {
        'statusCode': null,
        'isBase64Encoded': false,
        'headers': {
            'Content-Type': '*/*'
        },
        'body': {
        }
    };

    prepScanRequest(event)
        .then(dynamoEnvironment)
        .then(scanParty)
        .then(
            (result) => {
                lambdaResult.statusCode = 200;
                if (result.Items) {
                    lambdaResult.body = result.Items;
                } else {
                    lambdaResult.body = null;
                }

                lambdaCallback(null, lambdaResult);
            }
        )
        .catch(
            (error) => {
                logger.error(error);
                lambdaResult.statusCode = 500;
                lambdaResult.body.message = error;

                lambdaCallback(error, lambdaResult);
            }
        );
}

module.exports = handler;
