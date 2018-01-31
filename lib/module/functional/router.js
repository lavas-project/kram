/**
 * @file url.js 处理 url 配置的方法
 * @author tanglei (tanglei02@baidu.com)
 */

import {
    ensureArray,
    is,
    isRelativeUrl,
    relativePath
} from '../../utils';

import path from 'path';

class URLPlugin {
    constructor(routes) {
        this.priority = 500;
        this.routes = [];
        this.setRoutes(routes);
    }

    apply(on, app) {
        let basePath = app.config.basePath;

        let {AFTER_PARSE, CREATE_DOC_STORE_OBJECT} = app.STAGES;

        on(AFTER_PARSE, (html, info) => {
            if (!info) {
                return;
            }

            // 将所有相对路径的 url 根据配置中的 routes 规则进行替换
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
                    url = relativePath(basePath, url);

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

        on(CREATE_DOC_STORE_OBJECT, info => {
            let route = this.getRoute(info.path);

            if (!route) {
                return;
            }

            info.url = is(Function, route.url) ? route.url(info.path) : route.url;
            return info;
        });
    }

    /**
     * 添加路由匹配与替换规则列表
     *
     * @param {Array} routes 路由匹配规则与替换列表
     */
    setRoutes(routes) {
        if (routes) {
            this.routes = ensureArray(routes);
        }
    }

    /**
     * 增量式增加匹配与替换规则
     *
     * @param {Object} route route 规则
     * @param {Function} route.path url 匹配规则
     * @param {Function} route.url 映射到的新的 url
     */
    addRoute(route) {
        this.routes.push(route);
    }

    /**
     * 遍历查找 url 匹配到的对应的 route 规则
     *
     * @param {string} key 匹配规则
     * @return {Object} route 规则
     */
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
