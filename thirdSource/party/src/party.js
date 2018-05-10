const logger = require('common').logger;
const methodRouter = require('common').methodRouter;
const Joi = require('joi');

const eventSchema = Joi.object().keys(
    {
        'command': Joi.string().regex(/^[A-Za-z0-9-_]*$/).min(1).max(15).required(),
        'partyID': Joi.number(),
        'firstName': Joi.string().regex(/^[A-Za-z ]*$/).min(1).max(30).trim().truncate(),
        'lastName': Joi.string().regex(/^[A-Za-z ]*$/).min(1).max(30).trim().truncate(),
    });


/* eslint global-require: "off" */
let partyMap = {
    'eventSchema': eventSchema,

    'getParty': require('./getParty').handler,
    'putParty': require('./putParty').handler,
};

exports.handler = (event, context, lambdaCallback) => {
    logger.trace('event: ' + JSON.stringify(event, null, 4));
    logger.trace('context: ' + JSON.stringify(context, null, 4));

    methodRouter(event, context, partyMap)
        .then(
            ({ result, error }) => {
                lambdaCallback(error, result);
            }
        )
        .catch(
            (error) => {
                logger.error(error);
                lambdaCallback(error, null);
            });
};
