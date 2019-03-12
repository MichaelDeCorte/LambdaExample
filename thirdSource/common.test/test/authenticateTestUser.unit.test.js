const logger = require('common').logger;
const authenticateTestUser = require('common.test').authenticateTestUser;

function testFunc(done) {
    return authenticateTestUser()
        .then((result) => {
            logger.debug('result: ' + JSON.stringify(result, null, 4));
            expect(result.getAccessToken().getJwtToken().length).toBeGreaterThan(0);
            done();
        })
        .catch((error) => {
            logger.debug('error: ' + JSON.stringify(error, null, 4));
            done.fail(error);
        });
}

test('authenticateTestUser', testFunc);
