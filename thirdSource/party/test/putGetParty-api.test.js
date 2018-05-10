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
    let testData = input.testData;
    let partyID = output.partyID;
    let testResult = output.testResult;
    let testError = output.testError;

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

    // prepare a lambda getItem request object
    function prepGetPartyRequest(putPartyResult) {
        logger.debug('putPartyResult: ' + JSON.stringify(putPartyResult, null, 4));
        if (!partyID) {
            partyID = JSON.parse(putPartyResult.Payload).body.partyID;
        }
        let getPartyRequest = {
            'FunctionName': 'party',
            'Payload': JSON.stringify({
                'command': 'getParty',            
                'partyID': partyID
            })
        };

        return new Promise(
            (resolve, reject) => { // eslint-disable-line no-unused-vars
                resolve(getPartyRequest);
            }
        );
    }

    // call lambda getParty
    function getParty(getPartyRequest) {
        logger.debug('getPartyRequest: ' + JSON.stringify(getPartyRequest, null, 4));

        return new Promise(
            (resolve, reject) => {
                lambda.invoke(getPartyRequest,
                              (error, result) => {
                                  if (error) {
                                      logger.warn('lambda.invoke:'
                                                   + error +
                                                   JSON.stringify(getPartyRequest, null, 4));
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
                let t;
                logger.trace('body: ' + JSON.stringify(body, null, 4));
                logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
                if (body) {
                    t = body.firstName + ' ' + body.lastName;
                } else {
                    t = null;
                }
                expect(t).toEqual(testResult);
                done();
            }
        );
    }

    let putPartyRequest = prepPutPartyRequest(testData);
    putParty(putPartyRequest)
        .then(prepGetPartyRequest)
        .then(getParty)
        .then(validatePartyData)
        .catch(
            (error) => {
                logger.error('error: ' + error);
                if (testError) {
                    let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');
                    expect(e).toBe(testError.toString());
                    done();
                } else {
                    done.fail(error);
                }
            }
        );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('putParty aws API integration tests', testFunc);

