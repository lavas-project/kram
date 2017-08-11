/**
 * @file 文档的编译
 */

import {locals} from '../../share/locals';
import fs from 'fs-extra';

import {getDocInfos} from './utils';

import {
    BEFORE_BUILD_REPOS,
    BEFORE_BUILD_DOCS,
    FINISH_BUILD_DOCS,
    FINISH_RENDER,
    plugin
} from '../plugin';

import {parse} from '../renderer/marked';

export async function build(repo) {
    let infos = getDocInfos(repo);

    infos = await plugin(BEFORE_BUILD_DOCS, infos, repo);

    await Promise.all(
        infos.map(async ({path, key}) => {
            let md = await fs.readFile(path, 'utf-8');
            let html = await parse(md, {path, key, md});

            let info = {path, key, md, html};
            info = await plugin(FINISH_RENDER, info, repo);
            return info;
        })
    );

    infos = await plugin(FINISH_BUILD_DOCS, infos, repo);
    return infos;
}
