/**
 * @file basic.js 基础实用小工具
 * @author  tanglei (tanglei02@baidu.com)
 */

// export function merge(a, b, {type = 'overwrite', ignore = []} = {}) {
//     if (!b || typeof b !== 'object') {
//         return a;
//     }

//     ignore = ensureArray(ignore);

//     let keys = Object.keys(b);

//     if (isValidArray(ignore)) {
//         keys = keys.filter(key => !contain(ignore, key));
//     }

//     if (type === 'append') {
//         keys = keys.filter(key => a[key] == null);
//     }

//     return keys.reduce((res, key) => setProp(res, key, b[key]), a);
// }

function get(obj, ...arr) {
    for (let i = 0, max = arr.length; i < max; i++) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }

        obj = obj[arr[i]];
    }

    return obj;
}

function set(obj, key, val) {
    obj[key] = val;
    return obj;
}

// function isValidArray(arr) {
//     return Array.isArray(arr) && !!(arr.length);
// }

// function ensureArray(arr) {
//     return Array.isArray(arr) ? arr : [arr];
// }

// function startWith(str, start) {
//     return str.slice(0, start.length) === start;
// }

// function getPrototype(obj) {
//     return Object.prototype.toString.call(obj).slice(8, -1);
// }

// function isObject(obj) {
//     return getPrototype(obj) === 'Object';
// }

// function contain(a, b) {
//     return a.indexOf(b) > -1;
// }

// function preSpace(str) {
//     let max = str.length;
//     for (let i = 0; i < max; i++) {
//         if (str[i] !== ' ') {
//             return i;
//         }
//     }
//     return max;
// }

// function tag(tag, content = '', props = '') {
//     return `<${tag} ${props}>${content}</${tag}>`;
// }

// function encodeTag(str) {
//     return str.replace(/</mg, '&lt;').replace(/>/mg, '&gt;');
// }

// function decodeQuote(str) {
//     return str.replace(/&quot;/mg, '"').replace(/&apos;/mg, '\'');
// }

// function plainify(str) {
//     // material icon 给过滤掉
//     str = str.replace(
//         /<i [^<]*?class="[\w ]*material-icons[\w ]*"[^<]*?>[^<]*?<\/i>/g,
//         ''
//     );

//     let matchRegExp = /<[^<]+?>([\s\S]*?)<\/[^<]+?>/m;
//     let replaceRegExp = /<[^<]+?>([\s\S]*?)<\/[^<]+?>/mg;

//     // 保留 html 标签里的内容 <a>...</a> <code>...</code>
//     while (str.match(matchRegExp)) {
//         str = str.replace(replaceRegExp, '$1');
//     }

//     return encodeTag(str);
// }

// function noop() {}

module.exports = {
    get,
    set
    // merge,
    // getProp,
    // setProp,
    // isValidArray,
    // ensureArray,
    // startWith,
    // getPrototype,
    // isObject,
    // preSpace,
    // tag,
    // encodeTag,
    // decodeQuote,
    // plainify,
    // contain,
    // noop
};
