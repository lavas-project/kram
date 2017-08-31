/**
 * @file stylus 解析
 * @author tanglei (tanglei02@baidu.com)
 */

import stylusEngine from 'stylus';

export default class Stylus {
    constructor({priority} = {}) {
        this.priority = priority;
    }

    apply(on, app) {
        on(app.module.hook.STAGES.AFTER_PARSE, function (md) {
            return md.replace(
                /<style([\s\S]*?)lang="stylus"([\s\S]*?)>([\s\S]*?)<\/style>/mg,
                (str, attr1, attr2, css) => {
                    if (empty(css)) {
                        return '';
                    }

                    try {
                        css = reomveExtraIndent(css);
                        css = stylusEngine.render(css);
                        return `<style${attr1}${attr2}>${css}</style>`;
                    }
                    catch (e) {
                        app.logger(e);
                        return '';
                    }
                }
            );
        }, this.priority);
    }
}

function empty(css) {
    return css.split('\n').every(str => /^[ ]*$/.test(str));
}

function reomveExtraIndent(css) {
    let arr = css
        .replace(/\t/mg, '    ')
        .split('\n')
        .filter(str => !/^[ ]*$/.test(str));

    let spaceLen = arr.reduce((res, str) => Math.min(res, indent(str)), css.length);

    return arr.map(str => str.slice(spaceLen)).join('\n');
}

function indent(str) {
    let max = str.length;
    for (let i = 0; i < max; i++) {
        if (str[i] !== ' ') {
            return i;
        }
    }
    return max;
}
