/* eslint global-require: "off" */

module.exports = {
    'logger': require('./logger').logger,
    'generateGUID': require('./guid'),
    'validator': require('./validator'),
    'packageConfig': require('./packageConfig'),
};
