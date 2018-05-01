const guid = require('common').generateGUID;
const logger = require('../src/logger.js').logger;

test('generateGUID', () => {
    let g = guid(12345678);

    logger.debug('g: ' + g);
    
    expect(guid(12345678)).toBeGreaterThan(0);
});
