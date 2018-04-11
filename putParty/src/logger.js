const winston = require('winston');

// error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5

/* eslint-disable */

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const logger = new (winston.Logger)(
    {
        transports: [
            new (winston.transports.Console)({
                timestamp: function() {
                    const d = new Date();
                    return months[d.getMonth()] + ' ' + d.getDate() + ' ' +
                        d.getHours() + ':' + d.getMinutes() + ':' +
                        d.getSeconds() + ':' + d.getMilliseconds();
                },
                formatter: function(options) {
                    // - Return string will be passed to logger.
                    //   colorize output based on the log level.
                    return options.timestamp() + ' ' +
                        (options.message ? options.message : '') +
                        (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                }
            })
        ]
    }
);

// exports.logger = winston;
exports.logger = logger;
exports.logger.level = process.env.LOG_LEVEL;
