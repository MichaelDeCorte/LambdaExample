const logger = require('./logger.js').logger;
const Promise = require('promise');
const Joi = require('joi');

const eventSchema = Joi.object().keys(
    {
        'command': Joi
            .string()
            .regex(/^[A-Za-z0-9-_]*$/)
            .min(1)
            .max(15)
            .required(),
    });

const joiOptions = {
    'abortEarly': false,
    'allowUnknown': true,
};


let lambdaProxyIntegration = null;

/* eslint no-prototype-builtins: "off" */
exports.methodRouter = (event, context, lambdaCallback, map) => {
    function validateEvent(data) {
        return new Promise(
            (resolve, reject) => {
                const dataValidated = Joi.validate(data, eventSchema, joiOptions);
                logger.trace('dataValidated:' + JSON.stringify(dataValidated, null, 4));
                if (dataValidated.error) {
                    logger.error('InvalidCommand: ' + JSON.stringify(dataValidated, null, 4));
                    reject(new Error('InvalidCommand'));
                } else if (!map.hasOwnProperty(String(dataValidated.value.command))) {
                    logger.error('UnknownCommand: ' + String(dataValidated.value.command));
                    throw new Error('UnknownCommand');
                } else {
                    resolve(dataValidated.value);
                }
            }
        );
    }

    function invokeMethod(body) {
        logger.trace('body: ' + JSON.stringify(body, null, 4));

        return new Promise(
            (resolve, reject) => {
                let method = map[String(body.command)];

                method(body,
                       context,
                       (error, result) => {
                           if (error) {
                               reject(error);
                           } else {
                               resolve(result);
                           }
                       });
            }
        );
    }

    // called from AWS API Gateway
    if (Object.prototype.hasOwnProperty.call(event, 'body')) { 
        lambdaProxyIntegration = true;
    } else {
        lambdaProxyIntegration = false;
    }
    
    logger.trace('lambdaProxyIntegration: ' + lambdaProxyIntegration);

    let body = null;
    if (lambdaProxyIntegration) {
        body = JSON.parse(event.body);
    } else {
        body = event;
    }

    validateEvent(body)
        .then(invokeMethod)
        .then(
            (lambdaResult) => {
                if (lambdaProxyIntegration) {
                    // eslint-disable-next-line no-param-reassign
                    lambdaResult.body = JSON.stringify(lambdaResult.body);
                }

                logger.trace('lambdaResult:' +
                             JSON.stringify(lambdaResult, null, 4));

                lambdaCallback(
                    null, // errorCode
                    lambdaResult);
            }
        ).catch(
            (error) => {
                logger.warn('Error: ' + JSON.stringify(error, null, 4));

                // lambdaCallback(
                //     '500', // errorCode
                //     error);
                lambdaCallback(
                    error,
                    null);
            }
        );
};
