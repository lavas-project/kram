
// import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD,
    BEFORE_LOAD_ALL,
    AFTER_LOAD_ALL
} from './hook/stage';

import {each, getPrototype, isEmptyObject} from '../utils';
import path from 'path';

export default function (app, addModule) {
    const config = {};

    const loader = {
        get config() {
            return config;
        },
        get default() {
            return app.default.config.loader;
        },
        addLoader(name, fn) {
            if (config[name]) {
                return;
            }

            config[name] = fn;
        },
        getLoader(name) {
            return config[name];
        },
        async loadOne(name, source) {
            app.logger.info(`load start: ${source.name}`);

            let isContinue = await app.module.hook.exec(BEFORE_LOAD, true, source);

            if (!isContinue) {
                app.logger.info(`load cancel: ${source.name}`);
                return false;
            }

            isContinue = await loader.getLoader(name)(source, app);
            isContinue = await app.module.plugin.exec(AFTER_LOAD, true, source);

            if (!isContinue) {
                app.logger.info(`load cancel: ${source.name}`);
                return false;
            }

            app.logger.info(`load finish: ${source.name}`);
            return source;
        },

        async load() {
            let sources = app.config.sources;

            let sourcesToLoad = await app.module.plugin.exec(BEFORE_LOAD_ALL, sources.slice(0), sources);

            let loadedSources = await Promise.all(
                sourcesToLoad.map(
                    async source => await loader.loadOne(source.loader, source)
                )
            );

            loadedSources = loadedSources.filter(source => source !== false);

            return await app.module.plugin.exec(AFTER_LOAD_ALL, loadedSources, sources);
        }
    };

    return {
        name: 'loader',
        // config: {
        //     get() {
        //         return config;
        //     }
        // },
        module: {
            get() {
                return loader;
            }
        },
        init(loaders = loader.default) {
            each(loaders, loader.addLoader);
        }
    };
};
