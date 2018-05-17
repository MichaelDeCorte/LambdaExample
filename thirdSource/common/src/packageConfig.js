const fs = require('fs');

let configMap = {};

// returns the parent path to path that has a package.json
// throws an error if none found
function getModuleRoot(path) {
    if (!(path in configMap)) {
        configMap[path] = {};
    }

    if (configMap[path].moduleRoot) {
        return configMap[path].moduleRoot;
    }

    let pathArray = path.split(/[/\\]/);
    let moduleRoot;

    while (pathArray.length) {
        pathArray.pop();
        moduleRoot = pathArray.join('/');
        if (fs.existsSync(moduleRoot + '/package.json')) {
            configMap[path].moduleRoot = moduleRoot;
            return moduleRoot;
        }
    }
    throw new Error('PackageNotFound: ' + path);
}

function getPackageRoot(path) {
    let dir = path;
    // keep looking for a package.json until the top one is found
    try {
        /* eslint no-cond-assign: off  */
        while (dir = getModuleRoot(dir));
    } catch (error) {
        // do nothing
        if (dir === path) {
            throw new Error('PackageNotFound: ' + path);
        }
    }
    return dir;
}

// returns the package.json object or if not already loaded, load the
// package.json found at 'path', saves it, and returns it
function loadModuleConfig(path) {
    if (!path) {
        // eslint-disable-next-line no-param-reassign
        path = __dirname;
    }

    if (!(path in configMap)) {
        configMap[path] = {};
    }

    if ((configMap[path].moduleConfig)) {
        return configMap[path].moduleConfig;
    }

    // eslint-disable-next-line 
    configMap[path].moduleConfig = require(getModuleRoot(path) + '/package.json');
    
    return configMap[path].moduleConfig;
}

// returns the package.json object or if not already loaded, load the
// package.json found at 'path', saves it, and returns it
function loadPackageConfig(path) {
    if (!path) {
        // eslint-disable-next-line no-param-reassign
        path = __dirname;
    }

    if (!(path in configMap)) {
        configMap[path] = {};
    }

    if (configMap[path].packageConfig) {
        return configMap[path].packageConfig;
    }

    // eslint-disable-next-line 
    configMap[path].packageConfig = require(getPackageRoot(path) + '/package.json');

    return configMap[path].packageConfig;
}

module.exports.getModuleRoot = getModuleRoot;
module.exports.loadModuleConfig = loadModuleConfig;

module.exports.getPackageRoot = getPackageRoot;
module.exports.loadPackageConfig = loadPackageConfig;
