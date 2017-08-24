/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

import defaultData from './default';
import * as modules from './lib/module';
import {merge, set, isFunction} from './lib/utils';


let moduleNames = Object.keys(modules);

export class Compiler {
    constructor(options = {}) {
        this.config = {};
        this.module = {};

        let inits = [];

        const addModule = (name, {config, module, init}) => {
            // config && set(this.config, name, config);
            config && Object.defineProperty(this.config, config.name || name, config);
            module && Object.defineProperty(this.module, module.name || name, module);
            // module && set(this.module, name, module);
            init && inits.push({props: options[name], fn: init});
        };

        moduleNames.forEach(key => modules[key](this, addModule));

        this.default = defaultData(this);
        options = isFunction(options) ? options(this) : options;
        merge([this.config, this.default.config, options], {ignore: moduleNames});

        inits.forEach(({fn, props}) => fn(props));
    }

    exec() {
        let {loader, dir, builder} = this.module;

        return loader.load()
            .then(dir.process)
            .then(builder.build);
    }

    get parse() {
        return this.module.parser.parse;
    }

    get logger() {
        return this.module.logger.logger;
    }

    get store() {
        let store = this.module.store;

        return {
            set: store.set,
            get: store.get,
            delete: store.delete
        };
    }
}
