/**
 * @file 测试文件
 * @author tanglei (tanglei02@baidu.com)
 */

/* eslint-disable */

require('babel-register');
require('babel-polyfill');
var cheerio = require('cheerio');

var path = require('path');
var Kram = require('../lib/index').Kram;
var fs = require('fs-extra');

// 测试 plugin
// 作用是从文章第一段中提取文字作为文章的默认介绍
// 挂载到 info.description 中

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
        {
            name: 'test',
            loader: 'local',
            from: path.resolve(__dirname, 'md'),
            to: path.resolve(__dirname, './tmp/test')
        }
    ],
    plugin: {
        description: new DefaultDescription()
    },
    routes: [
        // 资源文件（非 markdown）的 url 路由规则
        {
            // 函数方式判断
            path(filePath) {
                return path.extname(filePath) !== '.md';
            },
            url(filePath) {
                return `/assets/${filePath}`;
            }
        },
        // 文档文件的 url 路由规则
        {
            path: /\.md$/,
            url(filePath) {
                let key = filePath.replace(/\.md$/, '');
                return `/doc/${key}`;
            }
        }
    ]
});

app.on('start', function () {
    console.log('--- on start ---');
});

app.on('done', function () {
    console.log('--- on done ---');
});

app.exec().then(function () {
    app.getDoc('test/normal.md').then(info => {
        console.log('** test/normal.md **');
        console.log(JSON.stringify(info, null, 4));
        console.log('');
    });

    app.getDoc('test/enhance.md').then(info => {
        console.log('** test/enhance.md **');
        console.log(JSON.stringify(info, null, 4));
        console.log('');
    });

    app.getMenu('test').then(info => {
        console.log('** get menu: test **');
        console.log(JSON.stringify(info, null, 4));
        console.log('');
    });

    app.getMenu('test/sub').then(info => {
        console.log('** get menu: test/sub **');
        console.log(JSON.stringify(info, null, 4));
        console.log('');
    });
});
