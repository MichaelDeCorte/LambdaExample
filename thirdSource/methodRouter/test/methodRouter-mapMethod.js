let resultObject = {
    'statusCode': 200,
    'isBase64Encoded': false,
    'headers': {
        'Content-Type': '*/*'
    },
    'body': {
        'message': 'message',
    }
};

function func1(event, context, callback) {
    resultObject.body.message = 'func1 called';
        
    callback(
        null,
        resultObject
    );
}
module.exports = func1;
