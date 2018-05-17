const each = require('jest-each');
const packageConfig = require('../src/packageConfig.js');

function testFunc(test, done) {
    try {
        let dir = packageConfig.getModuleRoot(test.input.dir);
        expect(dir).toEqual(test.output.dir);
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
                'dir': __dirname.replace(/(^.*)\/[^/]*$/, '$1'),
                'error': null
            }
        }
    ],
    [
        {
            'description': 'package.json not found',
            'input': {
                'dir': '/var/log/'
            },
            'output': {
                'dir': null,
                'error': 'Error: PackageNotFound'
            }
        }
    ]
    
];

each(testSuite).test('modulePackage unit tests', testFunc);
