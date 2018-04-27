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
    let testResult = output.testResult;

    // prepare a lambda putParty request object
    function prepPutPartyRequest(data) {
        /* eslint-disable */
        let putPartyRequest = {
            FunctionName: 'party',
            Payload: JSON.stringify( {
                'firstName': 'testFirstName',
                'lastName': 'testLastName'
            } )
        };
        /* eslint-enable */
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
        /* eslint-disable */
        let getPartyRequest = {
            FunctionName: 'party',
            Payload: JSON.stringify({
                'command': 'getParty',            
                'partyID': JSON.parse(putPartyResult.Payload).body.partyID,
                'lastName': testData.lastName,
            })
        };
        /* eslint-enable */

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
                let t = JSON.parse(actualResult.Payload).body.firstName
                    + ' ' 
                    + JSON.parse(actualResult.Payload).body.lastName;
                expect(t).toBe(testResult);
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
                done.fail(error);
            }
        );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('putParty integration tests', testFunc);

