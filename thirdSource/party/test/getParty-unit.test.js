// https://github.com/mattphillips/jest-each
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk-mock'); 
const each = require('jest-each');
const logger = require('common').logger;
// const lambdaMethod = require('methodRouter').methodRouter;
const lambdaMethod = require('../src/party').handler;

let partyMap = {
    'getParty': {
        'fileName': 'getParty',
        'eventValidate': 'partyValidate'
    },
    'putParty': {
        'fileName': 'putParty',
        'eventSchema': 'eventSchema',
    }
};

function testFunc(input, output, done) {
    const event = input.testData;
    let dynamoResponse = input.dynamoResponse;
    let dynamoError = input.dynamoError;
    let testResult = output.testResult;
    let testError = output.testError;

    logger.trace('event: '
                 + JSON.stringify(event, null, 4));
    logger.trace('dynamoResponse: ' +
                 JSON.stringify(dynamoResponse, null, 4));
    logger.trace('dynamoError: ' +
                 JSON.stringify(dynamoError, null, 4));
    logger.trace('testResult: ' +
                 JSON.stringify(testResult, null, 4));
    logger.trace('testError: ' +
                 JSON.stringify(testError, null, 4));

    expect.assertions(1);

    AWS.mock('DynamoDB.DocumentClient',
             'get',
             (params, dynamoClientCallback) => {
                 logger.trace('mockClient: ' + JSON.stringify(params, null, 4));
                 dynamoClientCallback(dynamoError, dynamoResponse);
                 AWS.restore('DynamoDB.DocumentClient');
             });

    return new Promise(
        (resolve, reject) => {
            lambdaMethod(event,
                         {}, // MRD should this be { 'context': 'empty' }?
                         (error, result) => {
                             if (error) {
                                 reject(error);
                             } else {
                                 resolve(result);
                             }
                         },
                         partyMap);
        })
        .then(
            (result) => { 
                logger.debug('result: ' + JSON.stringify(result, null, 4));
                logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
                expect(result.body).toEqual(testResult);
                done();
            })
        .catch(
            (error) => {
                logger.trace('error: ' + error);
                let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');

                expect(e).toEqual(testError);
                done();
            }
        )
        .catch( 
            (error) => {
                logger.debug('error: ' + error);
                done.fail(error);
            }
        );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('getParty unit tests / stubbed AWS calls', testFunc);
