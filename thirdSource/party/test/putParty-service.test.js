const each = require('jest-each');
const logger = require('../src/logger.js').logger;
const requestTest = require('supertest');
const uri = require('./putParty-service.uri.js').uri;

// Initialize AWS credentials

function testFunc(testData, expectedResult, done) {
    expect.assertions(2);

    logger.debug('uri: ' + uri);
    logger.debug('testData: ' + JSON.stringify(testData, null, 4));

    requestTest.agent(uri)
        .post('/')
        .send(testData)
        .then(
            (response) => {
                logger.debug('response: ' + JSON.stringify(response, null, 4));
                let statusCode = response.status;
                let partyID = JSON.parse(response.text).partyID;
                expect(statusCode).toBe(200);
                expect(parseInt(partyID, 10)).toBeGreaterThan(0);
                done();
            }
        )
        .catch(
            (error) => {
                logger.debug('error: ' + JSON.stringify(error, null, 4));
                done.fail(error);
            }
        );
}

// eslint-disable-next-line 
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

each(testData).test('putParty service tests', testFunc);
