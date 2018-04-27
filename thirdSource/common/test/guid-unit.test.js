const guid = require('common').generateGUID;


test('generateGUID', () => {
    expect(guid(12345678)).toBeGreaterThan(0);
});
