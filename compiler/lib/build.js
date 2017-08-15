/**
 * @file 将 markdown 转换为 html 并存到 store 里
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

import fs from 'fs-extra';
import {locals} from './share/locals';
import * as builder from './module/builder';
import {getPrototype} from './utils';
import {parse} from './module/renderer/marked';

export async function build(list) {
    list = await list;

    switch (getPrototype(list)) {
        case 'Object':
            return buildRepo(list);
        case 'Undefined':
            list = toList(locals.repos);
        default:
            return list.map(async repo => await buildRepo(repo));
    }
}

async function buildRepo(repo) {
    repo = await repo;

    if (!await fs.exists(repo.loader.dest)) {
        throw new Error('文档不存在');
    }

    await builder.init(repo);
    locals.logger.info('builder init finish: ' + repo.name);

    let docKeys = await builder.doc(repo);
    await builder.catalog(repo, docKeys);
    return repo;
}

function toList(repos) {
    return Object.keys(repos).map(name => Object.assign({name}, repos[name]));
}
