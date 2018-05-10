/* eslint import/no-unresolved: off */
const each = require('jest-each');
const logger = require('common').logger;
const requestTest = require('supertest');
const uri = require('./party.uat.uri.js').uri;

// Initialize AWS credentials

function testFunc(input, output, done) {
    expect.assertions(4);

    let getData = input.getData;
    let putData = input.putData;
    let testResult = output.testResult;

    logger.trace('uri: ' + uri);
    logger.trace('input: ' + JSON.stringify(input, null, 4));
    logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));

    // insert a party object
    function putParty() {
        return requestTest.agent(uri)
            .post('/')
            .send(putData)
            .then(
                (response) => {
                    let statusCode = response.status;
                    let partyID = JSON.parse(response.text).partyID;
                    getData.partyID =  partyID;
                    testResult.partyID = Number(partyID);

                    expect(statusCode).toEqual(200);
                    expect(parseInt(partyID, 10)).toBeGreaterThan(0);
                }
            );
    }

    // get that same party
    function getParty() {
        return requestTest.agent(uri)
            .post('/')
            .send(getData)
            .then(
                (response) => {
                    logger.debug('response: ' + JSON.stringify(response, null, 4));
                    logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
                    let statusCode = response.status;
                    let body = JSON.parse(response.text);

                    expect(statusCode).toEqual(200);
                    expect(body).toEqual(testResult);
                    done();
                }
            );
    }

    putParty()
        .then(getParty)
        .catch(
            (error) => {
                logger.debug('error: ' + JSON.stringify(error, null, 4));
                done.fail(error);
            }
        );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('putParty URI integration tests', testFunc);
