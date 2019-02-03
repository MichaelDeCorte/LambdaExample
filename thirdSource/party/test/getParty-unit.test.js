// https://github.com/mattphillips/jest-each
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk-mock'); 
const each = require('jest-each');
const logger = require('common').logger;
// const lambdaMethod = require('methodRouter').methodRouter;
const lambdaMethod = require('../src/party').handler;

let partyMap = {
    'getParty': {
        'method': 'getParty',
        'eventValidate': 'partyValidate'
    },
    'putParty': {
        'method': 'putParty',
        'eventSchema': 'eventSchema',
    }
};

function testFunc(input, output, done) {
    const event = input.testData;
    let mockResponse = input.mockResponse;
    let mockError = input.mockError;
    let expectedResult = output.expectedResult;
    let expectedError = output.expectedError;

    logger.trace('event: '
                 + JSON.stringify(event, null, 4));
    logger.trace('mockResponse: '
                 + JSON.stringify(mockResponse, null, 4));
    logger.trace('mockError: '
                 + JSON.stringify(mockError, null, 4));
    logger.trace('expectedResult: ' 
                 + JSON.stringify(expectedResult, null, 4));
    logger.trace('expectedError: ' 
                 + JSON.stringify(expectedError, null, 4));

    expect.assertions(1);

    AWS.mock('DynamoDB.DocumentClient',
             'get',
             (params, dynamoClientCallback) => {
                 logger.trace('mockClient: ' + JSON.stringify(params, null, 4));
                 dynamoClientCallback(mockError, mockResponse);
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
                logger.trace('expectedResult: ' + JSON.stringify(expectedResult, null, 4));
                expect(result.body).toEqual(expectedResult);
                done();
            })
        .catch(
            (error) => {
                logger.trace('error: ' + error);
                let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');

                expect(e).toEqual(expectedError);
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
