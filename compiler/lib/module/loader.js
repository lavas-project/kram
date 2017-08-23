
// import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD
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

            await app.module.plugin.exec(BEFORE_LOAD, source);

            let info = await loader.getLoader(name)(source, app);

            info = await app.module.plugin.exec(AFTER_LOAD, info, source);

            if (info === false) {
                app.logger.info(`load cancel: ${source.name}`);
                return false;
            }

            app.logger.info(`load finish: ${source.name}`);
            return source;
        },

        async loadAll() {
            let sources = await Promise.all(
                app.config.sources.map(
                    async source => await loader.load(source.loader, source)
                )
            );

            return sources.filter(source => source !== false);
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
