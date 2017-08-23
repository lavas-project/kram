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
    sources: [
        {
            name: 'lavas',
            loader: 'downloadGitRepo',
            from: 'github:lavas-project/lavas-tutorial',
            to: path.resolve(__dirname, '../../doc/lavas'),
            tmp: path.resolve(__dirname, '../../doc/git/lavas')
        }
    ]
});

app.exec()
.then(() => {
    app.store.get('article', 'lavas/vue/webpack/router-loader')
    .then(obj => {
        console.log(obj)
    });
});

// app.module.loader.loadAll()
// .then(obj => app.module.dir.processAll(obj))
// .then(obj => {
//     console.log(JSON.stringify(obj))
// })
// .catch(err => {
//     console.log(err)
// });
