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
} from '../plugin';

export default function (app, addModule) {
    const builder = {
        async build(list) {
            let {parser, store, plugin} = app.module;

            list = list.filter(info => path.extname(info.dir) === '.md');

            let toBuild = await plugin.exec(BEFORE_BUILD, list.slice(0), list);

            let {toUpdate = [], toDelete = []} = classify(toBuild, ({type}) => {
                return type === 'delete' ? 'toDelete' : 'toUpdate';
            });

            await Promise.all([
                ...toUpdate.map(async info => {
                    let md = await fs.readFile(info.fullDir, 'utf-8');
                    let html = await parser.parse(md, info);

                    let obj = {html, dir: info.dir};

                    obj = await plugin.exec(BEFORE_STORE, obj, info);

                    await store.set('article', info.dir, obj);
                    await plugin.exec(AFTER_STORE, obj, info);
                }),
                ...toDelete.map(async info => {
                    await store.delete('article', info.dir);
                })
            ]);

            await plugin.exec(AFTER_BUILD, toBuild);
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
