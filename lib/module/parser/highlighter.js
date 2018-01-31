/**
 * @file highlight.js 代码高亮相关
 * @author tanglei (tanglei02@baidu.com)
 */

import hljs from 'highlight.js';
import {is, each, encodeTag} from '../../utils';

export default function (app) {
    let options;
    let languages = {};

    const hler = {
        get default() {
            return app.default.config.highlight;
        },

        set options(val) {
            if (!val) {
                return;
            }

            options = Object.assign({}, options, val);
            hljs.configure(options);
        },

        get options() {
            return options;
        },

        /**
         * 添加语言
         *
         * @param {...Array} args (name, fn) Or ({name: fn})
         * @return {undefined} undefined
         */
        addLanguage(...args) {
            if (args.length === 1 && is(Object, args[0])) {
                return each(args[0], hler.addLanguage);
            }

            let [name, fn] = args;

            if (languages[name]) {
                return;
            }

            languages[name] = fn;
            hljs.registerLanguage(name, fn);
        },

        get languages() {
            return languages;
        },

        /**
         * 对 highlight.js 的高亮方法做个封装
         *
         * @param {string} code 代码块
         * @param {string} language 高亮的语言
         * @return {string} 高亮好的代码块
         */
        highlight(code, language) {
            if (hljs.getLanguage(language)) {
                try {
                    return hljs.highlight(language, code).value;
                }
                catch (e) {
                    // auto 的染色都是有问题的 还不如不染了
                    app.logger.error(`[kram][highlight] error in highlight lang=${language}:`);
                }
            }

            return encodeTag(code);
        }
    };

    app.addModule('highlighter', () => hler);

    return () => {
        let {options, languages} = Object.assign({}, hler.default, app.config.highlight);
        hler.options = options;
        hler.addLanguage(languages);
    };
}
