/**
 * @file highlight.js 代码高亮相关
 * @author tanglei (tanglei02@baidu.com)
 */

import hljs from 'highlight.js';
import {isObject, encodeTag} from '../../utils';

export default function (app) {
    app.config.highlight = {
        options: {},
        languages: {}
    };

    function highlight(code, language) {
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

    highlight.init = function (
        {
            options = app.default.config.highlight.options,
            languages = app.default.config.highlight.languages
        } = {}
    ) {
        this.setOptions(options);
        this.register(languages);
    };

    highlight.setOptions = function (opts) {
        if (!opts) {
            return;
        }
        app.config.highlight.options = Object.assign(
            {},
            app.config.highlight.options,
            opts
        );
        hljs.configure(app.config.highlight.options);
    };

    highlight.register = function (...args) {
        if (args.length === 1 && isObject(args[0])) {
            let obj = args[0];
            return Object.keys(obj).forEach(key => this.register(key, obj[key]));
        }

        let [name, fn] = args;

        if (app.config.highlight.languages[name]) {
            return;
        }

        app.config.highlight.languages[name] = fn;
        hljs.registerLanguage(name, fn);
    };

    return highlight;
}
