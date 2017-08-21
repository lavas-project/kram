
// import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD
} from './plugin';


export default function (app, addModule) {
    const config = {};

    const module = {
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
        async exec(name, repo) {
            app.logger.info(`load start: ${repo.name}`);

            await app.module.plugin.exec(BEFORE_LOAD, repo);

            let result = await module.getLoader(name)(repo, app);

            if (!result) {
                // @TODO: 生成{add: [xxxxxxxxx]}
            }

            result = await app.module.plugin.exec(AFTER_LOAD, result, repo);

            app.logger.info(`load finish: ${repo.name}`);

            return result;
        }
    };

    addModule('loader', {
        config: config,
        module: module,
        init(loaders = module.default) {
            Object.keys(loaders).forEach(name => module.addLoader(name, loaders[name]));
        }
    });
};


