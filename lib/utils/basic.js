/**
 * @file basic.js 基础实用小工具
 * @author  tanglei (tanglei02@baidu.com)
 */

/**
 * 获取 obj 的子集
 *
 * @param {Object} obj obj
 * @param {Array} keys 属性名数组
 * @param {boolean=} ignore 判断 keys 数组是属性白名单还是黑名单
 * @return {Object} 子集
 */
export function subset(obj, keys, ignore) {
    if (ignore) {
        keys = exclude(Object.keys(obj), keys);
    }

    return keys.reduce((res, key) => set(res, key, obj[key]), {});
}

/**
 * 从数组中排除掉一部分数据
 *
 * @param {Array} arr 数组
 * @param {Array} ignores 要排除掉的数据
 * @param {Array=} keys 如果要排除的数据是简单 object 的话，只需要匹配以下字段是否满足即可
 * @return {Array} 结果
 */
export function exclude(arr, ignores, keys) {
    let fn;

    if (keys) {
        fn = obj => ignores.every(ignore => !equal(obj, ignore, keys));
    }
    else {
        fn = obj => ignores.indexOf(obj) === -1;
    }

    return arr.filter(fn);
}

/**
 * 简单的判断两个对象是否相等，只需要判断特定的属性字段即可
 *
 * @param {Object} a object a
 * @param {Object} b object b
 * @param {Array} keys 待检测的属性列表
 * @return {boolean} 是否相等
 */
export function equal(a, b, keys) {
    return keys.every(key => a[key] === b[key]);
}

/**
 * 将二维数组打平成一维数组
 *
 * @param {Array} list 二维数组
 * @return {Array} 一维数组
 */
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
        || (obj != null && obj.constructor === proto)
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


/**
 * 判断是否为空对象
 *
 * @param {*} obj obj
 * @return {boolean} 是否为空对象
 */
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

/**
 * 将 Object Set Map 类型的数据转化为数组
 *
 * @param {Object|Set|Map} obj obj
 * @return {Array} result
 */
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

/**
 * 将 Map 对象转化为 Object，Map 的 key 需要自行保证为 string/number
 *
 * @param {Map} obj map 对象
 * @return {Object} object 对象
 */
export function toObject(obj) {
    return Array.from(obj).reduce((item, [key, val]) => set(item, key, val), {});
}

/**
 * 简单的数组/对象属性遍历器封装
 *
 * @param {Object|Array} list 待遍历对象
 * @param {Function} fn 遍历回调
 */
export function each(list, fn) {
    if (Array.isArray(list)) {
        list.forEach((item, i) => fn(item, i));
    }
    else {
        Object.keys(list).forEach(name => fn(name, list[name]));
    }
}

/**
 * 对数组进行元素分类
 *
 * @param {Array} list 待分类数组
 * @param {Function} fn 分类函数，函数的返回值即为当前遍历元素所属的分类
 * @return {Object} 分类结果
 */
export function classify(list, fn) {
    return list.reduce((res, info) => {
        let type = fn(info);
        res[type] = res[type] || [];
        res[type].push(info);
        return res;
    }, {});
}

/**
 * 找到第一个满足条件的元素
 *
 * @param {Array} list array
 * @param {Function} fn 条件
 * @return {*} 满足条件的元素
 */
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

/**
 * 找到最后一个满足条件的元素
 *
 * @param {Array} list array
 * @param {Function} fn 检测条件
 * @return {*} 满足条件的元素
 */
export function last(list, fn) {
    for (let i = list.length - 1; i > -1; i--) {
        if (fn(list[i], i, list)) {
            return list[i];
        }
    }
}
