/**
 * @file builder
 * @author tanglei (tanglei02@baidu.com)
 */
import path from 'path';
import fs from 'fs-extra';

import {
    BEFORE_STORE,
    AFTER_STORE
} from './plugin';

export default function (app, addModule) {
    const builder = {
        build({source, list}) {
            let {parser, store, plugin} = app.module;

            return Promise.all(
                list.filter(info => path.extname(info.dir) === '.md')
                .map(async info => {
                    let md = await fs.readFile(info.dir, 'utf-8');
                    let html = await parser.parse(md, {source, info});

                    let obj = {html, key: info.key};

                    obj = await plugin.exec(BEFORE_STORE, obj, {source, md, info});
                    await store.set('article', info.key, obj);
                    await plugin.exec(AFTER_STORE, obj, {source, md, info})
                })
            );
        },

        async buildAll(infos) {
            await Promise.all(infos.map(info => builder.build(info)));
        }
    };

    addModule('builder', {
        module: builder,
    })
}
