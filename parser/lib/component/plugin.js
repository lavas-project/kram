/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

import * as kram from '../../index';
import {locals} from '../share/locals';
import {isValidArray, noop} from '../utils/basic';

export const BEFORE_PULL = 'beforePull';
export const AFTER_PULL = 'afterPull';
export const BEFORE_RENDER = 'beforeRender';
export const AFTER_RENDER = 'afterRender';

export const HOOKS = [
    BEFORE_PULL,
    AFTER_PULL,
    BEFORE_RENDER,
    AFTER_RENDER
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

        if (val === false) {
            throw new Error(`Plugin: ${hooks[i].name} request STOP in stage: ${stage}`);
        }

        if (isDeliver && val != null) {
            args[0] = val;
        }
    }

    return result();
}
