const each = require('jest-each');
const logger = require('common').logger;
const testUser = require('common.test').testUser;


function testFunc(input, output, done) {
    expect.assertions(1);

    let data = input.data;
    let testResult = output.testResult;
    let testError = output.testError;
    
    logger.trace('data: ' + JSON.stringify(data, null, 4));
    logger.trace('testResult: ' + JSON.stringify(testResult, null, 4));
    logger.trace('testError: ' + JSON.stringify(testError, null, 4));
    
    process.env.TESTUSER = 'dev';

    try {
        try {
            data = testUser(data);
            let d = data.Username.replace(/(^[^.]+).*$/m, '$1');
            expect(d).toEqual(testResult);
            done();
        } catch (error) {
            logger.trace('test error: ' + error);
            let e = error.toString(); // .replace(/(^Error: [^ :]+)[^]*$/m, '$1');

            expect(e).toEqual(testError);
            done();
        }
    } catch (e) {
        done.fail(e);
    }
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('testUser unit tests', testFunc);
