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

var path = require('path');
var Compiler = require('../index').Compiler;

// console.log(Compiler)
var app = new Compiler({
    baseDir: path.resolve(__dirname, '../../doc'),
    source: [
        {
            name: 'lavas',
            loader: 'downloadGitRepo',
            from: 'github:lavas-project/lavas-tutorial'
        }
    ]
});

var fs = require('fs-extra');
var md = fs.readFileSync(path.resolve(__dirname, './md/test.md'), 'utf-8');

app.parse(md, {})
    .then((html) => {
        console.log(html);
    })
    .catch(err => {
        console.log(err)
    })
// console.log(app.parse)
// console.log(app.parse(md, {}))
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
