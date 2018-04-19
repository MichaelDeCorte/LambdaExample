const AWS = require('aws-sdk');
const each = require('jest-each');
const Promise = require('promise');
const logger = require('../src/logger.js').logger;

// Initialize AWS credentials
const credentials = new AWS.SharedIniFileCredentials(); 
AWS.config.credentials = credentials;

// AWS Lambda API with default calling parameters
const lambda = new AWS.Lambda();

const dynamodb = new AWS.DynamoDB({ 'apiVersion': '2012-08-10' });  

// test service
function testFunc(testData, expectedResult, done) {
    let getPartyData = {
        'TableName': 'party',
        'Key': {
            'partyID': { 'N': '0' },
            'lastName': { 'S': 'no data' },
        },
        'ProjectionExpression': 'partyID, firstName, lastName',
        'ReturnConsumedCapacity': 'TOTAL',
    };

    /* eslint-disable */
    let putPartyData = {
        FunctionName: 'putParty',
        Payload: JSON.stringify( {
            'firstName': 'testFirstName',
            'lastName': 'testLastName'
        } )
    };
    putPartyData.Payload = JSON.stringify(testData);
    /* eslint-enable */

    // putParty Data via lambda
    function putParty(data) {
        jest.setTimeout(10000); // 10 second timeout.  lambda can be slow at times

        logger.debug('putParty-aws.test.js: data: ' + JSON.stringify(data, null, 4));
        return new Promise(
            (resolve, reject) => {
                lambda.invoke(data,
                              (error, result) => {
                                  if (error) {
                                      logger.error('putParty-aws.test.js: Lambda.invoke:' + error);
                                      reject(error);
                                  } else {
                                      resolve(result);
                                  }
                              });
            }
        );
    }

    // take results of getParty and merge with putPartyData structure
    function prepPartyData(putPartyResult) {
        logger.debug('putParty-aws.test.js: putPartyResult: ' + JSON.stringify(putPartyResult, null, 4));

        return new Promise(
            (resolve, reject) => { // eslint-disable-line no-unused-vars
                getPartyData.Key.partyID =
                    {
                        'N': JSON.parse(putPartyResult.Payload).body.partyID
                    };
                getPartyData.Key.lastName =
                    {
                        'S': testData.lastName
                    };
                resolve(getPartyData);
            }
        );
    }

    // get PartyData via Dynamo directly
    function getParty(data) {
        logger.debug('putParty-aws.test.js: data: ' + JSON.stringify(data, null, 4));

        return new Promise(
            (resolve, reject) => {
                dynamodb.getItem(data,
                                 (error, result) => {
                                     if (error) {
                                         logger.error('putParty-aws.test.js: dynamodb.getItem:'
                                                      + error +
                                                      JSON.stringify(data, null, 4));
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
        logger.debug('putParty-aws.test.js: actualResult: ' + JSON.stringify(actualResult, null, 4));
        return new Promise(
            (resolve, reject) => { // eslint-disable-line no-unused-vars
                let t = actualResult.Item.firstName.S +
                    ' ' + actualResult.Item.lastName.S;
                expect(t).toBe(expectedResult);
                done();
            }
        );
    }

    putParty(putPartyData)
        .then(prepPartyData)
        .then(getParty)
        .then(validatePartyData)
        .catch(
            (error) => {
                done.fail(error);
            }
        );
}

// eslint-disable-next-line 
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

each(testData).test('putParty integration tests', testFunc);
