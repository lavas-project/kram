/**
 * @file 将 markdown 转换为 html 并存到 store 里
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

import fs from 'fs-extra';
import {locals} from './share/locals';
import {
    set as setStruct,
    get as getStruct
} from './component/struct';
import {getPrototype, toArray, set, startWith} from './utils/basic';
import {removePrefix, join, removeExt} from './utils/path';
import {
    BEFORE_BUILD_REPOS,
    BEFORE_BUILD_DOCS,
    FINISH_BUILD_DOCS,
    FINISH_RENDER,
    plugin
} from './component/plugin';
import {parse} from './component/marked';

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

    if (!await fs.exists(repo.pull.dest)) {
        throw new Error('文档不存在');
    }

    await setStruct(repo);
    await buildDocs(repo);
    // await buildCatalogs(repo);
    return repo;
}

function toList(repos) {
    return Object.keys(repos).map(key => Object.assign({name: key}, repos[key]));
}

async function buildDocs(repo) {
    let mdpaths = getStruct(repo, {type: 'file', regex: /\.md$/});

    mdpaths = await plugin(BEFORE_BUILD_DOCS, mdpaths, repo);

    let infos = await Promise.all(
        mdpaths.map(async mdpath => {
            let md = await fs.readFile(mdpath, 'utf-8');
            let key = articleKey(repo.name, mdpath, repo.pull.dest);

            let html = await parse(md, {
                md: md,
                path: mdpath,
                key: key,
                repo: repo
            });

            let info = {
                path: mdpath,
                key: key,
                html: html
            };

            info = await plugin(FINISH_RENDER, info, repo);
            return info;
        })
    );

    let map = infos.filter(info => info.html)
        .reduce((res, info) => set(res, info.key, info));

    map = await plugin(FINISH_BUILD_DOCS, map, repo);
    return map;
}

function articleKey(repoName, mdPath, dest) {
    let key = removePrefix(mdPath, dest);
    key = join(repoName, key);
    return removeExt(key, '.md');
}

// async function buildCatalogs(repo) {
//     let mdPaths = getStruct(repo, {type: 'file', regex: /\.md$/});
//     let folderPaths = getStruct(repo, {type: 'folder'})
//         .filter(folder => mdPaths.some(md => startWith(md, folder)));

//     folderPaths = await plugin(BEFORE_BUILD_CATALOG, folderPaths, repo);
// }