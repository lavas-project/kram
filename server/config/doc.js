/**
 * @file document config
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

/* eslint-disable fecs-properties-quote */

const path = require('path');
const utils = require('../app/utils/basic');

let rootDir = path.resolve(__dirname, '..');
let tmpDir = path.resolve(rootDir, './tmp');
let docDir = path.resolve(tmpDir, './doc');
let gitDir = path.resolve(tmpDir, './git');

module.exports = {
    host: 'https://lavas.baidu.com',
    basePath: docDir,
    sources: [
        {
            name: 'lavas',
            loader: 'downloadGitRepo',
            from: 'github:lavas-project/lavas-tutorial',
            to: path.resolve(docDir, './lavas'),
            tmp: path.resolve(gitDir, './lavas')
        },
        {
            name: 'codelab',
            loader: 'downloadGitRepo',
            from: 'github:lavas-project/codelab',
            to: path.resolve(docDir, './codelab'),
            tmp: path.resolve(gitDir, './codelab')
        }
    ],
    routes: [
        {
            path(filePath) {
                return /\.[a-zA-Z0-9]+($|\?|#)/.test(filePath) && !/\.md($|\?|#)/.test(filePath);
            },
            url(filePath) {
                return `/doc-assets/${filePath}`;
            }
        },
        {
            path: /^lavas\/vue/,
            url(filePath) {
                filePath = filePath.replace(/\.md($|\?|#)/, '$1').replace(/^lavas\/vue/, 'v1');
                return `/guide/${filePath}`;
            }
        },
        {
            path: /^lavas\//,
            url(filePath) {
                filePath = filePath.replace(/\.md($|\?|#)/, '$1').replace(/^lavas\//, '');
                return `/guide/${filePath}`;
            }
        },
        {
            path: /^codelab\//,
            url(filePath) {
                filePath = filePath.replace(/\.md($|\?|#)/, '$1');
                return `/${filePath}`;
            }
        }
    ],
    menus: [
        {
            url: /^\/guide\/v1/,
            menu(url) {
                return 'lavas/vue';
            }
        },
        {
            url: /^\/guide\//,
            menu(url) {
                let match = url.match(/^\/guide\/(.+?)(\/|$)/);
                if (match) {
                    return `lavas/${match[1]}`;
                }
            }
        },
        {
            url: /^\/codelab\//,
            menu(url) {
                let match = url.match(/^\/codelab\/(.+?)(\/|$)/);
                if (match) {
                    return `codelab/${match[1]}`;
                }
            }
        }
    ],
    alias: [
        {
            url: /^\/guide$/,
            async alias(url, compiler) {
                let menu = await compiler.getMenu('lavas');

                if (!menu) {
                    return;
                }

                menu = menu.filter(item => !!item.children);
                let node = utils.firstNode(menu);
                return node && node.url;
            }
        }
    ]
};
