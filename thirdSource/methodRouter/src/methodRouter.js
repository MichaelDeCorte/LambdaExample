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

function initMap(command, map) {
    logger.trace('map[ ' + command + ' ] = ' + JSON.stringify(map[command], null, 4));
    
    if (!map[command]) {
        logger.error('UnknownCommand: ' +  String(command));
        throw new Error('UnknownCommand: ' +  String(command));
    }

    // init 'method'
    // replace map property string with method
    if (typeof map[command].method === 'string') {
        map[command].method = loadMethod(map[command].method);
    }

    let method = map[command].method;
    
    if (typeof method !== 'function') {
        logger.error('UnknownMethod: ' + command + ' : '
                     + JSON.stringify(map[command], null, 4));
        throw new Error('UnknownMethod: ' + command + ' : '
                        + JSON.stringify(map[command], null, 4));
    }

    // init 'pre' and 'post'
    ['pre', 'post'].forEach(
        (property) => {
            if (!Array.isArray(map[command][property])) {
                map[command][property] = [];
            }

            for (let i = map[command][property].length - 1; i >= 0; i--) {
                if (typeof map[command][property][i] === 'string') {
                    map[command][property][i] = loadMethod(map[command][property][i]);
                }
            }
        }
    );

    return map;
}

let functionMap = packageConfig.loadPackageConfig().methodRouter || {};

/* eslint no-param-reassign: off */
let lambdaProxyIntegration;

function apiGatewayPre(event, context, callback) {
    // called from AWS API Gateway
    if (Object.prototype.hasOwnProperty.call(event, 'body')) { 
        event = JSON.parse(event.body);
        lambdaProxyIntegration = true;
    } else {
        lambdaProxyIntegration = false;
    }
    return { event, context, callback };
}

function validateArgsPre(event, context, callback) {
    const eventSchema = Joi.object().keys(
        {
            'command': Joi
                .string()
                .regex(/^[A-Za-z0-9-_]*$/)
                .min(1)
                .max(15)
                .required(),
        });
    event = validator(event, eventSchema);
    return { event, context, callback };
}


// eslint-disable-next-line no-unused-vars
function lambdaPost(error, result) {
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

    return { error, result };
}

// eslint-disable-next-line no-unused-vars
function apiGatewayPost(error, result) {
    if (lambdaProxyIntegration) {
        result.body = JSON.stringify(result.body);
    }

    return { error, result };
}


function methodRouter(event, context, callback, map) {
    logger.trace('event: ' + JSON.stringify(event, null, 4));
    return new Promise(
        (resolve, reject) => {
            map = map || functionMap;

            if (!(map.pre instanceof Array))
                map.pre = [];

            if (!(map.post instanceof Array))
                map.post = [];

            if (map.pre[0] !== apiGatewayPre) {
                map.pre.unshift(validateArgsPre);
                map.pre.unshift(apiGatewayPre);
                map.post.unshift(apiGatewayPost);
                map.post.unshift(lambdaPost);
            }

            map.pre.forEach(
                (func) => {
                    ({ event, context, callback } 
                     = func(event, context, callback));
                }
            );
            
            map = initMap(event.command, map);

            map[event.command].pre.forEach(
                (func) => {
                    ({ event, context, callback } 
                     = func(event, context, callback));
                }
            );
            
            map[event.command].method(event,
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
                let error = null;
                map[event.command].post.forEach(
                    (func) => {
                        ({ event, context, callback } 
                         = func(event, context, callback));
                    }
                );
            
                map.post.forEach(
                    (func) => {
                        ({ error, result }
                         = func(error, result));
                    }
                );
                
                callback(error, result);
            })
        .catch(
            (error) => {
                let result = null;
                // don't run the method level post functions for errors
                map.post.forEach(
                    (func) => {
                        ({ error, result }
                         = func(error, result));
                    }
                );
                
                callback(error, result);
            });
}

module.exports.methodRouter = methodRouter;
