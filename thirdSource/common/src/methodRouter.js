const logger = require('./logger.js').logger;
const Promise = require('promise');

let lambdaProxyIntegration = null;

exports.methodRouter = (event, context, lambdaCallback, map) => {
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

    logger.trace('body: ' + JSON.stringify(body, null, 4));
    
    return new Promise(
        (resolve, reject) => {
            if (!Object.prototype.hasOwnProperty.call(body, 'command')) {
                throw new Error('Service request: No command specified');
            }
            
            logger.trace('body.command: ' + String(body.command));

            if (!Object.prototype.hasOwnProperty.call(map, String(body.command))) {
                throw new Error('Service request: unknown command: '
                                + String(body.command));
            }

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
    ).then(
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
