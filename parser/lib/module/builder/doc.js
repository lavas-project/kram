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
    BEFORE_DOC_STORE,
    AFTER_DOC_STORE,
    plugin
} from '../plugin';

import {parse} from '../renderer/marked';

export async function build(repo) {
    let infos = getDocInfos(repo);

    infos = await plugin(BEFORE_BUILD_DOCS, infos, repo);

    let keys = await Promise.all(
        infos.map(async ({path, key}) => {
            let md = await fs.readFile(path, 'utf-8');
            let html = await parse(md, {path, key, md});

            let info = {path, key, md, html};

            info = await plugin(BEFORE_DOC_STORE, info, repo);
            await locals.store.set(key, info);
            await plugin(AFTER_DOC_STORE, {key, repo});

            return key;
        })
    );

    await plugin(FINISH_BUILD_DOCS, {keys, repo});
    return infos;
}
