/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
// import {locals} from '../../share/locals';
import {get, merge, isObject} from '../../utils';
import {
    BEFORE_RENDER,
    AFTER_RENDER
} from '../plugin';


export async function (app) {
    app.config.renderer = {};

    async function renderer(md, options) {
        try {
            md = await app.plugin(BEFORE_RENDER, md, options);
            let html = marked(md, app.config.renderer);
            html = await app.plugin(AFTER_RENDER, html, options);
            return html;
        }
        catch (e) {
            app.logger.info(e);
        }
    };

    renderer.config = function (conf) {
        app.config.renderer = Object.assign(
            {},
            app.config.default.renderer,
            app.config.renderer,
            conf
        );

        if (conf.renderer) {
            this.setRenderer(conf.renderer);
        }
    };

    renderer.setRenderer = function (renderer) {
        if (isObject(renderer)) {
            renderer = merge(app.config.default.renderer.renderer, renderer);
        }

        app.config.renderer.renderer = renderer;
    };

    return renderer;
}
