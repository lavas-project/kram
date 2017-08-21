/**
 * @file module
 * @author tanglei (tanglei02@baidu.com)
 */

import loader from './loader';
import plugin from './plugin';
import parser from './parser';
import highlight from './parser/highlight';
import store from './store';
import logger from './logger';

export default {
    loader,
    plugin,
    parser,
    highlight,
    store,
    logger
};
