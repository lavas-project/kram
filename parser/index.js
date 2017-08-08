/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

import defaultConf from './default';
import {configure} from './lib/configure';
import {locals} from './lib/share/locals';

export {pull} from './lib/pull';
export {build} from './lib/build';
export {parse} from './lib/component/marked';

export {configure as configure};
export {locals as locals};

export function init(options) {
    let conf = Object.assign({}, defaultConf, options);
    locals.default = conf;
    configure(conf);
}
