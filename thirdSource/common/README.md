Very light weight logger with fine grained logging levels. Default
logging levels as well as distinct levels for each module and/or JS
file.

This logger was driven by the desire for a very lightweight logger for
AWS lambda with configurable logging levels.
 
Usage: 
    const logger = require('./logger.js').logger;

    logger.error('log message' + variableToLog);

    valid log levels in priority: false, 'error', 'warn', 'info', 'debug', 'trace'

Configuration:
    In the package.json closest to root define a logger section.

    Syntax:

        to define a logging default level
        "default": log-level 
            e.g. "default": "warn"

        to define a logging level for a specific module
        [module]: log-level
            e.g. "[common]": "error"

        to define a logging level for a specific file in a module
        [module]filepath: log-level
            e.g. "[common]src/logger.js": "info"

    e.g.        
    "logger": {
       "default": "false",
       "[common]src/guid.js": "error",
       "[party]": "warn"
     },

    Priority:
        LOG_LEVEL environment variable overrides the configuration file
        [module]filepath
        [module]
        default

Parts of this code were inspired by log-driver.
https://www.npmjs.com/package/log-driver