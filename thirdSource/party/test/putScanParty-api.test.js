/* eslint import/no-unresolved: off */
const AWS = require('aws-sdk');
const each = require('jest-each');
const Promise = require('promise');
const logger = require('common').logger;

// Initialize AWS credentials
const credentials = new AWS.SharedIniFileCredentials(); 
AWS.config.credentials = credentials;

// AWS Lambda API with default calling parameters
const lambda = new AWS.Lambda();

// test service
function testFunc(input, output, done) {
    let putTestData = input.putTestData;
    let scanTestData = input.scanTestData;
    let expectedResult = output.expectedResult;
    let expectedError = output.expectedError;

    // prepare a lambda putParty request object
    function prepPutPartyRequest(data) {
        let putPartyRequest = {
            'FunctionName': 'party',
            'Payload': JSON.stringify({
                'firstName': 'testFirstName',
                'lastName': 'testLastName'
            })
        };
        putPartyRequest.Payload = JSON.stringify(data);

        return putPartyRequest;
    }

    // call lambda putParty
    function putParty(putPartyRequest) {
        jest.setTimeout(10000); // 10 second timeout.  lambda can be slow at times

        logger.debug('putPartyRequest: ' + JSON.stringify(putPartyRequest, null, 4));
        return new Promise(
            (resolve, reject) => {
                lambda.invoke(putPartyRequest,
                              (error, result) => {
                                  if (error) {
                                      logger.warn('Lambda.invoke:' + error);
                                      reject(error);
                                  } else {
                                      resolve(result);
                                  }
                              });
            }
        );
    }

    // prepare a lambda request object
    function prepScanPartyRequest(putPartyResult) {
        logger.debug('putPartyResult: ' + JSON.stringify(putPartyResult, null, 4));
        let scanPartyRequest = {
            'FunctionName': 'party',
            'Payload': JSON.stringify(scanTestData)
        };

        return new Promise(
            (resolve, reject) => { // eslint-disable-line no-unused-vars
                resolve(scanPartyRequest);
            }
        );
    }

    // call lambda scanParty
    function scanParty(scanPartyRequest) {
        logger.debug('scanPartyRequest: ' + JSON.stringify(scanPartyRequest, null, 4));

        return new Promise(
            (resolve, reject) => {
                lambda.invoke(scanPartyRequest,
                              (error, result) => {
                                  if (error) {
                                      logger.warn('lambda.invoke:'
                                                   + error
                                                   + JSON.stringify(scanPartyRequest, null, 4));
                                      reject(error);
                                  } else {
                                      resolve(result);
                                  }
                              });
            }
        );
    }

    // compare actual results with expected test results
    function validatePartyData(actualResult) {
        logger.debug('actualResult: ' + JSON.stringify(actualResult, null, 4));
        return new Promise(
            (resolve, reject) => { // eslint-disable-line no-unused-vars
                let body = JSON.parse(actualResult.Payload).body;
                logger.trace('body: ' + JSON.stringify(body, null, 4));
                logger.trace('expectedResult: ' + JSON.stringify(expectedResult, null, 4));
                let element = null;

                // only look at the first element for test purposes
                if (body != null && body.length > 0) {
                    element = body[0];
                    element.partyID = null;
                }

                expect(element).toEqual(expectedResult);
                done();
            }
        );
    }

    let putPartyRequest = prepPutPartyRequest(putTestData);
    putParty(putPartyRequest)
        .then(prepScanPartyRequest)
        .then(scanParty)
        .then(validatePartyData)
        .catch(
            (error) => {
                logger.error('error: ' + error);
                if (expectedError) {
                    let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');
                    expect(e).toBe(expectedError);
                    done();
                } else {
                    done.fail(error);
                }
            }
        );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('putScanParty aws API integration tests', testFunc);
