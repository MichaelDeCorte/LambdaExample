// require as jest does not support the options in require.resolve(path, options)
// which is used in methodRouter
module.exports= {
    "moduleDirectories": [
        "../../../src",
        "../../src",
    ].concat(module.paths)
};                         
