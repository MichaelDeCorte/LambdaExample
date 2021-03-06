// https://github.com/mattphillips/jest-each
// eslint-disable-next-line import/no-extraneous-dependencies
const each = require('jest-each');
const logger = require('common').logger;
const validator = require('../src/getPartyPre');

/* eslint-disable no-const-assign */
function testFunc(input, output, done) {
    let event = input.event;
    let context = input.context;
    let callback = input.callback;
    let expectedResult = output.expectedResult;
    let expectedError = output.expectedError;

    logger.trace('event: '
                 + JSON.stringify(event, null, 4));
    logger.trace('expectedResult: '
                + JSON.stringify(expectedResult, null, 4));
    logger.trace('expectedError: '
                + JSON.stringify(expectedError, null, 4));

    expect.assertions(1);

    try {
        ({ event, context, callback } = validator(event, context, callback));
        expect(event).toEqual(expectedResult);
        done();
    } catch (error) {
        try {
            let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');
            expect(e.toString()).toEqual(expectedError);
            done();
        } catch (e) {
            done.fail(e);
        }
    }
}

// eslint-disable-next-line 
const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));

each(testSuite).test('getPartyPre unit tests ', testFunc);
