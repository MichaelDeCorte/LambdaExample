const winston = require('winston');

// error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5

/* eslint-disable */

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function tsFormat(){
    const d = new Date();
    return months[d.getMonth()] + ' ' + d.getDate() + ' ' +
        d.getHours() + ':' + d.getMinutes() + ':' +
        d.getSeconds() + ':' + d.getMilliseconds();
}

// const logger = winston;

const logger = new (winston.Logger)(
    {
        transports: [
            new (winston.transports.Console)({
                timestamp: tsFormat,
            })
        ]
    }
);

// exports.logger = winston;
exports.logger = logger;
exports.logger.level = process.env.LOG_LEVEL;
