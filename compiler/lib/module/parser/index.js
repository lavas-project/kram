/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
// import {locals} from '../../share/locals';
import {get, merge, isObject} from '../../utils';
import {
    BEFORE_PARSE,
    AFTER_PARSE
} from '../plugin';


export async function (app) {
    app.config.parser = {};

    async function parser(md, options) {
        try {
            md = await app.plugin(BEFORE_PARSE, md, options);
            let html = marked(md, app.config.parser);
            html = await app.plugin(AFTER_PARSE, html, options);
            return html;
        }
        catch (e) {
            app.logger.info(e);
        }
    };

    parser.config = function (conf) {
        app.config.parser = Object.assign(
            {},
            app.default.config.parser,
            app.config.parser,
            conf
        );

        if (conf.renderer) {
            this.setRenderer(conf.renderer);
        }
    };

    parser.setRenderer = function (renderer) {
        if (isObject(renderer)) {
            renderer = merge(app.default.config.parser.renderer, renderer);
        }

        app.config.parser.renderer = renderer;
    };

    return parser;
}
