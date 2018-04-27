// error', 'warn', 'info', 'debug', and 'trace'

const logger = require('log-driver')(
    {
        'level': process.env.LOG_LEVEL,
        'format': function format(...args) {
            function location() {
                const err = new Error();
                const callerLine = err.stack.split('\n')[4];
                const index = callerLine.lastIndexOf('/') + 1;
                return callerLine.slice(index, callerLine.length - 1);
            }

            function time() {
                const date = new Date();

                return date.getFullYear() + '-' +
                    ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('00' + date.getDate()).slice(-2) + ' ' +
                    ('00' + date.getHours()).slice(-2) + ':' +
                    ('00' + date.getMinutes()).slice(-2) + ':' +
                    ('00' + date.getSeconds()).slice(-2) + ':' +
                    ('0000' + date.getMilliseconds()).slice(-4) + ' ';
            }
            
            const level = args[0];
            args.shift();
            return '[' + level + '] "' + time() + ' .../' + location() + '" ' + args;
        }
    }
);

exports.logger = logger;

// log-driver default format
//    [debug] "2018-04-26T16:13:51.894Z"  'log someting'
