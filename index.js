/**
 * @file 入口
 * @author sekiyika(pengxing5501854@gmail.com)
 */

'use strict';

const os = require('os');

if (os.type() === 'Windows_NT') {
    process.env.NODE_ENV = 'development';
}

if (process.env.NODE_ENV !== 'production') {
    require('babel-register');
    require('babel-polyfill');
}

const app = require('akb')();
app.run();
