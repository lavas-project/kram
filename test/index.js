/**
 * @file 测试文件
 * @author tanglei (tanglei02@baidu.com)
 */

/* eslint-disable */

// var os = require('os');

// if (os.type() === 'Windows_NT') {
//     process.env.NODE_ENV = 'development';
// }

require('babel-register');
require('babel-polyfill');

var path = require('path');
var Kram = require('../lib/index').Kram;
var fs = require('fs-extra');


var app = new Kram({
    basePath: path.resolve(__dirname, './tmp'),
    sources: [
        {
            name: 'lavas',
            loader: 'local',
            from: path.resolve(__dirname, 'lavas'),
            // loader: 'downloadGitRepo',
            // from: 'github:lavas-project/lavas-tutorial',
            to: path.resolve(__dirname, './tmp/lavas')
            // ,
            // tmp: path.resolve(__dirname, './tmp/git/lavas')
        }
    ],
    // sources: [
    //     {
    //         name: 'test',
    //         loader: 'local',
    //         from: path.resolve(__dirname, 'md'),
    //         // to: './lavas',
    //         // tmp: './git/lavas'
    //         to: path.resolve(__dirname, './tmp/test')
    //     },
    //     {
    //         name: 'lalalan',
    //         loader: 'local',
    //         from: path.resolve(__dirname, 'lalala'),
    //         // to: './lavas',
    //         // tmp: './git/lavas'
    //         to: path.resolve(__dirname, './tmp/lalalan')
    //     }
    // ],
    routes: [
        {
            path(filePath) {
                return path.extname(filePath) !== '.md';
            },
            url(filePath) {
                return `/assets/${filePath}`;
            }
        },
        {
            path: /^lavas\/vue\/foundation/,
            url(filePath) {
                return `/happy/${filePath}`;
            }
            // path: '正则 or function or 字符串'
        },
        {
            path: /^lavas\/vue/,
            url(filePath) {
                return `/guide/${filePath}`;
            }
        },
        {
            path: /^lavas\//,
            url(filePath) {
                return `/not-any/${filePath}`;
            }
        }
    ]
});

// app.on('afterFilterFile', function (args) {
//     console.log('on after filter file');
//     console.log(args);
//     console.log('---');
// });
app.on('done', function () {
    console.log('done')
    // console.log(app.default.config.store.storage.map)
    // console.log('----')
    console.log(app.default.config.store.storage.map['KRAM$$menu$$all'])
    // console.log('----')
    // console.log(app.entryInfos)
})

// var md = fs.readFileSync(path.resolve(__dirname, './md/test.md'), 'utf-8');
// app.parse(md, {
//     fullDir: path.resolve(__dirname, './md/test.md'),
//     dir: './md/test.md'
// }).then(function (html) {
//     console.log(html);
// });
// var tmpPath;

app.exec()
// .then(function () {
//     var authorPath = path.resolve(__dirname, './md/author.partial.html');
//     var str = fs.readFileSync(authorPath, 'utf-8');
//     str += `\n${Date.now()}\n`;
//     fs.writeFileSync(authorPath, str);
// })
// .then(function () {
//     tmpPath = path.resolve(__dirname, './md/' + Date.now() + '.html');
//     fs.writeFileSync(tmpPath, 'test');
// })
// .then(function () {
//     return sleep(5000);
// })
// .then(function () {
//     return app.exec('test');
// })
// .then(function () {
//     return sleep(5000);
// })
// .then(function () {
//     fs.unlinkSync(tmpPath);
// })
// .then(function () {
//     return app.exec('test');
// })
// .then(function () {
//     console.log(app.module.store.default.storage);
// })
// .then(() => {
//     return app.store.get('article', 'test/test.md');
// })
// .then(obj => {
//     // console.log(app.config.plugin.hooks)
//     console.log('--------')
//     console.log(obj)
// })
.catch(function (err) {
    console.log('in error');
    console.log(err);
});

function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
