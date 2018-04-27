const each = require('jest-each');
const Promise = require('promise');
const methodRouter = require('common').methodRouter;
const logger = require('common').logger;

let resultObject = {
    'statusCode': 200,
    'isBase64Encoded': false,
    'headers': {
        'Content-Type': '*/*'
    },
    'body': {
        'message': 'message',
    }
};

function testFunc(eventObject, contextObject, testResult, testError, done) {
    expect.assertions(1);

    function func1(event, context, callback) {
        resultObject.body.message = 'func1 called';
        
        callback(
            null,
            resultObject
        );
    }

    let routerMap = {
        'func1': func1,
    };

    return new Promise(
        (resolve, reject) => {
            return methodRouter(eventObject,
                                contextObject,
                                (error, result) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(result);
                                    }
                                },
                                routerMap);
        }
    ).then(
        (result) => { 
            logger.debug('result: ' + JSON.stringify(result));
            expect(result.body).toEqual(testResult.body);
            done();
        }
    ).catch(
        (error) => {
            logger.debug('Error: ' + error);
            expect(error.toString()).toEqual(testError.error.toString());
            done();
        }
    ).catch(
        (error) => {
            done.fail(error);
        }
    );
}

// eslint-disable-next-line 
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

each(testData).test('methodRouter unit tests', testFunc);
