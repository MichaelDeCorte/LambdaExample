/* eslint global-require: "off" */

module.exports = {
    'getAuthorizationToken': require('./authenticateTestUser').getAuthorizationToken,
    'authenticateTestUser': require('./authenticateTestUser').authenticateTestUser,
};
