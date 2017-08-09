/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

// import defaultConf from './default';
import {configure} from './lib/configure';
import {locals} from './lib/share/locals';

export {pull} from './lib/pull';
export {build} from './lib/build';
export {parse} from './lib/module/renderer/marked';

export {configure as configure};
export {locals as locals};

export function init(options) {
    let conf = Object.assign({}, locals.default, options);
    configure(conf);
}
