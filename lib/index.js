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
        let {loader, file, parser, menu, hook} = this.module;

        this.logger.info('[kram] execution start.');
        await hook.exec(hook.STAGES.START);

        let sources = await loader.load(sourceName);
        let {change = [], remove = []} = await file.filter(sources);

        if (change.length + remove.length > 0) {
            let docInfos = await parser.parse(change);
            await parser.store(docInfos, remove);

            let menuInfo = await menu.generate();
            await menu.store(menuInfo);
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
        return subset(this.module.store, ['set', 'get', 'remove']);
    }

    get getMenu() {
        return this.module.menu.get;
    }

    get getDoc() {
        return this.module.parser.get;
    }

    get getFilePaths() {
        return this.module.file.filePaths;
    }

    get getFileInfos() {
        return this.module.file.fileInfos;
    }

    get getEntryPaths() {
        return this.module.file.entryPaths;
    }

    get getEntryInfos() {
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
