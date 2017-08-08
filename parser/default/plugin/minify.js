/**
 * @file html 压缩插件
 * @author tanglei (tanglei02@baidu.com)
 */

import minifier from 'html-minifier';
const minifyEngine = minifier.minify;


export default class Minify {
    constructor({
        priority,
        name = 'Minify'
    } = {}) {
        this.name = name;
        this.priority = priority;
    }

    apply(on, kram) {
        on('afterRender', function (html) {
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
};
