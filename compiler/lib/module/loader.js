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

        add(name, fn) {
            if (!config[name]) {
                config[name] = fn;
            }
        },

        get(name) {
            return config[name];
        },

        async loadOne(source) {
            app.logger.info(`[kram] load start: ${source.name}`);
            await loader.get(source.loader)(source, app);
            app.logger.info(`[kram] load finish: ${source.name}`);
            return source;
        },

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

    app.addModule('loader', () => loader);

    return () => {
        // app.config.sources = app.config.sources.map(source => {
        //     if (!source.to) {
        //         source.to = path.resolve(app.config.baseDir, source.name);
        //     }
        //     else if (!isSubpath(source.to, app.config.baseDir)) {
        //         throw new Error('source.to should be subpath of the baseDir');
        //     }
        //     return source;
        // });

        let loaders = app.config.loaders || loader.default;
        each(loaders, loader.add);
    };
}
