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
import {merge, set, isFunction} from './lib/utils';


let moduleNames = Object.keys(modules);

export class Compiler {
    constructor(options = {}) {
        this.config = {};
        this.module = {};

        let inits = [];

        const addModule = (name, {config, module, init}) => {
            config && set(this.config, name, config);
            module && set(this.module, name, module);
            init && inits.push({props: options[name], fn: init});
        };

        moduleNames.forEach(key => modules[key](this, addModule));

        this.default = defaultData(this);
        options = isFunction(options) ? options(this) : options;
        merge([this.config, this.default.config, options], {ignore: moduleNames});

        inits.forEach(({fn, props}) => fn(props));
    }

    async exec() {

    }

    get parse() {
        return this.module.parser.exec;
    }

    get logger() {
        return this.module.logger.logger;
    }
}

function toList(repos) {
    return Object.keys(repos).map(name => Object.assign({name}, repos[name]));
}