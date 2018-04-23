// https://github.com/mattphillips/jest-each

const AWS = require('aws-sdk-mock'); // eslint-disable-line import/no-extraneous-dependencies
const each = require('jest-each');
const Promise = require('promise');
const logger = require('../src/logger.js').logger;
const putParty = require('../src/putParty').handler;


function testFunc(testData, testResult, done) {
    const lambdaParam = testData;

    logger.debug('putParty-unit.test.js: testData: ' + JSON.stringify(testData, null, 4));
    logger.debug('putParty-unit.test.js: testResult: ' + JSON.stringify(testResult, null, 4));

    // https://facebook.github.io/jest/docs/en/expect.html
    expect.assertions(1);

    AWS.mock('DynamoDB',
             'putItem',
             (params, dynamoCallback) => {
                 dynamoCallback(null, /* errorCode */ testData);
                 AWS.restore('DynamoDB');
             });

    return new Promise(
        (resolve, reject) => {
            logger.debug('putParty-unit.test.js: lambdaParam: ' + JSON.stringify(lambdaParam, null, 4));
            putParty(lambdaParam,
                     null, // context
                     (error, result) => {
                         if (error) {
                             reject(error);
                         } else {
                             resolve(result);
                         }
                     });
        }
    ).then(
        (putPartyResult) => { 
            logger.debug('putParty-unit.test.js: putPartyResult: ' + JSON.stringify(putPartyResult, null, 4));
            try {
                expect(putPartyResult.body.message).toEqual(testResult);
                done();
            } catch (e) {
                done.fail(e);
            }
        },
        (lambdaError) => {
            logger.error('putParty-unit.test.js: lambdaError: ' + lambdaError);
            done.fail(lambdaError);
        }
    );
}

// eslint-disable-next-line 
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

each(testData).test('putParty unit tests / stubbed AWS calls', testFunc);
