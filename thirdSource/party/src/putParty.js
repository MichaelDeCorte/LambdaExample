// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk'); 
const hash = require('string-hash');
const logger = require('common').logger;
const Promise = require('promise');
const guid = require('common').generateGUID;

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


    const partyID = guid(hash(event.lastName)).toString();
    logger.debug('partyID: ' + partyID);

    // prepare a dynamo putData request object
    function prepPutPartyRequest(data) {
        logger.trace('data: ' + JSON.stringify(data, null, 4));

        let putPartyRequest = {
            'TableName': 'party',
            'ReturnConsumedCapacity': 'TOTAL',
            'Item': {
                'partyID': Number(partyID),
                'firstName': String(data.firstName),
                'lastName': String(data.lastName),
            },
        };
        return putPartyRequest;
    }
    
    // call dynamo putData
    function putParty(data) {
        logger.trace('data: ' + JSON.stringify(data, null, 4));

        return new Promise(
            (resolve, reject) => {
                dynamoClient.put(
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
            'partyID': null,
            'message': null,
        }
    };

    let putPartyRequest = prepPutPartyRequest(event);
    putParty(putPartyRequest)
        .then(
            (result) => {
                logger.trace('Result: ' + JSON.stringify(result, null, 4));
                lambdaResult.statusCode = 200;
                lambdaResult.body.partyID = partyID;
                lambdaResult.body.message = result;

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
