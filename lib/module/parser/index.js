/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
import {
    get,
    subset,
    flatten
} from '../../utils';
import {
    BEFORE_PARSE,
    AFTER_PARSE,
    CREATE_DOC_STORE_OBJECT
} from '../hook/stage';


export default function (app) {
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

        /**
         * 设置 marked 的参数
         *
         * @param {Object} val marked 编译参数
         */
        setOptions(val = {}) {
            let otherOptions = subset(val, ['renderer'], 'ignore');
            Object.assign(options, otherOptions);
            Object.assign(markedOptions, otherOptions);

            if (val.renderer) {
                parser.setRenderer(val.renderer);
            }
        },

        /**
         * 设置 renderer
         *
         * @param {...*} args 将参数透传到 renderer 模块
         */
        setRenderer(...args) {
            app.module.renderer.setRenderer(...args);
        },

        /**
         * 编译单篇文档
         *
         * @param {Object} fileInfo 文档信息
         * @return {Object} 解析好的文档信息
         */
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

                storeInfo = await hook.exec(CREATE_DOC_STORE_OBJECT, storeInfo);
                return storeInfo;
            }
            catch (e) {
                app.logger.info(e);
            }
        },

        /**
         * 编译单篇/多篇文档
         *
         * @param {Object|Array} fileInfos 文档信息
         * @return {Object|Array} 解析好的文档信息
         */
        async parse(fileInfos) {
            if (Array.isArray(fileInfos)) {
                if (fileInfos.length) {
                    return Promise.all(fileInfos.map(parser.parseOne));
                }

                return [];
            }

            return parser.parseOne(fileInfos);
        },

        /**
         * 存储编译好的文档，删除被标记为‘remove’的文档
         *
         * @param {...Array} args 编译好的文档信息
         */
        async store(...args) {
            let infos = flatten(args);

            await Promise.all(
                infos.filter(info => !!info)
                .map(async info => {
                    if (info.type === 'remove') {
                        await app.store.remove('doc', info.path);
                    }
                    else {
                        await app.store.set('doc', info.path, info);
                    }
                })
            );
        },

        /**
         * 文档的编译 + 存储
         *
         * @param {Array} change 有变化的文档信息
         * @param {Array} remove 删除的文档信息
         */
        async parseAndStore(change, remove) {
            let docInfos = await parser.parse(change);
            await parser.store(docInfos, remove);
        },

        /**
         * 获取编译好的文档信息
         *
         * @param {string} path 文档路径
         * @return {Object|undefined} 文档信息
         */
        get(path) {
            return app.store.get('doc', path);
        }
    };

    app.addModule('parser', () => parser);

    return () => {
        let renderer = Object.assign({}, parser.default.renderer, get(app.config.parser, 'renderer'));
        parser.setOptions(Object.assign({}, parser.default, app.config.parser, {renderer}));
    };
}
