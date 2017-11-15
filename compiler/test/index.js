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
var fs = require('fs-extra');


var app = new Compiler({
    basePath: path.resolve(__dirname, '../../doc'),
    // sources: [
    //     {
    //         name: 'lavas',
    //         loader: 'downloadGitRepo',
    //         from: 'github:lavas-project/lavas-tutorial',
    //         // to: './lavas',
    //         // tmp: './git/lavas'
    //         to: path.resolve(__dirname, '../../doc/lavas'),
    //         tmp: path.resolve(__dirname, '../../doc/git/lavas')
    //     }
    // ],
    sources: [
        {
            name: 'test',
            loader: 'local',
            from: path.resolve(__dirname, 'md'),
            // to: './lavas',
            // tmp: './git/lavas'
            to: path.resolve(__dirname, '../../doc/test')
        }
    ],
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
            path: /lavas\/vue\/foundation/,
            url(filePath) {
                return `/happy/${filePath}`;
            }
            // dir: '正则 or function or 字符串',
            // path: '对应的真实路径${dir}',
            // renderer: 'rendererName',
            // layout: 'layoutName'
        }
    ]
});

app.on('afterDiffDir', function (args) {
    console.log('on after diff dir');
    console.log(args);
    console.log('---')
})

// var md = fs.readFileSync(path.resolve(__dirname, './md/test.md'), 'utf-8');
// app.parse(md, {
//     fullDir: path.resolve(__dirname, './md/test.md'),
//     dir: './md/test.md'
// }).then(function (html) {
//     console.log(html);
// });
var time;

app.exec('test')
// .then(() => {
//     return app.store.get('article', 'test/test.md');
// })
// .then(obj => {
//     // console.log(app.config.plugin.hooks)
//     console.log('--------')
//     console.log(obj)
// })
.then(() => {
    var str = fs.readFileSync(path.resolve(__dirname, './md/author.html'), 'utf-8');
    str += `\n${Date.now()}\n`;
    fs.writeFileSync(path.resolve(__dirname, './md/author.html'), str);
    time = path.resolve(__dirname, './md/' + Date.now() + '.html');
    fs.writeFileSync(time, 'test');
})
.then(() => {
    return sleep(5000);
})
.then(() => {
    return app.exec('test');
})
.then(() => {
    return sleep(5000);
})
.then(() => {
    fs.unlinkSync(time);
})
.then(() => {
    return app.exec('test');
})
// .then(() => {
//     return app.store.get('article', 'test/test.md');
// })
// .then(obj => {
//     // console.log(app.config.plugin.hooks)
//     console.log('--------')
//     console.log(obj)
// })
.catch(err => {
    console.log('in error')
    console.log(err)
});

function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}