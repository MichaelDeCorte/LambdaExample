// https://github.com/mattphillips/jest-each
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk-mock'); 
const each = require('jest-each');
const Promise = require('promise');
const logger = require('common').logger;
const party = require('../src/party').handler;

let dynamoResponse = {
    'ConsumedCapacity': {
        'TableName': 'party',
        'CapacityUnits': 1,
    }
};

function testFunc(input, output, done) {
    const lambdaParam = input.testData;
    let dynamoError = input.dynamoError;
    let testResult = output.testResult;
    let errorResult = output.errorResult;
    
    logger.trace('lambdaParam: '
                 + JSON.stringify(lambdaParam, null, 4));
    logger.trace('dynamoError: ' +
                 JSON.stringify(dynamoError, null, 4));
    logger.trace('testResult: ' +
                 JSON.stringify(testResult, null, 4));
    logger.trace('errorResult: ' +
                 JSON.stringify(errorResult, null, 4));

    expect.assertions(1);

    AWS.mock('DynamoDB.DocumentClient',
             'put',
             (params, dynamoClientCallback) => {
                 logger.trace('mockClient: ' + JSON.stringify(params, null, 4));
                 dynamoClientCallback(dynamoError, dynamoResponse);
                 AWS.restore('DynamoDB.DocumentClient');
             });


    // AWS.mock('DynamoDB',
    //          'putItem',
    //          (params, dynamoCallback) => {
    //              logger.trace('mock: ' + JSON.stringify(params, null, 4));
    //              dynamoCallback(dynamoError, dynamoResponse);
    //              AWS.restore('DynamoDB');
    //          });

    return new Promise(
        (resolve, reject) => {
            party(lambdaParam,
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
            expect(lambdaError).toEqual(errorResult);
            done();
        }
    ).catch( 
        (error) => {
            done.fail(error);
        }
    );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('putParty unit tests / stubbed AWS calls', testFunc);
