
// import {locals} from '../share/locals';

import {
    BEFORE_LOAD,
    AFTER_LOAD
} from './plugin';

import {each} from '../utils';
import path from 'path';
import glob from 'glob';


export default function (app, addModule) {
    const config = {};
    const md5map = {};

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
        async exec(name, repo) {
            app.logger.info(`load start: ${repo.name}`);

            await app.module.plugin.exec(BEFORE_LOAD, repo);

            result = await loader.getLoader(name)(repo, app);
            // let dispDir = path.resolve(app.config.baseDir, '_store', name);


            // await fs.ensureDir(dispDir);
            // if (!result) {
            //     // @TODO: 生成{add: [xxxxxxxxx]}
            // }

            result = await app.module.plugin.exec(AFTER_LOAD, result, repo);

            app.logger.info(`load finish: ${repo.name}`);

            return result;
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

function getDirs(baseDir, ext = '') {
    return new Promise((resolve, reject) => {
        glob(path.resolve(baseDir, '**/*' + ext), (err, dirs) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(dirs);
            }
        });
    });
}

function diff() {

}

