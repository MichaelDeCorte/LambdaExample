const each = require('jest-each');
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
        'func1': func1
    };

    methodRouter(eventObject,
                 contextObject,
                 routerMap)
        .then(
            ({ result, error }) => {
                logger.trace('result: ' + JSON.stringify(result));
                logger.trace('error: ' + error);

                if (error) {
                    let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');
                    expect(e).toEqual(testError.toString());
                    done();
                } else {
                    expect(result.body).toEqual(testResult.body);
                    done();
                }
            })
        .catch(
            (error) => {
                done.fail(error);
                logger.trace('here');
                done();
            });
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('methodRouter unit tests', testFunc);
