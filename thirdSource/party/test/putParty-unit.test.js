// https://github.com/mattphillips/jest-each
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk-mock'); 
const each = require('jest-each');
const Promise = require('promise');
const logger = require('common').logger;
const putParty = require('../src/party').handler;

let dynamoResult = {
    'ConsumedCapacity': {
        'TableName': 'party',
        'CapacityUnits': 1,
    }
};

function testFunc(testData, dynamoError, testResult, errorResult, done) {
    const lambdaParam = testData;

    logger.trace('testData: '
                 + JSON.stringify(testData, null, 4));
    logger.trace('dynamoError: ' +
                 JSON.stringify(dynamoError, null, 4));
    logger.trace('testResult: ' +
                 JSON.stringify(testResult, null, 4));
    logger.trace('errorResult: ' +
                 JSON.stringify(errorResult, null, 4));

    expect.assertions(1);

    AWS.mock('DynamoDB',
             'putItem',
             (params, dynamoCallback) => {
                 dynamoCallback(dynamoError.error, dynamoResult);
                 AWS.restore('DynamoDB');
             });

    return new Promise(
        (resolve, reject) => {
            putParty(lambdaParam,
                     { 'context': 'empty' }, 
                     (error, result) => {
                         if (error) {
                             reject(error);
                         } else {
                             resolve(result);
                         }
                     });
        }
    ).then(
        (lambdaResult) => { 
            logger.debug('lambdaResult: '
                         + JSON.stringify(lambdaResult, null, 4));
            logger.trace('testResult: '
                         + JSON.stringify(testResult, null, 4));
            expect(lambdaResult.body.message).toEqual(testResult);
            done();
        }
    ).catch(
        (lambdaError) => {
            logger.debug('lambdaError: ' + JSON.stringify(lambdaError, null, 4));
            logger.trace('errorResult: ' + JSON.stringify(errorResult, null, 4));
            expect(lambdaError).toEqual(errorResult.error);
            done();
        }
    ).catch( 
        (error) => {
            done.fail(error);
        }
    );
}

// eslint-disable-next-line 
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

each(testData).test('putParty unit tests / stubbed AWS calls', testFunc);
