/**
 * @file 默认配置文件
 * @author tangei (tanglei02@baidu.com)
 */

import store from './config/store';
import highlight from './config/highlight';
import parser from './config/parser';
import plugin from './config/plugin';
import loader from './config/loader';

let logger = console;

const config = {
    store,
    logger,
    highlight,
    parser,
    plugin,
    loader
};

const module = {};

export default function (app) {
    let defaultConfig = Object.keys(config)
        .reduce((res, key) => {
            if (typeof config[key] === 'function') {
                res[key] = config[key](app);
            }
            else {
                res[key] = config[key];
            }

            return res;
        }, {});

    return {
        config: defaultConfig,
        module: module
    };
}
