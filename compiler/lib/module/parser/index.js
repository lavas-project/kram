/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
import {
    set,
    get,
    merge,
    isObject,
    getPrototype
} from '../../utils';
import {
    BEFORE_PARSE,
    AFTER_PARSE
} from '../hook/stage';


export default function (app, addModule) {
    const config = {
        get renderer() {
            return app.module.renderer.rendererMethods;
        }
    };

    const markedOptions = {
        get renderer() {
            return app.module.renderer.renderer;
        }
    };

    const parser = {
        get config() {
            return config;
        },

        get default() {
            return app.default.config.parser;
        },

        setOptions(options) {
            merge(config, options, {ignore: 'renderer'});

            if (get(options, 'renderer')) {
                app.module.renderer.setRenderer(options.renderer);
            }
        },

        get setRenderer() {
            return app.module.renderer.setRenderer;
        },

        async parse(md, options) {
            let {renderer, hook} = app.module;

            try {
                md = await hook.exec(BEFORE_PARSE, md, options);

                renderer.setPluginOptions(options);
                let html = marked(md, markedOptions);

                html = await hook.exec(AFTER_PARSE, html, options);
                return html;
            }
            catch (e) {
                app.logger.info(e);
            }
        }
    };

    return {
        name: 'parser',
        // config: {
        //     get() {
        //         return config;
        //     }
        // },
        module: {
            get() {
                return parser;
            }
        },
        init(options) {
            let renderer = Object.assign({}, parser.default.renderer, get(options, 'renderer'));
            parser.setOptions(Object.assign({}, parser.default, options, {renderer}));
        }
    };
}
