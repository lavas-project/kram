/**
 * @file 将 markdown 转换为 html 并存到 store 里
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

import {locals} from './share/locals';

export async function build(repo) {
    repo = await repo;

    if (!await fs.exists(repo.dest)) {
        throw new Error(1, '文档不存在');
    }

    // await buildDocs();
    // await buildCatalogs();
    return repo;
}

export function builds(list) {
    return (list || toList(locals.repos)).map(async repo => await build(repo));
}

function toList(repos) {
    return Object.keys(repos).map(key => Object.assign({name: key}, repos[key]));
}
