
// load aws-sdk early as it fails to load properly if lazy loaded during method
// loading
// no idea why
//
// eslint-disable-next-line no-unused-vars
const AWS = require('aws-sdk');

module.exports.handler = require('methodRouter').methodRouter;
