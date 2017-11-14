/**
 * @file builder
 * @author tanglei (tanglei02@baidu.com)
 */

import path from 'path';
import fs from 'fs-extra';

import {classify} from '../../utils';

import {
    BEFORE_STORE_DOC,
    AFTER_STORE_DOC,
    BEFORE_BUILD,
    AFTER_BUILD
} from '../hook/stage';

export default function (app) {
    const builder = {
        async build(sources) {
            let list = await app.module.dir.diff(sources);
            return await builder.buildDocs(list);
        },

        async buildDocs(list) {
            let hook = app.module.hook;
            // let {hook, logger} = app.module;

            let toBuild = list.filter(info => path.extname(info.dir) === '.md');

            // let toBuild = await hook.exec(BEFORE_BUILD, list);

            let {toSet = [], toDel = []} = classify(
                toBuild,
                ({type}) => (type === 'delete' ? 'toDel' : 'toSet')
            );

            await Promise.all([
                ...toSet.map(builder.setDoc),
                ...toDel.map(builder.deleteDoc)
            ]);

            toBuild = await hook.exec(AFTER_BUILD, toBuild);

            return toBuild;
        },

        async setDoc(info) {
            let {hook, parser, store} = app.module;
            let md = await fs.readFile(info.fullDir, 'utf-8');
            let html = await parser.parse(md, info);

            let obj = {html, dir: info.dir};

            obj = await hook.exec(BEFORE_STORE_DOC, obj, info);
            await store.set('article', info.dir, obj);
            await hook.exec(AFTER_STORE_DOC, obj, info);
        },

        async deleteDoc(info) {
            await app.module.store.delete('article', info.dir);
        }
    };

    app.addModule('builder', () => builder);
}
