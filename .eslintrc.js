module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'space-before-function-paren': 0,
        'not-tabs': 'off',
        'indent': 'off',
        'eol-last': 'off',
        "semi": 'off',
        "quotes": 'off'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}