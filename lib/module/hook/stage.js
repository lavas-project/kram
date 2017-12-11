/**
 * @file 钩子
 * @author tanglei (tanglei02@baidu.com)
 */

import {RENDER_NAMES} from '../parser/renderer';

export const START = 'start';
export const BEFORE_LOAD = 'beforeLoad';
export const AFTER_LOAD = 'afterLoad';

export const GET_ORIGINAL_FILES = 'getOriginalFiles';
export const GET_CHANGED_FILES = 'getChangedFiles';
export const GET_CHANGE_ENTRY_FILES = 'getChangedEntryFiles';
export const AFTER_FILE_PROCESS = 'afterFileProcess';

export const BEFORE_PARSE = 'beforeParse';
export const AFTER_PARSE = 'afterParse';
export const CREATE_DOC_STORE_OBJECT = 'createDocStoreObject';

export const CREATE_MENU = 'createMenu';

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

        GET_ORIGINAL_FILES,
        GET_CHANGED_FILES,
        GET_CHANGE_ENTRY_FILES,
        AFTER_FILE_PROCESS,

        BEFORE_PARSE,
        AFTER_PARSE,
        CREATE_DOC_STORE_OBJECT,

        CREATE_MENU,

        DONE
    },
    RENDER_STAGES
);

export const STAGE_SET = Object.keys(STAGES)
    .reduce((set, key) => set.add(STAGES[key]), new Set());
