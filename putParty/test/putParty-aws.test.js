const AWS = require('aws-sdk');
const each = require('jest-each');
const Promise = require('promise');

// Initialize AWS credentials
const credentials = new AWS.SharedIniFileCredentials(); 
AWS.config.credentials = credentials;

// AWS Lambda API with default calling parameters
const lambda = new AWS.Lambda();

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });  

// put PartyData via lambda
function partyPut(partyDataPut) {
    return new Promise(
        (resolve, reject) => {
            lambda.invoke(partyDataPut,
                          (error, result) => {
                              if (error) {
                                  console.log('Error: Lambda.invoke:' + error);
                                  reject(error);
                              } else {
                                  resolve(result);
                              }
                          });
        }
    );
}

// get PartyData via Dynamo directly
function dynamoPartyGet(partyDataGet) {
    return new Promise(
        (resolve, reject) => {
            dynamodb.getItem(partyDataGet,
                             (error, result) => {
                                 if (error) {
                                     console.log('Error: dynamodb.getItem:' + error);
                                     reject(error);
                                 } else {
                                     resolve(result);
                                 }
                             });
        }
    );
}

// test service
function testFunc(testData, expectedResult, done) {
    let partyDataGet = {
        TableName: 'party',
        Key: {
            partyID: { N: '0' },
            lastName: { S: 'no data' },
        },
        ProjectionExpression: 'partyID, firstName, lastName',
        ReturnConsumedCapacity: 'TOTAL',
    };

    /* eslint-disable */
    let partyDataPut = {
        FunctionName: 'putParty',
        Payload: JSON.stringify( {
            'firstName': 'testFirstName',
            'lastName': 'testLastName'
        } )
    };
    partyDataPut.Payload = JSON.stringify(testData);
    /* eslint-enable */

    // take results of partyGet and merge with partyDataPut structure
    function prepPartyData(partyPutResult) {
        return new Promise(
            (resolve, reject) => { // eslint-disable-line no-unused-vars
                partyDataGet.Key.partyID =
                    {
                        N: JSON.parse(partyPutResult.Payload).partyID
                    };
                partyDataGet.Key.lastName =
                    {
                        S: testData.lastName
                    };
                resolve(partyDataGet);
            }
        );
    }

    // compare partyDataGet results with expected test results
    function validatePartyData(actualResult) {
        return new Promise(
            (resolve, reject) => { // eslint-disable-line no-unused-vars
                let t = actualResult.Item.firstName.S +
                    ' ' + actualResult.Item.lastName.S;
                expect(t).toBe(expectedResult);
                done();
            }
        );
    }

    partyPut(partyDataPut)
        .then(prepPartyData)
        .then(dynamoPartyGet)
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

