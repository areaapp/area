const webpack = require('webpack');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './src/index.js',
    target: 'node',
    mode: 'production',
    devtool: "none",
    output: {
        filename: 'executor',
        path: __dirname
    },
    externals: nodeModules,
    plugins: [
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true,
        }),
    ]
};
