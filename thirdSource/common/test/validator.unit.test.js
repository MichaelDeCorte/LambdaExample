const each = require('jest-each');
const Joi = require('joi');
const validator = require('../src/validator');
const logger = require('common').logger;

const alphaSpaceRE = /^[A-Za-z ]*$/;
const schema = Joi.object().keys(
    {
        'lastName': Joi.string().regex(alphaSpaceRE).min(1).max(30).trim().truncate().required(),
        'firstName': Joi.string().regex(alphaSpaceRE).min(1).max(30).trim().truncate().required(),
    });

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
            data = validator(data, schema);
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

each(testSuite).test('methodRouter unit tests', testFunc);
