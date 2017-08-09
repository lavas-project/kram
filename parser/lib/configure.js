/**
 * @file 配置方法
 * @author tanglei (tanglei02@baidu.com)
 */

import {locals} from './share/locals';
import {merge} from './utils/basic';

import {configure as highlight} from './module/renderer/highlight';
import {configure as marked} from './module/renderer/marked';
import {configure as plugins} from './module/plugin';
import {configure as pullers} from './module/puller';

const components = {
    highlight,
    marked,
    plugins,
    pullers
};

export function configure(options) {
    let {store, logger, repos} = options;
    merge(locals, {store, logger, repos});
    merge(locals.config, options);
    Object.keys(components).forEach(key => components[key](options[key]));
}
