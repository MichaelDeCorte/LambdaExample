/* eslint import/no-unresolved: off */
const Joi = require('joi');
const logger = require('./logger.js').logger;

const joiOptions = {
    'abortEarly': false,
    'allowUnknown': true,
};

function validator(data, dataSchema) {
    logger.trace('data:' + data);
    logger.trace('data:' + JSON.stringify(data, null, 4));

    if (!data || !dataSchema) {
        return data;
    }

    const dataValidated = Joi.validate(data, dataSchema, joiOptions);
    if (dataValidated.error) {
        logger.error('dataValidationError:' +
                     JSON.stringify(dataValidated, null, 4));
        throw new Error('DataValidationError: ' + JSON.stringify(dataValidated.value, null, 4));
    } 
    return dataValidated.value;
}

module.exports = validator;
