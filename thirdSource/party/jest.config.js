// require as jest does not support the options in require.resolve(path, options)
// which is used in methodRouter
module.exports= {
    "moduleDirectories": [
        "node_modules",
        "../../../src",
        "../../src",
    ]
};                         
