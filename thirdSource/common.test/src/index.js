/* eslint global-require: "off" */

module.exports = {
    'getAuthorizationToken': require('./authenticateTestUser').getAuthorizationToken,
    'authenticateTestUser': require('./authenticateTestUser.js').authenticateTestUser,
    'testUser': require('./testUser')
};
