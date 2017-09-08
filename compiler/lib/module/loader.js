
// import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD,
    BEFORE_LOAD_ALL,
    AFTER_LOAD_ALL
} from './hook/stage';

import {each, getPrototype, isEmptyObject} from '../utils';
import path from 'path';

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

            await loader.getLoader(name)(source, app);

            app.logger.info(`load finish: ${source.name}`);
            return source;
        },

        async load() {
            let sources = app.config.sources;

            let sourcesToLoad = await app.module.plugin.exec(BEFORE_LOAD, sources);

            let loadedSources = await Promise.all(
                sourcesToLoad.map(
                    async source => await loader.loadOne(source.loader, source)
                )
            );

            return await app.module.plugin.exec(AFTER_LOAD, loadedSources);
        }
    };

    app.addModule('loader', () => loader);

    return () => {
        let loaders = app.config.loaders || loader.default;
        each(loaders, loader.add);
    };
};
