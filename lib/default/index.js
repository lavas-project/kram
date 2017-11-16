/**
 * @file 默认配置文件
 * @author tangei (tanglei02@baidu.com)
 */

import store from './config/store';
import highlight from './config/highlight';
import parser from './config/parser';
import plugin from './config/plugin';
import loader from './config/loader';

import {downloadGitRepo} from './loader/download-git-repo';
import {local} from './loader/local';

import {npm} from './highlight/npm';
import {vue} from './highlight/vue';

import {chapter} from './plugin/chapter';
import {insert} from './plugin/insert';
import {minify} from './plugin/minify';
import {style} from './plugin/style';
import {stylus} from './plugin/stylus';

let logger = console;

const config = {
    store,
    logger,
    highlight,
    parser,
    plugin,
    loader
};

const module = {
    loader: {
        downloadGitRepo,
        local
    },
    highlight: {
        npm,
        vue
    },
    store: store,
    plugin: {
        chapter,
        insert,
        minify,
        style,
        stylus
    }
};

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
