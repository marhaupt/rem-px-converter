/* eslint-disable @typescript-eslint/no-var-requires */
const postcssPresetEnv = require('postcss-preset-env');

const config = {
    plugins: [
        postcssPresetEnv({ browsers: 'last 2 versions' })
    ]
};

module.exports = config;
