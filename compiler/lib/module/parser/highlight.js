/**
 * @file highlight.js 代码高亮相关
 * @author tanglei (tanglei02@baidu.com)
 */

import hljs from 'highlight.js';
import {isObject, each, encodeTag} from '../../utils';

export default function (app, addModule) {
    const config = {
        options: {},
        languages: {}
    };

    const hl = {
        get config() {
            return config;
        },
        get default() {
            return app.default.config.highlight;
        },
        setOptions(opts) {
            if (!opts) {
                return this;
            }
            config.options = Object.assign({}, config.options, opts);
            hljs.configure(config.options);
        },
        addLanguage(...args) {
            if (args.length === 1 && isObject(args[0])) {
                // let obj = args[0];
                return each(args[0], this.addLanguage.bind(this));
                // return Object.keys(obj).forEach(name => this.addLanguage(name, obj[name]));
            }

            let [name, fn] = args;

            if (app.config.highlight.languages[name]) {
                return;
            }

            config.languages[name] = fn;
            hljs.registerLanguage(name, fn);
        },
        exec(code, language) {
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

    addModule('highlight', {
        config: config,
        module: hl,
        init({options = hl.default.options, languages = hl.default.languages} = {}) {
            hl.setOptions(options);
            hl.addLanguage(languages);
        },
        mount: {
            name: 'highlight',
            get() {
                return hl.exec;
            }
        }
    });
}
