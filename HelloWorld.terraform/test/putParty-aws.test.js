const each = require('jest-each');
var AWS = require('aws-sdk');

// Initialize AWS credentials
var credentials = new AWS.SharedIniFileCredentials(); 
AWS.config.credentials = credentials;

// AWS Lambda API with default calling parameters
var lambda = new AWS.Lambda();
var params = {
    FunctionName: 'HelloWorld',
    Payload: JSON.stringify( {
        'Tag': 'Data'
    })
};


function testFunc(input, output, done) {
    function lambdaCallback(error, result) {
        if (error) {
            console.log(error, error.stack); // an error occurred
        }
        expect(JSON.parse(result.Payload)).toBe(output);
        done();
    }

    params.Payload = JSON.stringify( 
        input
    );

    lambda.invoke(params, lambdaCallback);
}

const testData = require(__filename.replace(/\.[^\.]+$/, '.json'));

each(testData).test('Hello World Test', testFunc);



