/**
 * @file html 压缩插件
 * @author tanglei (tanglei02@baidu.com)
 */

import minifier from 'html-minifier';
const minifyEngine = minifier.minify;


export default class Minify {
    constructor({priority} = {}) {
        this.priority = priority;
    }

    apply(on, app) {
        on(app.module.hook.STAGES.AFTER_PARSE, function (html) {
            try {
                return minifyEngine(html, {
                    collapseWhitespace: true,
                    minifyCSS: true
                });
            }
            catch (e) {
                return html;
            }
        }, this.priority);
    }
}
