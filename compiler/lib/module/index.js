/**
 * @file module
 * @author tanglei (tanglei02@baidu.com)
 */

import loader from './loader';
import plugin from './plugin';
import parser from './parser';
import highlighter from './parser/highlighter';
import store from './store';
import logger from './logger';
import dir from './dir';
import builder from './builder';
import routes from './routes';

export default {
    loader,
    plugin,
    parser,
    highlighter,
    store,
    logger,
    dir,
    builder,
    routes
};
