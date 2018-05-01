const fs = require('fs');

// returns the package.json object
// or if not already loaded, load the package.json found at 'path', saves it, and returns it
let packageConfig = {};

function loadPackageConfig(path) {
    if (Object.keys(packageConfig).length === 0) {
        // eslint-disable-next-line
        packageConfig = require(path + '/package.json');
    }
    return packageConfig;
}

// returns the parent path to path that has a package.json
// throws an error if none found
function getPackageRoot(path) {
    let pathArray = path.split(/[/\\]/);
    let packageRoot;

    while (pathArray.length) {
        pathArray.pop();
        packageRoot = pathArray.join('/');
        if (fs.existsSync(packageRoot + '/package.json')) {
            return packageRoot;
        }
    }
    throw new Error('package.json not found. ' + path);
}

// based upon the package.json config
// returns the configured logLevel for this item
function getConfiguredLogLevel(config, name, subline) {
    /* eslint no-cond-assign: off */
    let t;
    let configuredLogLevel;
    
    if (process.env.LOG_LEVEL) {
        configuredLogLevel = process.env.LOG_LEVEL;
    } else if ('logger' in config) {
        if ((t = '[' + name + ']' + subline) in config.logger) {
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
//     "errSubline":    "src/guid.js:14:12",
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
    let packageName;        
    let packageRoot;        

    // pull location object from map
    // or create location object and put it in map
    if (logLine in logMap) {  
        location = logMap[logLine];
    } else {
        packageRoot = getPackageRoot(logLine);
        packageName = packageRoot.split(/[/\\]/).pop();

        location = {
            'root': packageRoot,
            'name': packageName,
        };
    }
    
    let config = loadPackageConfig(location.root);
    
    let errSubline = errLineFull.slice(errLineFull.search(location.root) +
                                            location.root.length + 1, errLineFull.length - 1);
    let subline = errSubline.slice(0, errSubline.indexOf(':'));

    if (!(logLine in logMap)) {
        location.configuredLogLevel = getConfiguredLogLevel(config, location.name, subline);

        logMap[logLine] = location;
    }

    location.errSubline = errSubline;
    
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
    // console.log('location: ' + JSON.stringify(location, null,4));
    location.logOutput =
        loggerTime() 
        + ' [' + logLevel + '] '
        + '[' + location.name + ']'
        + location.errSubline
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
                        process.stderr.write(location.logOutput + '\n');  // use stderr.write instead of console.log as jest redefines console.log
                    }
                };
        });
}

let factory = () => {
    let dir = __dirname;
    try {
        while (dir = getPackageRoot(dir));
    } catch (err) {
        // do nothing
    }

    packageConfig = loadPackageConfig(dir);

    // the logging methods will be created under "logger"  e.g. factory.logger.warn
    factory.logger = new LogDriver();  
    return factory.logger;
};

factory();

module.exports = factory;
