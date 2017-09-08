/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

import defaultData from './default';
import * as modules from './lib/module';
import {merge, set, isFunction} from './lib/utils';


let moduleNames = Object.keys(modules);

export class Compiler {
    constructor(config = {}) {
        this.module = {};

        let inits = moduleNames.map(key => modules[key](this)).filter(init => !!init);

        this.default = defaultData(this);
        this.config = isFunction(config) ? config(this) : config;

        inits.forEach(fn => fn());
    }

    addModule(name, module) {
        if (isFunction(module)) {
            module = {
                get: module
            };
        }

        Object.defineProperty(this.module, name, module);
    }

    exec() {
        let {loader, builder} = this.module;
        return loader.load().then(builder.build);
    }

    get parse() {
        return this.module.parser.parse;
    }

    get logger() {
        return this.module.logger;
    }

    get store() {
        let store = this.module.store;

        return {
            set: store.set,
            get: store.get,
            delete: store.delete
        };
    }

    get dirs() {
        return this.module.dir.dirInfoArray;
    }

    get docDirs() {
        return this.module.dir.builtInfoArray;
    }

    get STAGES() {
        return this.module.hook.STAGES;
    }

    on(stage, callback) {
        this.module.event.on(stage, callback);
    }
}
