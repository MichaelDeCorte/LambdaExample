// const logger = require('common').logger;
const Joi = require('joi');
const validator = require('common').validator;

const alphaSpaceRE = /^[A-Za-z ]*$/;
const eventSchema = Joi.object().keys(
    {
        'lastName': Joi.string().regex(alphaSpaceRE).min(1).max(30).trim().truncate().required(),
        'firstName': Joi.string().regex(alphaSpaceRE).min(1).max(30).trim().truncate().required(),
    });

function validateEvent(event, context, callback) {
    return {
        'event': validator(event, eventSchema),
        context,
        callback
    };
}

module.exports = validateEvent;
