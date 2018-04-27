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

function testFunc(input, output, done) {
    expect.assertions(1);

    let eventObject = input.eventObject;
    let contextObject = input.contextObject;
    let testResult = output.testResult;
    let testError = output.testError;
    
    logger.trace('eventObject: ' + JSON.stringify(eventObject, null, 4));
    logger.trace('contextObject: ' + JSON.stringify(contextObject, null, 4));
    logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
    logger.trace('testError: ' + JSON.stringify(testError, null, 4));
    
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
            expect(error.toString()).toEqual(testError.toString());
            done();
        }
    ).catch(
        (error) => {
            done.fail(error);
        }
    );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('methodRouter unit tests', testFunc);
