// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk'); 
const hash = require('string-hash');
const logger = require('common').logger;
const Promise = require('promise');
const guid = require('common').generateGUID;

function handler(event, context, lambdaCallback) {
    logger.debug('event: ' + JSON.stringify(event, null, 4));

    // create AWS service functions in handler to allow mocking
    const dynamodb = new AWS.DynamoDB({ 'apiVersion': '2012-08-10' });  

    const dynamoClient = new AWS.DynamoDB.DocumentClient(
        {
            'service': dynamodb,
            'convertEmptyValues': true
        });

    let partyID;

    // prepare a dynamo putData request object
    function prepPutPartyRequest(data) {
        return new Promise(
            // eslint-disable-next-line no-unused-vars
            (resolve, reject) => {
                partyID = guid(hash(data.lastName)).toString();
                logger.debug('partyID: ' + partyID);

                let putPartyRequest = {
                    'TableName': 'party',
                    'ReturnConsumedCapacity': 'TOTAL',
                    'Item': {
                        'partyID': Number(partyID),
                        'firstName': String(data.firstName),
                        'lastName': String(data.lastName),
                    }
                };
                resolve(putPartyRequest);
            }
        );
    }
    
    // call dynamo putData
    function putParty(data) {
        return new Promise(
            (resolve, reject) => {
                dynamoClient.put(
                    data,
                    (error, result) => {
                        if (error) {
                            logger.error('Dynamo error');
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

    prepPutPartyRequest(event)
        .then(putParty)
        .then(
            (result) => {
                lambdaResult.statusCode = 200;
                lambdaResult.body.partyID = partyID;
                lambdaResult.body.message = result;

                lambdaCallback(null, lambdaResult);
            }
        )
        .catch(
            (error) => {
                logger.error(error);
                lambdaResult.statusCode = 500;
                lambdaResult.body.message = error.toString();

                lambdaCallback(error, lambdaResult);
            }
        );
}

module.exports = handler;
