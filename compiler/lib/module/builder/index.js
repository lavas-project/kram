/**
 * @file builder
 * @author tanglei (tanglei02@baidu.com)
 */

import {init as initStruct} from './struct';
import {init as initMeta} from './meta';

export async function init(repo) {
    await initStruct(repo);
    await initMeta(repo);
}

export {build as doc} from './doc';
export {build as catalog} from './catalog';
