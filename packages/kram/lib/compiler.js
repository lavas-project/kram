/**
 * @file kram.js
 * @author clark-t(clarktanglei@163.com)
 */

const {
    SyncHook,
    SyncWaterfallHook,
    AsyncParallelHook,
} = require('tapable');

module.exports = class Compiler {
    constructor(context) {
        this.hooks = {
            entryOptions: new SyncWaterfallHook(['entryOptions']),
            transfomOptions: new SyncWaterfallHook(['transformOptions']),
            resolveOptions: new SyncWaterfallHook(['resolveOptions'])
        };

        this.hooks.entryOptions.tap('Compiler', entryOptions => {

        })
    }

    run(callback) {
        // 1. entryOptions
        let entryOptions = this.hooks.entryOptions.call(this.options.entry);
        // 2. loaders
        //
    }
};
