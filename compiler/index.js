/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

// import defaultConf from './default';
// import {configure} from './lib/configure';
// import {locals} from './lib/share/locals';

// export {load} from './lib/load';
// export {build} from './lib/build';
// export {parse} from './lib/module/renderer/marked';

// export {configure as configure};
// export {locals as locals};

// export function init(options) {
//     let conf = Object.assign({}, locals.default, options);
//     configure(conf);
// }
import defaultData from './default';
import modules from './lib/module';
import {merge} from './lib/utils';


let moduleKeys = Object.keys(modules);
let ignoreKeys = moduleKeys.concat('logger', 'default');

export class Compiler {
    constructor(options = {}) {
        this.config = {};

        moduleKeys.forEach(key => {
            this[key] = modules[key](this);
        });

        this.default = defaultData(this);

        if (typeof options === 'function') {
            options = options(this);
        }

        this.logger = options.logger || this.default.config.logger;

        let normalOptions = merge({}, options, {ignore: ignoreKeys});
        let defaultNormalOptions = merge({}, this.default.config, {ignore: ignoreKeys});
        Object.assign(this.config, defaultNormalOptions, normalOptions);

        moduleKeys
            .filter(key => typeof this[key].init === 'function')
            .forEach(key => this[key].init(options[key]));
    }

    async load(name, repo) {
        return await this.loader(name, repo);
    }

    // async loadAll() {
    //     let repos = this.config.repo;

    //     let results = await Promise.all(
    //         repos.map(async (key, repo) => await this.loader(key, repo))
    //     );

    //     return results.reduce((res, result) => {
    //         res
    //     }, {update: [], delete: []})
    // }

    async build({update, delete}) {

    }
    // build(list) {
    //     list await list;
    //     switch (getPrototype(list)) {
    //         case 'Object':
    //             return buildRepo(list);
    //         case 'Undefined':
    //             list = toList(locals.repos);
    //         default:
    //             return list.map(async repo => await buildRepo(repo));
    //     }
    // }

    // parse() {

    // }

    async exec() {

    }

    // get() {

    // }
}

function toList(repos) {
    return Object.keys(repos).map(name => Object.assign({name}, repos[name]));
}
