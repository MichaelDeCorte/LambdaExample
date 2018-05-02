// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk'); 
const logger = require('common').logger;
const Promise = require('promise');

exports.handler = (event, context, lambdaCallback) => {
    logger.debug('event: ' + JSON.stringify(event, null, 4));
    logger.debug('context: ' + JSON.stringify(context, null, 4));

    // create AWS service functions in handler to allow mocking
    const dynamodb = new AWS.DynamoDB({ 'apiVersion': '2012-08-10' });  

    const dynamoClient = new AWS.DynamoDB.DocumentClient(
        {
            'service': dynamodb,
            'convertEmptyValues': true
        });

    // prepare a dynamo getData request object
    function prepGetPartyRequest(data) {
        logger.trace('data: ' + JSON.stringify(data, null, 4));

        let getPartyRequest = {
            'TableName': 'party',
            'Key': {
                'partyID': Number(data.partyID)
            },
            'ProjectionExpression': 'partyID, firstName, lastName',
            'ReturnConsumedCapacity': 'TOTAL',
        };

        return getPartyRequest;
    }

    // call dynamo getData
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
    function getParty(data) {
        logger.trace('data: ' + JSON.stringify(data, null, 4));

        return new Promise(
            (resolve, reject) => {
                dynamoClient.get(
                    data,
                    (error, result) => {
                        if (error) {
                            logger.warn('getItem:'
                                         + error +
                                         JSON.stringify(data, null, 4));
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

    let getPartyRequest = prepGetPartyRequest(event);
    getParty(getPartyRequest)
        .then(
            (result) => {
                logger.trace('Result: ' + JSON.stringify(result, null, 4));
                lambdaResult.statusCode = 200;
                lambdaResult.body = result.Item;

                logger.trace('lambdaResult: ' + JSON.stringify(lambdaResult, null, 4));
                lambdaCallback(null, lambdaResult);
            }
        )
        .catch(
            (error) => {
                logger.warn(error);
                lambdaResult.statusCode = 500;
                lambdaResult.body.message = error;

                logger.trace('lambdaResult: ' + JSON.stringify(lambdaResult, null, 4));
                lambdaCallback(error, lambdaResult);
            }
        );
};
