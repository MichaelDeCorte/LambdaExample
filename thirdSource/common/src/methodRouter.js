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
    
    logger.debug('methodRouter.js: lambdaProxyIntegration: ' + lambdaProxyIntegration);

    let body = null;
    if (lambdaProxyIntegration) {
        body = JSON.parse(event.body);
    } else {
        body = event;
    }

    logger.debug('methodRouter.js: body: ' + JSON.stringify(body, null, 4));
    
    return new Promise(
        (resolve, reject) => {
            if (!Object.prototype.hasOwnProperty.call(body, 'command')) {
                throw new Error('Service request: No command specified');
            }
            
            logger.debug('methodRouter.js: body.command: ' + String(body.command));

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

            logger.debug('methodRouter.js: lambdaResult:' +
                         JSON.stringify(lambdaResult, null, 4));

            lambdaCallback(
                null, // errorCode
                lambdaResult);
        }
    ).catch(
        (error) => {
            logger.debug('methodRouter.js: error:' + error);

            lambdaCallback(
                '500', // errorCode
                error);
        }
    );
};
