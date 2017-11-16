/**
 * @file 钩子
 * @author tanglei (tanglei02@baidu.com)
 */

import {RENDER_NAMES} from '../parser/renderer';

export const START = 'start';
export const BEFORE_LOAD = 'beforeLoad';
export const AFTER_LOAD = 'afterLoad';

export const BEFORE_FILTER_FILE = 'beforeFilterFile';
export const AFTER_FILTER_FILE = 'afterFilterFile';
export const FILTER_ENTRY = 'filterEntry';

export const BEFORE_PARSE = 'beforeParse';
export const AFTER_PARSE = 'afterParse';
export const CREATE_DOC_STORE_OBJECT = 'createDocStoreObject';

export const BEFORE_STORE_DOC = 'beforeStoreDoc';
export const AFTER_STORE_DOC = 'afterStoreDoc';

export const BEFORE_BUILD = 'beforeBuild';
export const AFTER_BUILD = 'afterBuild';

export const RENDER_PREFIX = 'render:';

export const DONE = 'done';

export const RENDER_STAGES = RENDER_NAMES.reduce((res, name) => {
        res['RENDER_' + name.toUpperCase()] = RENDER_PREFIX + name;
        return res;
    },
    {}
);

export const STAGES = Object.assign(
    {
        START,

        BEFORE_LOAD,
        AFTER_LOAD,

        BEFORE_FILTER_FILE,
        AFTER_FILTER_FILE,

        BEFORE_PARSE,
        AFTER_PARSE,
        CREATE_DOC_STORE_OBJECT,

        BEFORE_STORE_DOC,
        AFTER_STORE_DOC,

        BEFORE_BUILD,
        AFTER_BUILD,

        DONE
    },
    RENDER_STAGES
);

export const STAGE_SET = Object.keys(STAGES)
    .reduce((set, key) => set.add(STAGES[key]), new Set());
