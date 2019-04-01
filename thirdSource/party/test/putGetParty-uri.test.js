/* eslint import/no-unresolved: off */
const each = require('jest-each');
const logger = require('common').logger;
const requestTest = require('supertest');
const authenticateTestUser = require('common.test').authenticateTestUser;
const getAuthorizationToken = require('common.test').getAuthorizationToken;
const environment = require('environment').environment();

const uri = environment.apiEndPoints.party.endpoint;

// Initialize AWS credentials
function testFunc(input, output, done) {
    expect.assertions(4);

    let getTestData = input.getTestData;
    let putTestData = input.putTestData;
    let expectedResult = output.expectedResult;

    logger.trace('uri: ' + uri);
    logger.trace('input: ' + JSON.stringify(input, null, 4));
    logger.trace('expectedResult: ' + JSON.stringify(expectedResult, null, 4));

    // insert a party object
    function putParty() {
        return requestTest.agent(uri)
            .post('/')
            .set('Authorization', getAuthorizationToken())
            .send(putTestData)
            .then(
                (response) => {
                    logger.trace('request:\n'  + response.req._header);
                    logger.trace('response:\n' + JSON.stringify(response, null, 4));
                    let statusCode = response.status;
                    let partyID = JSON.parse(response.text).partyID;
                    getTestData.partyID =  partyID;
                    expectedResult.partyID = Number(partyID);

                    expect(statusCode).toEqual(200);
                    expect(parseInt(partyID, 10)).toBeGreaterThan(0);
                }
            );
    }

    // get that same party
    function getParty() {
        return requestTest.agent(uri)
            .post('/')
            .send(getTestData)
            .set('Authorization', getAuthorizationToken())
            .then(
                (response) => {
                    // logger.debug('response: ' + JSON.stringify(response, null, 4));
                    // logger.trace('expectedResult: ' + JSON.stringify(expectedResult, null, 4));
                    let statusCode = response.status;
                    let body = JSON.parse(response.text);

                    expect(statusCode).toEqual(200);
                    expect(body).toEqual(expectedResult);
                    done();
                }
            );
    }

    authenticateTestUser() 
        .then(putParty)
        .then(getParty)
        .catch(
            (error) => {
                // logger.debug('error: ' + JSON.stringify(error, null, 4));
                done.fail(error);
            }
        );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('putParty URI integration tests', testFunc);
