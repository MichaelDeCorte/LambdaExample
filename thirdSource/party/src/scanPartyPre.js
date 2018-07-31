// const logger = require('common').logger;
const Joi = require('joi');
const validator = require('common').validator;

const eventSchema = Joi.object().keys(
    {
        'FilterExpression': Joi.string().required(),
        'ExpressionAttributeValues': Joi.object().required(),
    });

function validateEvent(event, context, callback) {
    return {
        'event': validator(event, eventSchema),
        context,
        callback
    };
}

module.exports = validateEvent;
