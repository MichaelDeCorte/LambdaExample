/* eslint global-require: "off" */

module.exports = {
    'logger': require('./logger').logger,
    'generateGUID': require('./guid').generateGUID,
    'methodRouter': require('./methodRouter').methodRouter,
};
