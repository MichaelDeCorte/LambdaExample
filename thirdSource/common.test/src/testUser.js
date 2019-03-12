const logger = require('common').logger;

let testUserConfig = [];

function testUser(env) {
    let testUserFile;

    if (typeof env === 'undefined' || env === null) {
        // eslint-disable-next-line no-param-reassign
        env = process.env.ENVIRONMENT;
    }

    logger.trace('env: ' + env);

    if (typeof env === 'undefined' || env === null) {
        throw new Error('env and ENVIRONMENT not defined');
    }

    if (typeof testUserConfig[env] === 'undefined') {
        try {
            testUserFile = './testUser.' + env + '.json';

            // eslint-disable-next-line global-require, import/no-dynamic-require
            testUserConfig[env] = require(testUserFile);
        } catch (error) {
            throw error;
        }
    }

    logger.trace('testUserConfig[' + env + ']: ' + testUserConfig[env]);

    return testUserConfig[env];
}

module.exports = testUser;
