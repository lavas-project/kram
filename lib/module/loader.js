/**
 * @file loader.js
 * @author tanglei (tanglei02@baidu.com)
 */

import {
    BEFORE_LOAD,
    AFTER_LOAD
} from './hook/stage';

import {each, first} from '../utils';

export default function (app) {
    const config = {};

    const loader = {
        get config() {
            return config;
        },

        get default() {
            return app.default.config.loader;
        },

        /**
         * 添加加载器
         *
         * @param {string} name 加载器名称
         * @param {Function} fn 加载方法
         */
        add(name, fn) {
            if (!config[name]) {
                config[name] = fn;
            }
        },

        get(name) {
            return config[name];
        },

        /**
         * 加载单个资源
         *
         * @param {Object} source 资源配置
         * @return {Object} 资源配置信息
         */
        async loadOne(source) {
            app.logger.info(`[kram] load start: ${source.name}`);
            await loader.get(source.loader)(source, app);
            app.logger.info(`[kram] load finish: ${source.name}`);
            return source;
        },

        /**
         * 加载单个/多个资源
         *
         * @param {string=} sourceName 资源名称，默认为空时加载全部资源
         * @return {Promise} promise 对象
         */
        async load(sourceName) {
            let sources;

            if (sourceName) {
                let source = first(app.config.sources, source => source.name === sourceName);
                sources = [source];
            }
            else {
                sources = app.config.sources;
            }

            sources = await app.module.plugin.exec(BEFORE_LOAD, sources);
            await Promise.all(
                sources.map(source => loader.loadOne(source))
            );
            return await app.module.plugin.exec(AFTER_LOAD, sources);
        }
    };

    // 注册 loader 模块
    app.addModule('loader', () => loader);

    // loader 初始化函数
    return () => {
        let loaders = Object.assign({}, loader.default, app.config.loader);
        each(loaders, loader.add);
    };
}
