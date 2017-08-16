/**
 * @file module
 * @author tanglei (tanglei02@baidu.com)
 */

import loader from './loader';
import plugin from './plugin';
import parser from './parser';
import highlight from './parser/highlight';
import store from './store';

export default {
    loader,
    plugin,
    parser,
    highlight,
    store
};
