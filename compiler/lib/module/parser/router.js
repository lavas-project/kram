/**
 * @file url.js 处理 url 配置的方法
 * @author tanglei (tanglei02@baidu.com)
 */

import {
    ensureArray,
    is,
    isRelativeUrl,
    // join,
    sep,
    removePrefix
} from '../../utils';

import path from 'path';

class URLPlugin {
    constructor(routes) {
        this.priority = 500;
        this.routes = [];
        // this.deletable = false;
        this.setRoutes(routes);
    }

    apply(on, app) {
        let basePath = app.config.basePath;
        let sepBasePath = sep(basePath);

        let {AFTER_PARSE, BEFORE_STORE_DOC} = app.STAGES;

        on(AFTER_PARSE, (html, info) => {
            if (!info) {
                return;
            }

            return html.replace(
                /(<[a-zA-Z0-9-]+ [^<]*?)(href|src)=(.*?)(>| [^<]*?>)/mg,
                (str, arrowStart, propName, url, arrowEnd) => {
                    let quote = getQuote(url);

                    if (quote) {
                        url = url.slice(1, -1);
                    }

                    if (!isRelativeUrl(url)) {
                        return str;
                    }

                    url = path.join(info.fullPath, '..', url);
                    url = removePrefix(sep(url), sepBasePath);

                    let route = this.getRoute(url);

                    if (!route) {
                        return str;
                    }

                    let newUrl = is(Function, route.url) ? route.url(url) : route.url;

                    if (quote) {
                        newUrl = quote + newUrl + quote;
                    }

                    return `${arrowStart}${propName}=${newUrl}${arrowEnd}`;
                }
            );
        }, this.priority);

        on(BEFORE_STORE_DOC, info => {
            let route = this.getRoute(info.path);

            if (!route) {
                return;
            }

            info.url = is(Function, route.url) ? route.url(info.path) : route.url;
            return info;
        });
    }

    setRoutes(routes) {
        if (routes) {
            this.routes = ensureArray(routes);
        }
    }

    addRoute(route) {
        this.routes.push(route);
    }

    getRoute(key) {
        for (let i = 0; i < this.routes.length; i++) {

            let route = this.routes[i];

            switch (typeof route.path) {
                case 'string':
                    if (route.path === key) {
                        return route;
                    }

                    break;

                case 'object':
                    if (route.path.test(key)) {
                        return route;
                    }

                    break;

                case 'function':
                    if (route.path(key)) {
                        return route;
                    }

                    break;

                default:
                    break;
            }
        }
    }
}

function getQuote(str) {
    if (str.length < 2) {
        return;
    }

    let start = str[0];
    let end = str.slice(-1);

    if (start === end) {
        return start;
    }

    return;
}

export default function (app) {
    let routes;
    let plugin = new URLPlugin();

    const router = {
        get routes() {
            return routes;
        },
        set routes(val) {
            routes = val;
            plugin.setRoutes(val);
        },
        get addRoute() {
            return plugin.addRoute;
        }
    };

    app.addModule('router', () => router);

    return () => {
        router.routes = app.config.routes;
        app.module.plugin.register('processURL', plugin);
    };
}
