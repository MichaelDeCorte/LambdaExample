const packageConfig = require('../src/packageConfig.js');

// returns the package.json object or if not already loaded, load the
// package.json found at 'path', saves it, and returns it

// based upon the package.json config
// returns the configured logLevel for this item
function getConfiguredLogLevel(config, name, subpath) {
    /* eslint no-cond-assign: off */
    let t;
    let configuredLogLevel;
    
    if (process.env.LOG_LEVEL) {
        configuredLogLevel = process.env.LOG_LEVEL;
    } else if ('logger' in config) {
        if ((t = '[' + name + ']' + subpath) in config.logger) {
            configuredLogLevel = config.logger[t];
        } else if ((t = '[' + name + ']') in config.logger) {
            configuredLogLevel = config.logger[t];
        } else if ('default' in config.logger) {
            configuredLogLevel = config.logger.default;
        }
    } else if (configuredLogLevel === 'false') {
        configuredLogLevel = false;  // set to the boolean and not the string
    }
    return configuredLogLevel;
}

// based upon the current stack trace
// finds the caller to the logger and
// returns the current location object for this caller line 
// NOTE: logOutput is not returned and should be set 
//
// location: {
//     "root":          "/Users/mdecorte/thirdSource/common",
//     "name":          "common",
//     "errSubpath":    "src/guid.js:14:12",
//     "subpath":        "src/guid.js",         -- not actually stored
//     "configuredLogLevel": "trace",
//     "logOutput":     "09:12:39.0320 May 01 [trace] [common]src/guid.js:14:12 "log something"
// }
let logMap = {};

function loggerLocation() {
    const err = new Error();
    const errStack = err.stack;
    let errStackLine = 4;
    const errLineFull = errStack.split('\n')[errStackLine];  
    const logLine = errLineFull.slice(errLineFull.indexOf('/'), errLineFull.indexOf(':'));

    let location;
    let moduleName;        
    let moduleRoot;        

    // pull location object from map
    // or create location object and put it in map
    if (logLine in logMap) {  
        location = logMap[logLine];
    } else {
        moduleRoot = packageConfig.getModuleRoot(logLine);
        moduleName = moduleRoot.split(/[/\\]/).pop();

        location = {
            'root': moduleRoot,
            'name': moduleName,
        };
    }
    
    let errSubpath = errLineFull.slice(errLineFull.search(location.root) +
                                            location.root.length + 1, errLineFull.length - 1);
    let subpath = errSubpath.slice(0, errSubpath.indexOf(':'));
    let config = packageConfig.loadPackageConfig();

    if (!(logLine in logMap)) {
        location.configuredLogLevel = getConfiguredLogLevel(config,
                                                            location.name,
                                                            subpath);

        logMap[logLine] = location;
    }

    location.errSubpath = errSubpath;
    
    return location;
}

// formatted time
function loggerTime() {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2) + '.' +
        ('0000' + date.getMilliseconds()).slice(-4) + ' ' +
        months[date.getMonth()] + ' ' +
        ('00' + date.getDate()).slice(-2);
}

// formatted logline
function formatLogOutput(...args) {
    const logLevel = args[0];
    args.shift();

    let location = loggerLocation();
    location.logOutput =
        loggerTime() 
        + ' [' + logLevel + '] '
        + '[' + location.name + ']'
        + location.errSubpath
        + ' "' + args + '"';

    return location;
}

// creates logging methods for this modules, one for each log level
// ['error', 'warn', 'info', 'debug', 'trace']
function LogDriver() {
    let logger = this; // the logging methods will be created under "logger"
    this.levels = ['error', 'warn', 'info', 'debug', 'trace'];
    this.levels.forEach(
        (logLevel) => {
            logger[logLevel] = // created the the logging methods under "logger"
                (...args) => {
                    let location = formatLogOutput(logLevel, args);

                    if (this.levels.indexOf(logLevel) <=
                        this.levels.indexOf(location.configuredLogLevel)) {
                        // use stdout.write for aws
                        // and console.log outside of aws
                        // as jest redefines console.log
                        if ((process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV)) {
                            console.log(location.logOutput);
                        } else {
                            process.stdout.write(location.logOutput + '\n');
                        }
                    }
                };
        });
}

let factory = () => {
    // the logging methods will be created under "logger"  e.g. factory.logger.warn
    factory.logger = new LogDriver();  
    return factory.logger;
};

factory();

module.exports = factory;
