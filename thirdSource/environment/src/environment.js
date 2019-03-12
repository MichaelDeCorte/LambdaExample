let environmentConfig = [];

function environment(env) {
    let environmentFile;

    if (typeof env === 'undefined' || env === null) {
        // eslint-disable-next-line no-param-reassign
        env = process.env.ENVIRONMENT;
    }

    if (typeof env === 'undefined' || env === null) {
        throw new Error('env and ENVIRONMENT not defined');
    }

    if (typeof environmentConfig[env] === 'undefined') {
        try {
            environmentFile = './environment.' + env + '.json';

            // eslint-disable-next-line global-require, import/no-dynamic-require
            environmentConfig[env] = require(environmentFile);
        } catch (error) {
            throw error;
        }
    }

    return environmentConfig[env];
}

module.exports = environment;
