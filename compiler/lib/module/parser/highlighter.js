/**
 * @file highlight.js 代码高亮相关
 * @author tanglei (tanglei02@baidu.com)
 */

import hljs from 'highlight.js';
import {isObject, each, encodeTag} from '../../utils';

export default function (app) {
    const config = {
        options: {},
        languages: {}
    };

    const highlighter = {
        get config() {
            return config;
        },
        get default() {
            return app.default.config.highlight;
        },
        setOptions(opts) {
            if (!opts) {
                return;
            }
            config.options = Object.assign(config.options, opts);
            hljs.configure(config.options);
        },
        addLanguage(...args) {
            if (args.length === 1 && isObject(args[0])) {
                return each(args[0], highlighter.addLanguage);
            }

            let [name, fn] = args;

            if (app.config.highlight.languages[name]) {
                return;
            }

            config.languages[name] = fn;
            hljs.registerLanguage(name, fn);
        },
        highlight(code, language) {
            if (hljs.getLanguage(language)) {
                try {
                    return hljs.highlight(language, code).value;
                }
                catch (e) {
                    // auto 的染色都是有问题的 还不如不染了
                    app.logger.error(`Error in highlight lang=${language}:`);
                }
            }

            return encodeTag(code);
        }
    };

    return {
        name: 'highlighter',
        config: {
            get() {
                return config;
            }
        },
        module: {
            get() {
                return highlighter;
            }
        },
        init({options = highlighter.default.options, languages = highlighter.default.languages} = {}) {
            highlighter.setOptions(options);
            highlighter.addLanguage(languages);
        }
    };
}
