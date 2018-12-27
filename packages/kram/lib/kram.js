/**
 * @file kram.js
 * @author clark-t (clarktanglei@163.com)
 */

const Compiler = require('./compiler');

function kram(options, callback) {
    let compiler = new Compiler(options.context);
    compiler.options = options;
    Array.isArray(options.plugins) && options.plugins.forEach(plugin => plugin.apply(compiler));
    typeof callback === 'function' && compiler.run(callback);
    return compiler;
}

module.exports = kram;