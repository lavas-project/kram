/**
 * @file 将 markdown 转换为 html 并存到 store 里
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

import fs from 'fs-extra';
import {buildStruct, buildStructMap} from './builder/struct';
import {buildDocMap} from './builder/doc';
import {buildCatalogMap} from './builder/catalog';
import {ensureArray} from './utils/basic';
import {config} from '../config';
import {STATIC} from './component/static';

export default function (repos = repoList) {
    const {repoList, host, store} = config;

    return ensureArray(repos)
        .map(async repo => {
            let {key, value} = await build(repo, {host, logger: STATIC.logger});
            await store.set(key, value);
            return repo;
        });
}

async function build(repo, {logger = console, host}) {
    if (!await fs.exists(repo.dest)) {
        return;
    }

    let options = {repo, logger, host};

    // 获取原始文档文件结构
    let struct = await buildStruct(repo.dest, options);
    let structMap = buildStructMap(struct);
    // 编译文档
    let doc = await buildDocMap(struct, options);

    // 基于原始文档结构和 meta.json 构造文档目录
    let catalog = await buildCatalogMap(structMap, doc, options);

    logger.info(`document build complete: ${repo.name}`);

    return {
        key: repo.name,
        value: {doc, catalog}
    };
}
