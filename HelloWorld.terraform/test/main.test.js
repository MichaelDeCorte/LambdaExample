// https://github.com/mattphillips/jest-each

const hello = require('main').handler;
const each = require('jest-each');

function testFunc(input, output, done) {
    function callbackFunc(error, result) {
        expect(result).toBe(output);
        done();
    }

    var event = {
        message: input
    };
    hello(event, null, callbackFunc);
}

const testData=[
    ['Hello World 1', 'Lambda, Hello World 1'],
    ['Hello World 2', 'Lambda, Hello World 2'],
    ['Good Bye', 'Lambda, Good Bye']
];

each(testData).test('Hello World Test', testFunc);

