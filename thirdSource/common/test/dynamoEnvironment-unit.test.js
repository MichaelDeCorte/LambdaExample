const each = require('jest-each');
const logger = require('common').logger;
const dynamoEnvironment = require('common').dynamoEnvironment;


function testFunc(input, output, done) {
    expect.assertions(1);

    let data = input.data;
    let testResult = output.testResult;
    let testError = output.testError;
    
    logger.trace('data: ' + JSON.stringify(data, null, 4));
    logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
    logger.trace('testError: ' + JSON.stringify(testError, null, 4));
    
    try {
        try {
            data = dynamoEnvironment(data);
            expect(data).toEqual(testResult);
            done();
        } catch (error) {
            logger.trace('error: ' + error);
            let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');

            expect(e).toEqual(testError);
            done();
        }
    } catch (e) {
        done.fail(e);
    }
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('dynamoEnvironment unit tests', testFunc);
