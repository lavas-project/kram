/**
 * @file routes config
 * @author sekiyika(px.pengxing@gmail.com)
 */

'use strict';

const set = require('../app/utils/basic').set;
const docConfig = require('../parser').config;

// const docConfig = parser.config;

let config = {

    enableDefaultRoutes: true,

    routes: {
        // for api
        '/api/:module/:action': '{module}/{action}',

        '/monitor': function (app) {
            return async ctx => {
                ctx.body = '<!-- STATUS 200 -->';
            };
        }
    }

};

let docRoutes = docConfig.repoList.map(repo => repo.routeName);

docRoutes
    .reduce(
        (res, routeName) => {
            let rule = `/${routeName}/(.*).(.*)`;
            let repoName = docConfig.routeToRepo[routeName];

            return set(res, rule,
                {
                    type: 'static',
                    target: `/${repoName}/{0}.{1}`,
                    root: docConfig.tmpDir,
                    maxAge: 365 * 24 * 3600 * 1000
                }
            );
        },
        config.routes
    );

['/']
    .concat(docRoutes.map(routeName => `/${routeName}/:key*`))
    .reduce(
        (res, rule) => {
            return set(res, rule, {
                type: 'static',
                target: '/index.html',
                root: './public'
            });
        },
        config.routes
    );

config.routes['/(.+)'] = {
    type: 'static',
    target: '/{0}',
    root: './public',
    // max age
    maxAge: 365 * 24 * 3600 * 1000,
    index: false,
    dotfiles: 'deny',
    lastModified: true,
    etag: true
};

module.exports = config;
