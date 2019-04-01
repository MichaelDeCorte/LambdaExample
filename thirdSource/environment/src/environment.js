let environmentConfig = [];

function environment(env) {
    let environmentFile;

    // which env to choose from.  e.g. dev, qa, prod
    if (typeof env === 'undefined' || env === null) {
        // eslint-disable-next-line no-param-reassign
        env = process.env.ENVIRONMENT;
    }

    if (typeof env === 'undefined' || env === null) {
        throw new Error('env and ENVIRONMENT not defined');
    }

    // load the config file if not already loaded
    if (typeof environmentConfig[env] === 'undefined') {
        try {
            environmentFile = './environment.' + env + '.json';

            // eslint-disable-next-line global-require, import/no-dynamic-require
            environmentConfig[env] = require(environmentFile);

            // fully qualify the endpoints
            // eslint-disable-next-line no-restricted-syntax
            for (const key in environmentConfig[env].apiEndPoints) {
                // eslint-disable-next-line max-len
                if (Object.prototype.hasOwnProperty.call(environmentConfig[env].apiEndPoints, key)) {
                    environmentConfig[env].apiEndPoints[key].endpoint =
                        environmentConfig[env].apiInvokeUrl +
                        environmentConfig[env].apiEndPoints[key].endpoint;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    return environmentConfig[env];
}

module.exports = environment;
