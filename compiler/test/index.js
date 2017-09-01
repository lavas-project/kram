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
    ],
    router: [
        {
            dir(dir) {
                return path.extname(dir) !== '.md';
            },
            url(dir) {
                return `/assets/${dir}`;
            }
        },
        {
            dir: /^lavas\/vue\/foundation/,
            url(dir) {
                return `/happy/${dir}`;
            }
            // dir: '正则 or function or 字符串',
            // path: '对应的真实路径${dir}',
            // renderer: 'rendererName',
            // layout: 'layoutName'
        }
    ]
});

// app.exec()
// .then(() => {
//     app.store.get('article', 'lavas/vue/foundation/build-and-deploy-project.md')
//     .then(obj => {
//         // console.log(app.config.plugin.hooks)
//         console.log('--------')
//         console.log(obj)
//     });
// })
// .catch(err => {
//     console.log('in error')
//     console.log(err)
// });
