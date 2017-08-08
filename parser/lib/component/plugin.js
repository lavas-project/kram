/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

import * as kram from '../../index';
import {locals} from '../share/locals';
import {isValidArray} from '../utils/basic';

export const BEFORE_RENDER = 'beforeRender';
export const AFTER_RENDER = 'afterRender';

export const HOOKS = [
    BEFORE_RENDER,
    AFTER_RENDER
]
.reduce((set, val) => set.add(val), new Set());

export function configure(plugins) {
    if (!isValidArray(plugins)) {
        return;
    }

    plugins.forEach(plugin => plugin.apply(on, kram));
}

export function on(stage, fn, priority = 999) {
    if (!HOOKS.has(stage)) {
        return;
    }

    locals.hooks[stage] = locals.hooks[stage] || [];
    locals.hooks[stage].push({priority, fn});
    locals.hooks[stage].sort((a, b) => a.priority - b.priority);
}

export async function plugin(stage, info, options) {
    let plugins = locals.hooks[stage];

    if (!isValidArray(plugins)) {
        return info;
    }

    for (let i = 0; i < plugins.length; i++) {
        info = await plugins[i].fn(info, options);
    }

    return info;
}
