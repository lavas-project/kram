/**
 * @file routes config
 * @author sekiyika(px.pengxing@gmail.com)
 */

'use strict';

const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, '../dist');
const staticDir = path.resolve(distDir, './static');
const tmpDir = path.resolve(rootDir, './tmp');

let config = {

    enableDefaultRoutes: true,

    routes: {
        // for api
        '/api/:module/:action': '{module}/{action}',

        '/monitor'(app) {
            return async ctx => {
                ctx.body = '<!-- STATUS 200 -->';
            };
        },

        '/favicon.ico': {
            type: 'static',
            target: '/favicon.ico',
            root: path.resolve(staticDir, './img/icons')
        },

        '/static/(.*)': {
            type: 'static',
            target: '/{0}',
            root: staticDir
        },

        '/doc-assets/(.*)': {
            type: 'static',
            target: '/{0}',
            root: path.resolve(tmpDir, './doc')
        },

        '/service-worker.js': {
            type: 'static',
            target: '/service-worker.js',
            root: distDir
        },

        '/sw-register.js': {
            type: 'static',
            target: '/sw-register.js',
            root: distDir
        },

        '/manifest.json': {
            type: 'static',
            target: '/manifest.json',
            root: staticDir
        },

        '/:url*': {
            type: 'static',
            target: '/index.html',
            root: distDir
        }
    }
};

module.exports = config;
