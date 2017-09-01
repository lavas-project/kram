/**
 * @file builder
 * @author tanglei (tanglei02@baidu.com)
 */

import path from 'path';
import fs from 'fs-extra';

import {classify} from '../../utils';

import {
    BEFORE_STORE,
    AFTER_STORE,
    BEFORE_BUILD,
    AFTER_BUILD
} from '../hook/stage';

export default function (app) {
    const builder = {
        async build(sources) {

        },

        async getBuildRequiredInfos(sources) {

        },

        async buildDoc(list) {
            let {parser, store, plugin} = app.module;

            list = list.filter(info => path.extname(info.dir) === '.md');

            let toBuild = await plugin.exec(BEFORE_BUILD, list.slice(0), list);

            let {toSet = [], toDel = []} = classify(toBuild, ({type}) => {
                return type === 'delete' ? 'toDel' : 'toSet';
            });

            await Promise.all([
                ...toSet.map(builder.setDoc),
                ...toDel.map(builder.deleteDoc)
            ]);

            await plugin.exec(AFTER_BUILD, toBuild);
        },

        async setDoc(info) {
            let plugin = app.module.plugin;

            let md = await fs.readFile(info.fullDir, 'utf-8');
            let html = await parser.parse(md, info);

            let obj = {html, dir: info.dir};

            obj = await plugin.exec(BEFORE_STORE, obj, info);
            await store.set('article', info.dir, obj);
            await plugin.exec(AFTER_STORE, obj, info);
        },

        async deleteDoc(info) {
            await app.module.store.delete('article', info.dir);
        }
    };

    return {
        name: 'builder',
        module: {
            get() {
                return builder;
            }
        }
    };
}
