/**
 * @file lavas config
 * @author tanglei02(tanglei02@baidu.com)
 */

'use strict';

const path = require('path');
const BUILD_PATH = path.resolve(__dirname, '../dist');
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    build: {
        ssr: false,
        path: BUILD_PATH,
        publicPath: '/',
        ssrCopy: isDev ? [] : [
            {
                src: 'server.prod.js'
            },
            {
                src: 'package.json'
            }
        ]
    },
    router: {
        mode: 'history',
        base: '/',
        pageTransition: {
            type: 'fade',
            transitionClass: 'fade'
        },
        rewrite: [
            // {from: /^\/codelab\/detail$/, to: '/detail/:path*'},
            // {from: /^\/codelab$/, to: '/codelab/:path*'},
            // {from: /^\/pwa$/, to: '/pwa/:path*'},
            {from: /^\/guide$/, to: '/guide/:path*'},
            {from: '/codelab/list', to: '/codelab'},
            {from: '/codelab/:id', to: '/codelab/:id+'}
            // ,
            // {from: '/app/guide', to: '/app/guide/:path*'}
            // {from: '/detail', to: '/rewrite'}
        ]
    },
    serviceWorker: {
        swSrc: path.join(__dirname, 'core/service-worker.js'),
        swDest: path.join(BUILD_PATH, 'service-worker.js'),
        // swPath: '/custom_path/', // specify custom serveice worker file's path, default is publicPath
        globDirectory: BUILD_PATH,
        globPatterns: [
            '**/*.{html,js,css,eot,svg,ttf,woff}'
        ],
        globIgnores: [
            'sw-register.js',
            '**/*.map'
        ],
        appshellUrl: '/appshell',
        dontCacheBustUrlsMatching: /\.\w{8}\./
    }
};
