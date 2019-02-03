const each = require('jest-each');
const logger = require('common').logger;
const path = require('path');
const methodRouter = require('../src/methodRouter').methodRouter;

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
    
    /* eslint global-require: "off" */
    let routerMap = {
        'func1': {
            'method': path.join(__dirname, '/../test/methodRouter-mapMethod.js'),
            'pre': [
                path.join(__dirname, '/../test/methodRouter-mapPre.js'),
            ]
        }
    };

    return new Promise(
        (resolve, reject) => {
            methodRouter(eventObject,
                         contextObject,
                         (error, result) => {
                             if (error) {
                                 reject(error);
                             } else {
                                 resolve(result);
                             }
                         },
                         routerMap);
        })
        .then(
            (result) => { 
                logger.debug('result: ' + JSON.stringify(result, null, 4));
                logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
                expect(result.body).toEqual(testResult.body);
                done();
            })
        .catch(
            (error) => {
                logger.trace('error: ' + error);
                let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');

                expect(e).toEqual(testError);
                done();
            }
        )
        .catch( 
            (error) => {
                logger.debug('error: ' + error);
                done.fail(error);
            }
        );
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('methodRouter unit tests', testFunc);
