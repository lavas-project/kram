/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

import * as kram from '../../index';
import {locals} from '../share/locals';
import {isValidArray, noop} from '../utils';

export const BEFORE_LOAD_REPOS = 'beforeLoadRepos';
export const BEFORE_LOAD = 'beforeLoad';
export const AFTER_LOAD = 'afterLoad';
export const BEFORE_BUILD_REPOS = 'beforeBuildRepos';
export const BEFORE_RENDER = 'beforeRender';
export const AFTER_RENDER = 'afterRender';
export const BEFORE_DOC_STORE = 'beforeDocStore';
export const AFTER_DOC_STORE = 'afterDocStore';
export const BEFORE_BUILD_DOCS = 'beforeBuildDocs';
export const FINISH_BUILD_DOCS = 'finishBuildDocs';

export const HOOKS = [
    BEFORE_LOAD_REPOS,
    BEFORE_LOAD,
    AFTER_LOAD,
    BEFORE_BUILD_REPOS,
    BEFORE_RENDER,
    AFTER_RENDER,
    BEFORE_DOC_STORE,
    AFTER_DOC_STORE,
    BEFORE_BUILD_DOCS,
    FINISH_BUILD_DOCS
]
.reduce((set, val) => set.add(val), new Set());

export function configure(plugins) {
    if (!isValidArray(plugins)) {
        return;
    }

    let valid = plugins.filter(
        plugin => locals.plugins.every(exist => exist.name !== plugin.name)
    );

    valid.forEach(plugin => plugin.apply(on.bind(plugin), kram));
    locals.plugins.push(...valid);
}

function on(stage, fn, priority = 999) {
    if (!HOOKS.has(stage)) {
        return;
    }

    locals.hooks[stage] = locals.hooks[stage] || [];
    locals.hooks[stage].push({priority, fn, name: this.name});
    locals.hooks[stage].sort((a, b) => a.priority - b.priority);
}

export async function plugin(stage, ...args) {
    let isDeliver = args.length > 1;
    let result = isDeliver ? () => args[0] : noop;

    let hooks = locals.hooks[stage];

    if (!isValidArray(hooks)) {
        return result();
    }

    for (let i = 0; i < hooks.length; i++) {
        let val;

        try {
            val = await hooks[i].fn(...args);
        }
        catch (e) {
            locals.logger.error('Plugin: ${hooks[i].name} ERROR in stage: ${stage}');
            locals.logger.error(e);
            continue;
        }

        if (isDeliver && val != null) {
            args[0] = val;
        }
    }

    return result();
}
