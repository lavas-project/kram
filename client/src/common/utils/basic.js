/**
 * @file utils.js 工具类函数
 * @author tanglei (tanglei02@baidu.com)
 */
import Vue from 'vue';

export function traversal(arr, step, res, key = 'children') {
    let queue = arr.slice();
    let event = {};

    while (queue.length) {
        let obj = queue.shift();

        if (obj && obj[key] && obj[key].length) {
            queue = queue.concat(obj[key]);
        }

        res = step(obj, res, event);

        if (event.break) {
            return res;
        }
    }

    return res;
}

export const bus = new Vue();

export function imageLoader(src, timeout = 2000) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve({
                status: 0,
                data: img
            });
        };
        img.onerror = function (e) {
            resolve({
                status: 1,
                error: e
            });
        };
        img.src = src;
        setTimeout(() => {
            resolve({
                status: 1,
                error: 'time out'
            });
        }, timeout);
    });
}

export function isValidArray(arr) {
    return Array.isArray(arr) && !!(arr.length);
}

export function isValidString(str) {
    return typeof str === 'string' && !!(str.length);
}

export function getOne(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            return arr[i];
        }
    }

    return null;
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
        : arr === undefined
            ? []
            : [arr];
}

export function merge(a, b, {type = 'overwrite', ignore = []} = {}) {
    if (!b || typeof b !== 'object') {
        return a;
    }

    let keys = Object.keys(b);
    ignore = ensureArray(ignore);

    if (isValidArray(ignore)) {
        keys = keys.filter(key => !contain(ignore, key));
    }

    if (type === 'append') {
        keys = keys.filter(key => a[key] == null);
    }

    return keys.reduce((res, key) => set(res, key, b[key]), a);
}

/**
 * 安全获取多级属性的方法，省的去写各种容错判断
 * 如：a.b.c.d => get(a, 'b', 'c', 'd')
 *     a[1].b.c => get(a, 1, 'b', c)
 *
 * @param {Object} obj 待获取属性的对象
 * @param {...string|number} arr 属性名
 * @return {*|null} 属性值，拿不到属性的返回 null
 */
export function get(obj, ...arr) {
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
 * 判断是否包含某些值
 *
 * @param {Array|string} a 待判断对象
 * @param {*} b 待检测的值
 * @return {boolean} 是否包含
 */
export function contain(a, b) {
    return a.indexOf(b) > -1;
}

export function getWithDefault(val, def) {
    return val === undefined ? def : val;
}
