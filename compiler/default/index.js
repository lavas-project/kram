/**
 * @file 默认配置文件
 * @author tangei (tanglei02@baidu.com)
 */

import {store} from './store';
import highlight from './config/highlight';
import marked from './config/marked';
import plugins from './config/plugin';
import loaders from './config/loader';

let logger = console;

export default {
    store,
    logger,
    highlight,
    marked,
    plugins,
    loaders
};
