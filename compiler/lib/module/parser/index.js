/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
// import {locals} from '../../share/locals';
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


export default function (app) {
    app.config.parser = {};

    let markedOpts;

    let conf = app.config.parser;
    let defaultConf;

    async function parser(md, options) {
        try {
            md = await app.plugin(BEFORE_PARSE, md, options);
            let html = marked(md, conf);
            html = await app.plugin(AFTER_PARSE, html, options);
            return html;
        }
        catch (e) {
            app.logger.info(e);
        }
    };

    parser.init = function (options) {
        defaultConf = app.default.config.parser;
        this.setOptions(Object.assign({}, defaultConf, options));
    };

    parser.setOptions = function (options) {
        Object.assign(conf, options);

        if (options.renderer) {
            this.setRenderer(options.renderer);
        }
        else {
            markedOpts = getMarkedOptions(options, markedOpts.renderer);
        }
    };

    parser.setRenderer = function (renderer) {
        if (isObject(renderer)) {
            conf.renderer = Object.assign({}, defaultConf.renderer, renderer);
        }

        Object.assign(conf, {renderer});
        markedOpts = getMarkedOptions(conf);
    };

    return parser;
}

function getMarkedOptions(options, oldRenderer) {
    let result = Object
        .keys(options)
        .filter(key => key !== 'renderer')
        .reduce((res, key) => set(res, key, options[key]), {});

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