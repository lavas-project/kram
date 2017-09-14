/**
 * @file loader.js
 * @author tanglei (tanglei02@baidu.com)
 */

import {
    BEFORE_LOAD,
    AFTER_LOAD
} from './hook/stage';

import {each} from '../utils';

export default function (app) {
    const config = {};

    const loader = {
        get config() {
            return config;
        },

        get default() {
            return app.default.config.loader;
        },

        add(name, fn) {
            if (!config[name]) {
                config[name] = fn;
            }
        },

        get(name) {
            return config[name];
        },

        async loadOne(name, source) {
            app.logger.info(`load start: ${source.name}`);
            await this.getLoader(name)(source, app);
            app.logger.info(`load finish: ${source.name}`);
            return source;
        },

        async load() {
            let sources = app.config.sources;

            sources = await app.module.plugin.exec(BEFORE_LOAD, sources);
            await Promise.all(
                sources.map(source => this.loadOne(source.loader, source))
            );
            return await app.module.plugin.exec(AFTER_LOAD, sources);
        }
    };

    app.addModule('loader', () => loader);

    return () => {
        let loaders = app.config.loaders || loader.default;
        each(loaders, loader.add);
    };
};
