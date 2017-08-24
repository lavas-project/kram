
// import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD,
    BEFORE_LOAD_ALL,
    AFTER_LOAD_ALL
} from './plugin';

import {each, getPrototype, isEmptyObject} from '../utils';
import path from 'path';
// import glob from 'glob';
// import crypto from 'crypto';


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
        async load(name, source) {
            app.logger.info(`load start: ${source.name}`);

            let isContinue = await app.module.plugin.exec(BEFORE_LOAD, true, source);

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

        async loadAll() {
            let sources = app.config.sources;

            let sourcesToLoad = await app.module.plugin.exec(BEFORE_LOAD_ALL, sources.slice(0), sources);

            let loadedSources = await Promise.all(
                sourcesToLoad.map(
                    async source => await loader.load(source.loader, source)
                )
            );

            loadedSources = loadedSources.filter(source => source !== false);

            return await app.module.plugin.exec(AFTER_LOAD_ALL, loadedSources, sources);
        }
    };

    addModule('loader', {
        config: config,
        module: loader,
        init(loaders = loader.default) {
            each(loaders, loader.addLoader);
        }
    });
};
