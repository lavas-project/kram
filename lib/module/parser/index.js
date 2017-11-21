/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
// import path from 'path';
import {
    // set,
    get,
    subset
    // isObject,
    // getPrototype
} from '../../utils';
import {
    BEFORE_PARSE,
    AFTER_PARSE,
    CREATE_DOC_STORE_OBJECT
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
            let otherOptions = subset(val, ['renderer'], 'ignore');
            Object.assign(options, otherOptions);
            Object.assign(markedOptions, otherOptions);

            if (val.renderer) {
                parser.setRenderer(val.renderer);
            }
        },

        setRenderer(...args) {
            app.module.renderer.setRenderer(...args);
        },

        async parseOne(fileInfo) {
            let {renderer, hook} = app.module;

            try {
                let md = await hook.exec(BEFORE_PARSE, fileInfo.file, fileInfo);
                renderer.hookOptions = fileInfo;

                let html = marked(md, markedOptions);

                html = await hook.exec(AFTER_PARSE, html, fileInfo);

                let storeInfo = {
                    path: fileInfo.path,
                    html: html
                };
                // let storeInfo = Object.assign({}, fileInfo, {html});

                storeInfo = await hook.exec(CREATE_DOC_STORE_OBJECT, storeInfo);
                return storeInfo;
            }
            catch (e) {
                app.logger.info(e);
            }
        },

        async parse(fileInfos) {
            if (Array.isArray(fileInfos)) {
                if (fileInfos.length) {
                    return Promise.all(fileInfos.map(parser.parseOne));
                }

                return [];
            }

            return parser.parseOne(fileInfos);
        }
    };

    app.addModule('parser', () => parser);

    return () => {
        let renderer = Object.assign({}, parser.default.renderer, get(app.config.parser, 'renderer'));
        parser.setOptions(Object.assign({}, parser.default, app.config.parser, {renderer}));
    };
}
