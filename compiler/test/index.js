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

var Compiler = require('../index').Compiler;

// console.log(Compiler)
var app = new Compiler();

console.log(app)
// var fs = require('fs-extra');
// var path = require('path');
// var kram = require('../index');

// var dest = path.resolve(__dirname, '../../doc/dest/lavas');
// var tmp = path.resolve(__dirname, '../../doc/git/lavas');

// fs.ensureDirSync(dest);
// fs.ensureDirSync(tmp);

// fs.removeSync(dest);
// fs.removeSync(tmp);

// kram.init({
//     repos: {
//         lavas: {
//             loader: {
//                 use: 'downloadGitRepo',
//                 from: 'github:lavas-project/lavas-tutorial',
//                 dest: dest,
//                 options: {tmp}
//             }
//         }
//     }
// });

// kram.build(kram.load());
