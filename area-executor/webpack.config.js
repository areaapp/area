const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

const WorkerConfig = {
    entry: './src/workers/executionWorker.js',
    target: 'node',
    mode: 'production',
    devtool: 'none',
    output: {
        filename: 'executionWorker.js',
        path: path.join(__dirname, 'dist/workers')
    },
    externals: nodeModules
};


const ExecutorConfig = {
    entry: './src/index.js',
    target: 'node',
    mode: 'production',
    devtool: 'none',
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        filename: 'executor',
        path: path.join(__dirname, 'dist')
    },
    externals: nodeModules,
    plugins: [
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true,
        })
    ]
};


module.exports = [ WorkerConfig, ExecutorConfig ];


