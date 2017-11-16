/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

import defaultData from './default';
import * as modules from './module';
import {is, subset} from './utils';


const moduleNames = Object.keys(modules);

export class Kram {

    /**
     * Kram constructor
     *
     * @param {Object=} config configure options
     */
    constructor(config = {}) {
        this.module = {};
        // modules instantiation
        let inits = moduleNames.map(key => modules[key](this)).filter(init => !!init);
        // default configs and components initialization
        this.default = defaultData(this);
        // config initialization
        this.config = is(Function, config) ? config(this) : config;
        // modules initialization
        inits.forEach(fn => fn());
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
            is(Function, descriptor) ? {get: descriptor} : descriptor
        );
    }

    async exec(sourceName) {
        let {loader, file, parser, store, catalog, hook} = this.module;

        this.logger.info('[kram] execution start.');
        await hook.exec(hook.STAGES.START);

        let sources = await loader.load(sourceName);
        let {change = [], remove = []} = await file.filter(sources);

        if (change.length + remove.length > 0) {
            let docInfos = await parser.parse(change);
            let catalogInfo = await catalog.generate();

            await Promise.all([
                store.update('doc', docInfos, remove),
                store.update('catalog', catalogInfo)
            ]);
        }

        await hook.exec(hook.STAGES.DONE);
        this.logger.info('[kram] execution done.');
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

    get fileInfos() {
        return this.module.file.fileInfos;
    }

    get entryInfos() {
        return this.module.file.entryInfos;
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
