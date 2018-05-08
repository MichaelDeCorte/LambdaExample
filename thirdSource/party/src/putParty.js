// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk'); 
const hash = require('string-hash');
const logger = require('common').logger;
const Promise = require('promise');
const guid = require('common').generateGUID;
const Joi = require('joi');

const alphaSpaceRE = /^[A-Za-z ]*$/;
const eventSchema = Joi.object().keys(
    {
        'lastName': Joi.string().regex(alphaSpaceRE).min(1).max(30).trim().truncate().required(),
        'firstName': Joi.string().regex(alphaSpaceRE).min(1).max(30).trim().truncate().required(),
    });

const joiOptions = {
    'abortEarly': false,
    'convert': true,
    'stripUnknown': true,
};

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


    let partyID;

    function validateEvent(data) {
        return new Promise(
            (resolve, reject) => {
                const dataValidated = Joi.validate(data, eventSchema, joiOptions);
                logger.trace('dataValidated:' +
                             JSON.stringify(dataValidated, null, 4));
                if (dataValidated.error) {
                    reject(new Error('DataValidationError'));
                } else {
                    resolve(dataValidated);
                }
            }
        );
    }

    // prepare a dynamo putData request object
    function prepPutPartyRequest(data) {
        logger.trace('data: ' + JSON.stringify(data, null, 4));

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


    validateEvent(event)
        .then(prepPutPartyRequest)
        .then(putParty)
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
