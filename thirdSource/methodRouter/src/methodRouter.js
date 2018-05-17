// const logger = require('./logger.js').logger;
const logger = require('common').logger;
const validator = require('common').validator;
const packageConfig = require('common').packageConfig;
const Promise = require('promise');
const Joi = require('joi');
const path = require('path');

function loadMethod(fileName) {
    try {
        let paths = {
            'paths': 
            [
                path.join(__dirname, '/../../../src'),
                path.join(__dirname, '../../src'),
            ].concat(module.paths)
        };

        let methodPath = require.resolve(fileName, paths);


        // eslint-disable-next-line 
        let method = require(methodPath);
        return method;
    } catch (error) {
        console.error('MethodRouterNotFound: ' + fileName + ' ' + error);
        throw new Error('MethodRouterNotFound: ' + fileName + ' ' + error);
    }
}

function getMethod(command, map) {
    logger.trace('map[ ' + command + ' ] = ' + JSON.stringify(map[command], null, 4));

    if (!Object.prototype.hasOwnProperty.call(map, String(command))) {
        logger.error('UnknownCommand: ' +  String(command));
        throw new Error('UnknownCommand: ' +  String(command));
    }

    if (map[command].method) {
        map[command].method = loadMethod(map[command].fileName, map);
    }
    let method = map[command].method;

    method = map[command].method || loadMethod(map[command].fileName, map);
    
    if (typeof method !== 'function') {
        logger.error('UnknownMethod: ' + command + ' : '
                     + JSON.stringify(map[command], null, 4));
        throw new Error('UnknownMethod: ' + command + ' : '
                        + JSON.stringify(map[command], null, 4));
    }

    return method;
}

// this will preload all of the methods
// this is required on lambda as aws-sdk fails if the modules
// are lazy loaded.
// don't know why.....
// workaroud is to load aws-sdk early
// function mapInit(map) {
//     return map;

//     // eslint-disable-next-line
//     if (!map) {
//         return null;
//     }
//     Object.keys(map).forEach(
//         (methodKey) => {
//             if (map[methodKey].fileName &&
//                 (typeof map[methodKey].fileName === 'string')) {
//                 map[methodKey].method = loadMethod(map[methodKey].fileName);
//             }
//         }
//     );
//     // eslint-disable-next-line
//     return map;
// }


let functionMap = packageConfig.loadPackageConfig().methodRouter || {};

// functionMap = mapInit(functionMap);

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
    
    return { event, context };
}

// eslint-disable-next-line no-unused-vars
function response(error, result) {
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
        result.body.message = error.toString();
        logger.error(error);
    }

    if (lambdaProxyIntegration) {
        result.body = JSON.stringify(result.body);
    }

    return { 'error': error, 'result': result };
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


function methodRouter(eventArg, contextArg, lambdaCallback, map) {
    logger.trace('eventArg: ' + JSON.stringify(eventArg, null, 4));
    return new Promise(
        (resolve, reject) => {
            map = map || functionMap;

            let { event, context } = entry(eventArg, contextArg);

            event = validator(event, eventSchema);

            // if (map.eventSchema) {
            //     event = validator(event, map.eventSchema);
            // }

            let method = getMethod(event.command, map);

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
            (resultArg) => {
                let { error, result } = response(null, resultArg);
                lambdaCallback(error, result);
            })
        .catch(
            (errorArg) => {
                let { error, result } = response(errorArg, null);
                lambdaCallback(error, result);
            });
}

module.exports.methodRouter = methodRouter;
