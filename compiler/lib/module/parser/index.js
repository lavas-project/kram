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
} from '../plugin';


export default function (app, addModule) {
    const config = {};
    let markedOptions = {};

    const parser = {
        get config() {
            return config;
        },
        get default() {
            return app.default.config.parser;
        },
        setOptions(options) {
            merge(config, options, {ignore: 'renderer'});

            if (options.renderer) {
                this.setRenderer(options.renderer);
            }
            else {
                markedOptions = getMarkedOptions(config, markedOptions.renderer);
            }
        },
        setRenderer(renderer) {
            if (isObject(renderer)) {
                renderer = Object.assign({}, this.default.renderer, renderer);
            }

            merge(config, {renderer});
            markedOptions = getMarkedOptions(config, markedOptions.renderer);
        },
        async parse(md, options) {
            try {
                md = await app.module.plugin.exec(BEFORE_PARSE, md, options);
                let html = marked(md, markedOptions);
                html = await app.module.plugin.exec(AFTER_PARSE, html, options);
                return html;
            }
            catch (e) {
                app.logger.info(e);
            }
        }
    };

    return {
        name: 'parser',
        config: {
            get() {
                return config;
            }
        },
        module: {
            get() {
                return parser;
            }
        },
        init(options) {
            parser.setOptions(Object.assign({}, parser.default, options));
        }
    };
}

function getMarkedOptions(options, oldRenderer) {
    let result = merge({}, options, {ignore: 'renderer'});

    switch (getPrototype(options.renderer)) {
        case 'Object':
            let renderer = new marked.Renderer();
            merge(renderer, options.renderer);
            result.renderer = renderer;
            break;

        case 'Function':
            result.renderer = options.renderer;
            break;

        default:
            result.renderer = oldRenderer;
    }

    return result;
}
