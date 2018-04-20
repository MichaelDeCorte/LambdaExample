// error', 'warn', 'info', 'debug', and 'trace'

const logger = require('log-driver')({ 'level': process.env.LOG_LEVEL });

exports.logger = logger;
