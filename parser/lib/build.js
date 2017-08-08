/**
 * @file 将 markdown 转换为 html 并存到 store 里
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

import {locals} from './share/locals';
import {getPrototype} from './utils/basic';

export function build(list) {
    switch (getPrototype(list)) {
        case 'Object':
            return await buildRepo(list);
        case 'Undefined':
            list = toList(locals.repos);
        default:
            return list.map(async repo => await buildRepo(repo));

    }
}

async function buildRepo(repo) {
    repo = await repo;

    if (!await fs.exists(repo.dest)) {
        throw new Error(1, '文档不存在');
    }

    // await buildDocs();
    // await buildCatalogs();
    return repo;
}

function toList(repos) {
    return Object.keys(repos).map(key => Object.assign({name: key}, repos[key]));
}
