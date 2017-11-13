/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

import defaultData from './default';
import * as modules from './lib/module';
import {set, is, subset} from './lib/utils';


let moduleNames = Object.keys(modules);

export class Compiler {

    /**
     * Compiler constructor
     *
     * @param {Object=} config configure options
     */
    constructor(config = {}) {
        this.module = {};
        // modules instantiation
        let inits = moduleNames.map(key => modules[key](this));
        // default configs and components initialization
        this.default = defaultData(this);
        // config initialization
        this.config = is(Function, config) ? config(this) : config;
        // modules initialization
        inits.filter(init => !!init).forEach(fn => fn());
    }

    /**
     * mount module to compiler.module
     * e.g. compiler.addModule('hello', () => 'world')
     * then compiler.module.hello === 'world'
     *
     * @param {string} name module's name
     * @param {Function|Object} descriptor property descriptor or simply a getter function
     */
    addModule(name, descriptor) {
        Object.defineProperty(
            this.module,
            name,
            is(Function, descriptor) ? {get: descriptor}: descriptor
        );
    }

    async exec() {
        let {loader, builder} = this.module;
        let sources = await loader.load();
        return await builder.build(sources);
    }

    get parse() {
        return this.module.parser.parse;
    }

    get logger() {
        return this.module.logger;
    }

    get store() {
        return subset(this.module.store, ['set', 'get', 'delete']);
    }

    get originalDirs() {
        return this.module.dir.originalDirs;
    }

    get builtDirs() {
        return this.module.dir.builtDirs;
    }

    get plugins() {
        return this.module.plugin.list;
    }

    get STAGES() {
        return this.module.hook.STAGES;
    }

    on(stage, callback) {
        this.module.event.on(stage, callback);
    }
}
