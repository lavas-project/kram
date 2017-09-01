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

        moduleNames.map(key => modules[key](this))
            .filter(module => !!module)
            .forEach(({name, module, init}) => {
                // config && Object.defineProperty(this.config, config.name || name, config);
                module && Object.defineProperty(this.module, module.name || name, module);
                init && inits.push({props: options[name], fn: init});
            });

        this.default = defaultData(this);
        options = isFunction(options) ? options(this) : options;
        // @TODO 这里是有问题的
        // 因为实际 module 在读配置的时候 都有自己的 default merge 策略
        merge(this.config, [this.default.config, options]);
        inits.forEach(({fn, props}) => fn(props));
    }

    exec() {
        let {loader, builder} = this.module;
        return loader.load().then(builder.build);
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
