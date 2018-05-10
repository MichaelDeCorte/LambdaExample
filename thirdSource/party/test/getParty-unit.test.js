// https://github.com/mattphillips/jest-each
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk-mock'); 
const each = require('jest-each');
const Promise = require('promise');
const logger = require('common').logger;
const party = require('../src/party').handler;


function testFunc(input, output, done) {
    const lambdaParam = input.testData;
    let dynamoResponse = input.dynamoResponse;
    let dynamoError = input.dynamoError;
    let testResult = output.testResult;
    let testError = output.testError;

    logger.trace('lambdaParam: '
                 + JSON.stringify(lambdaParam, null, 4));
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
            logger.debug('lambdaResult: ' + JSON.stringify(lambdaResult, null, 4));
            logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
            expect(lambdaResult.body).toEqual(testResult);
            done();
        }
    ).catch(
        (lambdaError) => {
            logger.debug('lambdaError: ' + JSON.stringify(lambdaError, null, 4));
            logger.trace('testError: ' + JSON.stringify(testError, null, 4));
            let e = lambdaError.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');
            expect(e).toEqual(testError.toString());
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

each(testSuite).test('getParty unit tests / stubbed AWS calls', testFunc);
