// https://github.com/mattphillips/jest-each
// eslint-disable-next-line import/no-extraneous-dependencies
const each = require('jest-each');
const logger = require('common').logger;
const validator = require('../src/putPartyPre');

/* eslint-disable no-const-assign */
function testFunc(input, output, done) {
    let event = input.event;
    let context = input.context;
    let callback = input.callback;
    let testResult = output.testResult;
    let testError = output.testError;

    logger.trace('event: '
                 + JSON.stringify(event, null, 4));
    logger.trace('testResult: ' +
                 JSON.stringify(testResult, null, 4));
    logger.trace('testError: ' +
                 JSON.stringify(testError, null, 4));

    expect.assertions(1);

    try {
        ({ event, context, callback } = validator(event, context, callback));
        expect(event).toEqual(testResult);
        done();
    } catch (error) {
        try {
            let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');
            expect(e.toString()).toEqual(testError);
            done();
        } catch (e) {
            done.fail(e);
        }
    }
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('putPartyPre unit tests ', testFunc);
