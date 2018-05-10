// const logger = require('./logger.js').logger;
const logger = require('./logger.js').logger;
const validator = require('./validator.js').validator;
const Promise = require('promise');
const Joi = require('joi');

/* eslint no-param-reassign: off */

let lambdaProxyIntegration;

function entry(event, context) {
    // called from AWS API Gateway
    if (Object.prototype.hasOwnProperty.call(event, 'body')) { 
        event = JSON.parse(event.body);
        lambdaProxyIntegration = true;
    } else {
        lambdaProxyIntegration = false;
    }
    
    logger.trace('lambdaProxyIntegration: ' + lambdaProxyIntegration);
    event.lambdaProxyIntegration = true;
    return { event, context };
}

function command(event, map) {
    if (Object.prototype.hasOwnProperty.call(map, String(event.command))) {
        logger.trace('method: ' + map[String(event.command)]);
        return map[String(event.command)];
    } 

    logger.trace('UnknownCommand: ' +  String(event.command));
    throw new Error('UnknownCommand: ' +  String(event.command));
}

function response(result, error) {
    logger.trace('result: ' + JSON.stringify(result, null, 4) +
                 '\nerror: ' + error);
    
    if (!result) {
        result = {
            'statusCode': null,
            'isBase64Encoded': false,
            'headers': {
                'Content-Type': '*/*'
            },
            'body': {
            }
        };
    }

    if (error) {
        result.statusCode = 500;
        result.body.message = error;
        logger.error(error);
    }

    if (lambdaProxyIntegration) {
        result.body = JSON.stringify(result.body);
    }

    return { result, error };
}

const eventSchema = Joi.object().keys(
    {
        'command': Joi
            .string()
            .regex(/^[A-Za-z0-9-_]*$/)
            .min(1)
            .max(15)
            .required(),
    });

exports.methodRouter = (eventArg, contextArg, map) => {
    return new Promise(
        (resolve, reject) => {
            let { event, context } = entry(eventArg, contextArg);

            event = validator(event, eventSchema);

            if (map.eventSchema) {
                event = validator(event, map.eventSchema);
            }

            let method = command(event, map);

            method(event,
                   context,
                   (error, result) => {
                       if (error) {
                           reject(error);
                       } else {
                           resolve(result);
                       }
                   });
        })
        .then(
            (result) => {
                return response(result, null);
            })
        .catch(
            (error) => {
                logger.trace('1');
                return response(null, error);
            });
};
