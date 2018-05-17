const each = require('jest-each');
const packageConfig = require('../src/packageConfig.js');

function testFunc(test, done) {
    try {
        let config = packageConfig.loadModuleConfig();
        expect(config.name).toEqual(test.output.name);
        done();
    } catch (error) {
        if (test.output.error) {
            let e = error.toString().replace(/(^Error: [^ :]+)[^]*$/m, '$1');
            expect(e).toEqual(test.output.error);
            done();
        } else {
            done.fail(error);
        }
    } 
}

// eslint-disable-next-line 
// const testSuite = require(__filename.replace(/.[^.]+$/, '.json'));
const testSuite = [
    [
        {
            'description': 'basic functionality',
            'input': {
                'dir': __dirname
            },
            'output': {
                'name': 'common',
                'error': null
            }
        }
    ]
];

each(testSuite).test('modulePackage unit tests', testFunc);
