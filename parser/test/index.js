/**
 * @file 测试文件
 * @author tanglei (tanglei02@baidu.com)
 */

/* eslint-disable */

var os = require('os');

if (os.type() === 'Windows_NT') {
    process.env.NODE_ENV = 'development';
}

if (process.env.NODE_ENV !== 'production') {
    require('babel-register');
    require('babel-polyfill');
}

var fs = require('fs-extra');
var path = require('path');
var parser = require('../index');
var parse = parser.parse;
var configure = parser.configure;

var md = fs.readFileSync(path.resolve(__dirname, './md/test.md'), 'utf-8');

configure({
    marked: {
        options: {
            renderer: {
                heading(text, level, raw) {
                    return `
                        <h${level}>${text}</h${level}>
                    `;
                }
            }
        }
    }
});

console.log(parse(md, {path: 'lavas'}));
