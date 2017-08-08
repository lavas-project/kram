/**
 * @file 配置方法
 * @author tanglei (tanglei02@baidu.com)
 */

import {locals} from './share/locals';
import {merge} from './utils/basic';

import {configure as highlight} from './component/highlight';
import {configure as marked} from './component/marked';
import {configure as plugins} from './component/plugin';
import {configure as pullers} from './component/puller';

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
