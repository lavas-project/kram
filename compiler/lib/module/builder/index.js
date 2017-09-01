/**
 * @file builder
 * @author tanglei (tanglei02@baidu.com)
 */

import {extname} from 'path';
import {readFile} from 'fs-extra';

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
            let list = await this.getBuildRequiredInfos(sources);
            return await this.buildDocs(list);
        },

        get getBuildRequiredInfos() {
            return app.module.dir.process;
        },

        async buildDocs(list) {
            let hook = app.module.hook;

            list = list.filter(info => extname(info.dir) === '.md');

            let toBuild = await hook.exec(BEFORE_BUILD, list);

            let {toSet = [], toDel = []} = classify(toBuild, ({type}) => {
                return type === 'delete' ? 'toDel' : 'toSet';
            });

            await Promise.all([
                ...toSet.map(this.setDoc),
                ...toDel.map(this.deleteDoc)
            ]);

            return await hook.exec(AFTER_BUILD, toBuild);
        },

        async setDoc(info) {
            let hook = app.module.hook;

            let md = await readFile(info.fullDir, 'utf-8');
            let html = await parser.parse(md, info);

            let obj = {html, dir: info.dir};

            obj = await hook.exec(BEFORE_STORE, obj, info);
            await store.set('article', info.dir, obj);
            await hook.exec(AFTER_STORE, obj, info);
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
