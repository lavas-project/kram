/**
 * @file basic.js 基础实用小工具
 * @author  tanglei (tanglei02@baidu.com)
 */

export function subset(obj, keys, ignore) {
    if (ignore) {
        keys = exclude(Object.keys(obj), keys);
    }

    return keys.reduce((res, key) => set(res, key, obj[key]), {});
}

export function exclude(arr, ignores, keys) {
    // ignores = ignores;
    let fn;

    if (keys) {
        fn = obj => ignores.every(ignore => !equal(obj, ignore, keys));
    }
    else {
        fn = obj => ignores.indexOf(obj) === -1;
    }

    return arr.filter(fn);
}

export function equal(a, b, keys) {
    return keys.every(key => a[key] === b[key]);
}


export function flatten(list) {
    return list.reduce((res, arr) => res.concat(arr), []);
}

/**
 * 安全获取多级属性的方法，省的去写各种容错判断
 * 如：a.b.c.d => get(a, 'b', 'c', 'd') or get(a, 'b.c.d')
 *     a[1].b.c => get(a, 1, 'b', 'c') or get(a, '[1].b.c')
 *
 * @param {Object} obj 待获取属性的对象
 * @param {...string|number} arr 属性名
 * @return {*|null} 属性值，拿不到属性的返回 null
 */
export function get(obj, ...arr) {
    if (arr.length === 1) {
        arr = arr[0].split(/[\.\[\]]/).filter(str => str !== '');
    }

    for (let i = 0, max = arr.length; i < max; i++) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }

        obj = obj[arr[i]];
    }

    return obj;
}

/**
 * 给对象属性赋值并返回该对象
 *
 * @param {Object} obj 待赋值对象
 * @param {string|number} key 属性名
 * @param {*} val 待赋的值
 * @return {Object} 待赋值对象
 */
export function set(obj, key, val) {
    obj[key] = val;
    return obj;
}

/**
 * 判断是否为非空数组
 *
 * @param {*} arr 待判断对象
 * @return {boolean} 是否为非空数组
 */
export function isValidArray(arr) {
    return Array.isArray(arr) && !!(arr.length);
}

/**
 * 确保返回对象为一个数组
 *
 * @param {*} arr 待测对象
 * @return {Array} 数组
 */
export function ensureArray(arr) {
    return Array.isArray(arr)
        ? arr
        : arr === undefined ? [] : [arr];
}

/**
 * 判断字符串前缀是否匹配
 *
 * @param {string} str 待判断字符串
 * @param {string} start 前缀
 * @return {boolean} 判断前缀是否匹配
 */
export function startWith(str, start) {
    return str.slice(0, start.length) === start;
}

/**
 * 获取原型名称
 *
 * @param {*} obj 待测对象
 * @return {string} 原型名称
 */
export function getPrototype(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

export function is(proto, obj) {
    return obj === proto
        || obj.constructor === proto
        || proto.name === getPrototype(obj);
    // return getPrototype(obj) === protoName;
}

/**
 * 判断是否为 object
 *
 * @param {*} obj 待测对象
 * @return {boolean} 是否为 object
 */
// export function isObject(obj) {
//     return getPrototype(obj) === 'Object';
// }

// export function isFunction(obj) {
//     return typeof obj === 'function';
// }



export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * 判断是否包含某些值
 *
 * @param {Array|string} a 待判断对象
 * @param {*} b 待检测的值
 * @return {boolean} 是否包含
 */
export function contain(a, b) {
    return a.indexOf(b) > -1;
}

/**
 * 空方法
 */
export function noop() {}


/**
 * 数组分块
 *
 * @param {Array} arr 待分块数组
 * @param {number} size 分块大小
 * @return {Array} 分块后的数组
 */
export function chunk(arr, size) {
    let output = [];
    for (let i = 0, max = arr.length; i < max; i += size) {
        output.push(arr.slice(i, i + size));
    }

    return output;
}

export function toArray(obj) {
    switch (getPrototype(obj)) {
        case 'Object':
            return Object.keys(obj).map(key => obj[key]);
        case 'Set':
            return Array.from(obj);
        case 'Map':
            return Array.from(obj).map(keyVal => keyVal[1]);
        default:
            break;
    }
}

export function toObject(obj) {
    return Array.from(obj).reduce((item, [key, val]) => set(item, key, val), {});
}

export function each(list, fn) {
    if (Array.isArray(list)) {
        list.forEach((item, i) => fn(item, i));
    }
    else {
        Object.keys(list).forEach(name => fn(name, list[name]));
    }
}

export function classify(list, fn) {
    return list.reduce((res, info) => {
        let type = fn(info);
        res[type] = res[type] || [];
        res[type].push(info);
        return res;
    }, {});
}

export function first(list, fn) {
    if (typeof list.find === 'function') {
        return list.find(fn);
    }

    for (let i = 0; i < list.length; i++) {
        if (fn(list[i], i, list)) {
            return list[i];
        }
    }
}

export function last(list, fn) {
    for (let i = list.length - 1; i > -1; i--) {
        if (fn(list[i], i, list)) {
            return list[i];
        }
    }
}
