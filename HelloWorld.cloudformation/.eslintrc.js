module.exports = {
    extends: [
        'airbnb-base',
        'plugin:jest/recommended',
    ],
    plugins: [
        'import',
        'jest',
    ],
    rules: {
        'indent': ["error", 4],
        'no-console': 'off'
    },
    env: {
        node: true,
        'jest/globals': true,
    },
};
