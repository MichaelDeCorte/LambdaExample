/* eslint import/no-unresolved: off */

const logger = require('./logger.js').logger;

function environment(data) {
    if (!data || !process.env.ENVIRONMENT) {
        return data;
    }

    // eslint-disable-next-line no-param-reassign
    data.TableName =  process.env.ENVIRONMENT + '_' + data.TableName;

    logger.trace('dynamoEnvironment:' + JSON.stringify(data, null, 4));
    return data;
}

module.exports = environment;
