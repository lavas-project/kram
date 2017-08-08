/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
import {locals} from '../share/locals';
import {get, merge, isObject} from '../utils/basic';
import {
    BEFORE_RENDER,
    AFTER_RENDER,
    plugin
} from './plugin';

export function configure(options) {
    if (!isObject(options)) {
        return;
    }

    let renderer = get(options, 'renderer');
    let defaultOpts = locals.default.marked;

    if (!renderer) {
        renderer = defaultOpts.renderer;
    }
    else if (isObject(renderer)) {
        renderer = merge(defaultOpts.renderer, renderer);
    }

    let opts = Object.assign({}, defaultOpts, options, {renderer});
    marked.setOptions(opts);
}

export async function parse(md, options) {
    md = await plugin(BEFORE_RENDER, md, options);
    let html = marked(md);
    html = await plugin(AFTER_RENDER, html, options);
    return html;
}
