console.log('hello world');

exports.handler = (event, context, callback) => {
    callback(null, 'Hello from Lambda!!!');
};

