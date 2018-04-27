const logger = require('common').logger;
const methodRouter = require('common').methodRouter;

/* eslint global-require: "off" */
let routerMap = {
    'getParty': require('./getParty').handler,
    'putParty': require('./putParty').handler,
};

exports.handler = (event, context, lambdaCallback) => {
    logger.trace('event: ' + JSON.stringify(event, null, 4));
    logger.trace('context: ' + JSON.stringify(context, null, 4));
    
    return methodRouter(event,
                        context,
                        lambdaCallback,
                        routerMap);
};
