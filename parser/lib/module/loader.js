
// import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD
} from './plugin';


export default function (app) {
    app.config.loader = {};
    let LOADERS = {};

    function loader(name, repo) {
        app.logger.info(`load start: ${repo.name}`);

        await plugin(BEFORE_LOAD, repo);

        let result = await this.get(name)(repo, app);

        if (!result) {
            // @TODO: 生成{add: [xxxxxxxxx]}
        }

        result = await plugin(AFTER_LOAD, result, repo);

        app.logger.info(`load finish: ${repo.name}`);

        return result;
    }

    loader.config = function (loaders) {
        Object.keys(loaders).forEach(key => this.register(key, loaders[key]));
    };

    loader.register = function (name, fn) {
        if (app.config.loader[name]) {
            return;
        }

        app.config.loader[name] = fn;
    };

    loader.get = function (name) {
        return app.config.loader[name];
    }

    return loader;
};


