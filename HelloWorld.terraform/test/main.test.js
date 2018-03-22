const hello = require('main').handler;

function testFunc(done) {
    function callback(error, result) {
        expect(result).toBe('Hello from Lambda!!!');
        done();
    }

    hello(null, null, callback);
}

test('Hello World Test', testFunc);

