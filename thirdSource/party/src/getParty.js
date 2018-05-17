// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk'); 
const logger = require('common').logger;
const Promise = require('promise');
const Joi = require('joi');

const eventSchema = Joi.object().keys(
    {
        'partyID': Joi.number().required(),
    });

const joiOptions = {
    'abortEarly': false,
    'convert': true,
    'stripUnknown': true,
};

function handler(event, context, lambdaCallback) {
    logger.debug('event: ' + JSON.stringify(event, null, 4));

    // create AWS service functions in handler to allow mocking
    const dynamodb = new AWS.DynamoDB({ 'apiVersion': '2012-08-10' });  

    const dynamoClient = new AWS.DynamoDB.DocumentClient(
        {
            'service': dynamodb,
            'convertEmptyValues': true
        });

    function validateEvent(data) {
        return new Promise(
            (resolve, reject) => {
                logger.error('data:' +
                             JSON.stringify(data, null, 4));
                const dataValidated = Joi.validate(data, eventSchema, joiOptions);
                logger.error('dataValidated:' +
                             JSON.stringify(dataValidated, null, 4));
                if (dataValidated.error) {
                    reject(new Error('DataValidationError'));
                } else {
                    resolve(dataValidated);
                }
            }
        );
    }

    // prepare a dynamo getData request object
    function prepGetPartyRequest(data) {
        return new Promise(
            // eslint-disable-next-line no-unused-vars
            (resolve, reject) => {
                let getPartyRequest = {
                    'TableName': 'party',
                    'Key': {
                        'partyID': Number(data.partyID)
                    },
                    'ProjectionExpression': 'partyID, firstName, lastName',
                    'ReturnConsumedCapacity': 'TOTAL',
                };
                resolve(getPartyRequest);
            }
        );
    }

    // call dynamo getData
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
    function getParty(data) {
        return new Promise(
            (resolve, reject) => {
                dynamoClient.get(
                    data,
                    (error, result) => {
                        if (error) {
                            logger.error('getItem: error: ' + error 
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

    validateEvent(event)
        .then(prepGetPartyRequest)
        .then(getParty)
        .then(
            (result) => {
                lambdaResult.statusCode = 200;
                if (result.Item) {
                    lambdaResult.body = result.Item;
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
