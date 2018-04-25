const logger = require('common').logger;
const methodRouter = require('common').methodRouter;

/* eslint global-require: "off" */
let routerMap = {
    'putParty': require('./putParty').handler,
};

exports.handler = (event, context, lambdaCallback) => {
    logger.debug('party.js: event: ' + JSON.stringify(event, null, 4));
    logger.debug('party.js: context: ' + JSON.stringify(context, null, 4));
    
    return methodRouter(event,
                        context,
                        lambdaCallback,
                        routerMap);
};
