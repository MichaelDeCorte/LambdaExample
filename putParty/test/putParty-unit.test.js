// https://github.com/mattphillips/jest-each

const AWS = require('aws-sdk-mock'); // eslint-disable-line import/no-extraneous-dependencies
const Promise = require('promise');
const putParty = require('../src/putParty').handler;
const each = require('jest-each');

function testFunc(testData, testResult, done) {
    const lambdaParam = testData;

    // https://facebook.github.io/jest/docs/en/expect.html
    expect.assertions(1);

    AWS.mock('DynamoDB',
             'putItem',
             (params, dynamoCallback) => {
                 dynamoCallback(null, /* errorCode */  testData);
                 AWS.restore('DynamoDB');
             });

    return new Promise(
        (resolve, reject) => {
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
        (lambdaResponse) => { 
            try {
                expect(lambdaResponse.message).toEqual(testResult);
                done();
            } catch (e) {
                done.fail(e);
            }
        },
        (lambdaError) => {
            done.fail(lambdaError);
        }
    );
}

// eslint-disable-next-line 
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

each(testData).test('PutParty unit tests / stubbed AWS calls', testFunc);
