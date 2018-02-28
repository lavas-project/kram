/**
 * @file utils.js 工具类函数
 * @author tanglei (tanglei02@baidu.com)
 */

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


//-----------------------------------------------------------------------
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2013-07-05 08:09:04.423
// dateFormat(new Date(),"yyyy-M-d h:m:s.S")      ==> 2013-7-5 8:9:4.18
// dateFormat(new Date(),"yyyy/M/d h:m:s.S")       ==> 2013/7/5 8:9:4.18
//-------------------------------------------------------------------------
export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm') {
    if (typeof date === 'string' && /^\d+$/.test(date)) {
        date = +date;
    }

    date = new Date(date);
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k of Object.keys(o)) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
                ? (o[k])
                : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}


/**
 * 排除掉白名单
 *
 * @param {Array} whiteList 白名单
 * @param {string} pathName  path 路径
 * @return {boolean}         判断的结果
 */
export function isIgnore(whiteList, pathName) {
    let flag = false;

    whiteList.forEach(item => {
        if (typeof item === 'string' && item.includes(pathName)) {
            flag = true;
        }
        else if (item.test(pathName)) {// 如果是正则
            flag = true;
        }
    });

    return flag;
}

/**
 * Linear mapping a value from domain to range
 *
 * @param  {(number|Array.<number>)} val value
 * @param  {Array.<number>} domain Domain extent domain[0] can be bigger than domain[1]
 * @param  {Array.<number>} range  Range extent range[0] can be bigger than range[1]
 * @param  {boolean} clamp clamp
 * @return {(number|Array.<number>)}
 */
export function linearMap(val, domain, range, clamp) {
    let subDomain = domain[1] - domain[0];
    let subRange = range[1] - range[0];

    if (subDomain === 0) {
        return subRange === 0
            ? range[0]
            : (range[0] + range[1]) / 2;
    }

    // Avoid accuracy problem in edge, such as
    // 146.39 - 62.83 === 83.55999999999999.
    // See echarts/test/ut/spec/util/number.js#linearMap#accuracyError
    // It is a little verbose for efficiency considering this method
    // is a hotspot.
    if (clamp) {
        if (subDomain > 0) {
            if (val <= domain[0]) {
                return range[0];
            }
            else if (val >= domain[1]) {
                return range[1];
            }
        }
        else if (val >= domain[0]) {
            return range[0];
        }
        else if (val <= domain[1]) {
            return range[1];
        }
    }
    else {
        if (val === domain[0]) {
            return range[0];
        }
        if (val === domain[1]) {
            return range[1];
        }
    }

    return (val - domain[0]) / subDomain * subRange + range[0];
}


/**
//  * 根据 UA 的浏览器名称，找到对应图片
//  *
//  * @param  {browserName} browserName [description]
//  * @return {[type]}             [description]
//  */
// export function getBrowserIcon(browserName) {
//     if (browserName) {
//         for (let key of Object.keys(browsers)) {
//             for (let i = 0; i < browsers[key].length; i++) {
//                 let alias = browsers[key][i];
//                 if (browserName.toLowerCase().indexOf(alias) > -1) {
//                     return `/dist/static/img/${key}.png`;
//                 }
//             }
//         }
//     }

//     return '/dist/static/img/default.png';
// }

// /**
//  * 根据打分显示浏览器图标背景颜色
//  *
//  * @param  {number}  score 分数
//  * @return {string} color 色值
//  */
// export function valueToColor(score) {
//     const SUPPORT = '#39b54a';
//     const PARTIAL_SUPPORT = '#a8bd04';
//     const NOT_SUPPORT = '#d3dce6';
//     const UNKNOWN = '#d3dce6';

//     let color = UNKNOWN;

//     if (isNumeric(score)) {
//         if (score === 1) {
//             color = SUPPORT;
//         }
//         else if (score > 0 && score < 1) {
//             color = PARTIAL_SUPPORT;
//         }
//         else if (score === 0) {
//             color = NOT_SUPPORT;
//         }
//     }

//     return color;
// }


// /**
//  * 对象数组按某一项排序
//  *
//  * @param  {string}  name 排序属性
//  * @return {Function}  func 比较结果
//  */
// export function objArrSortBy(name) {
//     return function (o, p) {
//         let a;
//         let b;
//         if (typeof o === 'object' && typeof p === 'object' && o && p) {
//             a = o[name];
//             b = p[name];
//             if (a === b) {
//                 return 0;
//             }
//             if (typeof a === typeof b) {
//                 return a < b ? -1 : 1;
//             }
//             return typeof a < typeof b ? -1 : 1;
//         }

//         throw ('error');
//     };
// }
