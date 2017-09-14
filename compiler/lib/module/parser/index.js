/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
import {
    set,
    get,
    subset,
    isObject,
    getPrototype
} from '../../utils';
import {
    BEFORE_PARSE,
    AFTER_PARSE
} from '../hook/stage';


export default function (app, addModule) {
    const options = {
        get renderer() {
            return app.module.renderer.methods;
        }
    };

    const markedOptions = {
        get renderer() {
            return app.module.renderer.renderer;
        }
    };

    const parser = {
        get default() {
            return app.default.config.parser;
        },

        get options() {
            return options;
        },

        setOptions(val = {}) {
            let otherOptions = subset(val, 'renderer');

            Object.assign(options, otherOptions);
            Object.assign(markedOptions, otherOptions);

            if (val.renderer) {
                this.setRenderer(val.renderer);
            }
        },

        setRenderer(...args) {
            app.module.renderer.setRenderer(...args);
        },

        async parse(md, options) {
            let {renderer, hook} = app.module;

            try {
                md = await hook.exec(BEFORE_PARSE, md, options);

                renderer.hookOptions = options;
                let html = marked(md, markedOptions);

                html = await hook.exec(AFTER_PARSE, html, options);
                return html;
            }
            catch (e) {
                app.logger.info(e);
            }
        }
    };

    app.addModule('parser', () => parser);

    return () => {
        let renderer = Object.assign({}, parser.default.renderer, get(app.config.parser, 'renderer'));
        parser.setOptions(Object.assign({}, parser.default, app.config.parser, {renderer}));
    };
}
