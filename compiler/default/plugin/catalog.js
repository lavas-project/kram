/**
 * @file 生成文章目录结构插件
 */
import path from 'path';

export default class Catalog {
    constructor({priority} = {}) {
        this.priority = priority;
    }

    apply(on, app) {
        let AFTER_STORE = app.module.hook.STAGES.AFTER_STORE;

        // on(AFTER_STORE, (obj, {dir}) => {
        //     let metaDirs = app.dirs.filter(({dir}) => path.basename(dir) === 'meta.json');
        // }, this.priority);
    }
}
