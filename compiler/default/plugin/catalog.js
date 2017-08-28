/**
 * @file 生成文章目录结构插件
 */

export default class Catalog {
    constructor({priority} = {}) {
        this.priority = priority;
    }

    apply(on, app) {
        // let {BEFORE_STORE} = app.module.plugin.STAGES;
        let BEFORE_STORE = app.module.plugin.STAGES.BEFORE_STORE;

        on(BEFORE_STORE, (obj, {dir}) => {
            
        }, this.priority);
    }
}
