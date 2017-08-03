/**
 * @file 路径相关常用方法封装
 * @author tanglei (tanglei02@baidu.com)
 */
const path = require('path');

function delimiter(str) {
    return str.replace(/\\/g, '/').replace(/\/$/, '');
}

function join(...arr) {
    return delimiter(path.join(...arr));
}

function removeExt(str, ext) {
    let len = ext.length;

    if (str.slice(-len) === ext) {
        return str.slice(0, -len);
    }

    return str;
}

module.exports = {
    delimiter,
    join,
    removeExt
};
