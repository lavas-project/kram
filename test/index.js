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
var cheerio = require('cheerio');

var path = require('path');
var Kram = require('../lib/index').Kram;
var fs = require('fs-extra');

class DefaultDescription {
    apply(on, app) {
        on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
            if (!obj.info || !obj.info.description) {
                let $ = cheerio.load(obj.html, {decodeEntities: false});
                obj.info = obj.info || {};
                obj.info.description = $('body').children('p').first().text();
                return obj;
            }

        }, 9999);
    }
}


var app = new Kram({
    basePath: path.resolve(__dirname, './tmp'),
    sources: [
        // {
        //     name: 'lavas',
        //     loader: 'local',
        //     from: path.resolve(__dirname, 'lavas'),
        //     // loader: 'downloadGitRepo',
        //     // from: 'github:lavas-project/lavas-tutorial',
        //     to: path.resolve(__dirname, './tmp/lavas')
        //     // ,
        //     // tmp: path.resolve(__dirname, './tmp/git/lavas')
        // },
        {
            name: 'pwa',
            loader: 'local',
            from: path.resolve(__dirname, 'pwa'),
            // loader: 'downloadGitRepo',
            // from: 'github:lavas-project/lavas-tutorial',
            to: path.resolve(__dirname, './tmp/pwa')
            // ,
            // tmp: path.resolve(__dirname, './tmp/git/lavas')
        }
    ],
    plugin: {
        description: new DefaultDescription()
    },
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
        },
        {
            path: /^pwa\//,
            url(filePath) {
                return `/doc/${filePath}`;
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
    // console.log(app.default.config.store.storage.map['KRAM$$menu$$all'][0])
    // console.log(app.default.config.store.storage.map['KRAM$$menu$$all'][0].children[2])
    // console.log('----')
    // console.log(app.entryInfos)
    app.getMenu('pwa').then((info) => {
        console.log(info)
    })

    app.getMenuItem('pwa').then((info) => {
        console.log(info)
    })

    // app.getDoc('pwa/automatic-login/introduction.md').then((info) => {
    //     console.log(info)
    // })
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
.then(function () {
    return sleep(5000);
})
.then(function () {
    metaPath = path.resolve(__dirname, './pwa/meta.json');
    var str = fs.readFileSync(metaPath, 'utf-8');
    var meta = JSON.parse(str);
    meta.menu[0].name = '测试文档修改' + Date.now();
    str = JSON.stringify(meta);
    fs.writeFileSync(metaPath, str);
})
// .then(function () {
//     return app.exec('test');
// })
.then(function () {
    return sleep(5000);
})
// .then(function () {
//     fs.unlinkSync(tmpPath);
// })
.then(function () {
    return app.exec();
})
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
