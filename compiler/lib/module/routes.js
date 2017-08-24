/**
 * @file url.js 处理 url 配置的方法
 * @author tanglei (tanglei02@baidu.com)
 */

import {
    ensureArray,
    isFunction,
    isRelativeUrl,
    join,
    sep,
    removePrefix
} from '../utils';

import path from 'path';

export default function (app, addModule) {
    let config;
    let plugin = new URLPlugin();

    const routes = {
        get config() {
            return config;
        },
        set config(val) {
            config = val;
            plugin.setConfig(ensureArray(urlConfig));
        },
        addRule: plugin.addRule.bind(plugin)
    };

    addModule('routes', {
        module: routes,
        init(urlConfig) {
            config = urlConfig;

            plugin.setConfig(urlConfig);
            app.module.plugin.register('processURL', plugin);
        }
    });
}

class URLPlugin {
    constructor(urlConfig) {
        this.priority = 500;
        this.setConfig(urlConfig);
    }

    apply(on, app) {
        let baseDir = app.config.baseDir;
        let sepBaseDir = sep(baseDir);

        let {AFTER_PARSE, BEFORE_STORE} = app.module.plugin.STAGES;

        on(AFTER_PARSE, (html, info) => {
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

                    url = path.join(info.fullDir, '..', url);
                    url = removePrefix(sep(url), sepBaseDir);

                    let rule = getRule(this.config, url);

                    if (!rule) {
                        return str;
                    }

                    let newUrl = isFunction(rule.url) ? rule.url(url) : rule.url;

                    if (quote) {
                        newUrl = quote + newUrl + quote;
                    }

                    return `${arrowStart}${propName}=${newUrl}${arrowEnd}`;
                }
            );
        }, 500);

        on(BEFORE_STORE, (info) => {
            let rule = getRule(this.config, info.dir);

            if (!rule) {
                return;
            }

            info.url = isFunction(rule.url) ? rule.url(info.dir) : rule.url;
            return info;
        });
    }

    setConfig(urlConfig) {
        if (urlConfig) {
            this.config = ensureArray(urlConfig);
        }
    }

    addRule(rule) {
        this.config.push(rule);
    }
}

function getRule(rules, key) {
    for (let i = 0; i < rules.length; i++) {

        let rule = rules[i];

        switch (typeof rule.dir) {
            case 'string':
                if (rule.dir === key) {
                    return rule;
                }

                break;

            case 'object':
                if (rule.dir.test(key)) {
                    return rule;
                }

                break;

            case 'function':
                if (rule.dir(key)) {
                    return rule;
                }

                break;

            default:
                break;
        }
    }
}

function getQuote(str) {
    if (str.length < 2) {
        return null;
    }

    let start = str[0];
    let end = str.slice(-1);

    if (start === end) {
        return start;
    }

    return null;
}