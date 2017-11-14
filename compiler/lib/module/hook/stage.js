/**
 * @file 钩子
 * @author tanglei (tanglei02@baidu.com)
 */

import {RENDER_NAMES} from '../parser/renderer';

export const BEFORE_LOAD = 'beforeLoad';
export const AFTER_LOAD = 'afterLoad';

export const BEFORE_DIFF_DIR = 'beforeDiffDir';
export const AFTER_DIFF_DIR = 'afterDiffDir';

export const BEFORE_PARSE = 'beforeParse';
export const AFTER_PARSE = 'afterParse';
export const BEFORE_STORE = 'beforeStore';
export const AFTER_STORE = 'afterStore';
export const BEFORE_BUILD = 'beforeBuild';
export const AFTER_BUILD = 'afterBuild';

export const ON_RENDER_PREFIX = 'onRender:';

export const RENDER_STAGES = RENDER_NAMES.reduce((res, name) => {
        res['ON_RENDER_' + name.toUpperCase()] = ON_RENDER_PREFIX + name;
        return res;
    },
    {}
);

export const STAGES = Object.assign(
    {
        BEFORE_LOAD,
        AFTER_LOAD,

        BEFORE_DIFF_DIR,
        AFTER_DIFF_DIR,

        BEFORE_PARSE,
        AFTER_PARSE,
        BEFORE_STORE,
        AFTER_STORE,
        BEFORE_BUILD,
        AFTER_BUILD
    },
    RENDER_STAGES
);

export const STAGE_SET = Object.keys(STAGES)
    .reduce((set, key) => set.add(STAGES[key]), new Set());
