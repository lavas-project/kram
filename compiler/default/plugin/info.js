/**
 * @file 获取文章信息
 * @author tanglei (tanglei02@baidu.com)
 */

export default class Info {
    constructor({priority} = {}) {
        this.priority = priority;
    }

    apply(on, kram) {
        on('beforeRender', function (md, options) {
            // md = md.replace()
        });
    }
}