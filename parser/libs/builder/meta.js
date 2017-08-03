/**
 * @file meta.json 相关处理工具
 * @author tanglei (tanglei02@baidu.com)
 */

import {join} from '../utils/path';
import {
    set,
    isValidArray,
    startWith,
    isObject
} from '../utils/basic';

export function completeMeta(meta, docMap, parentKey = '') {
    meta = JSON.parse(meta);

    if (isValidArray(meta.menu)) {
        meta.menu = completeMenu(meta.menu, docMap, parentKey);
    }

    if (isValidArray(meta.ignore)) {
        meta.ignore = completeIgnore(meta.ignore, parentKey);
    }

    if (isObject(meta.name)) {
        meta.name = completeName(meta.name, parentKey);
    }

    return meta;
}

function completeMenu(menus, docMap, parentKey = '') {
    // 初步过滤
    return menus.filter(
        menu => isObject(menu) && !!(menu.key || (menu.url && menu.name))
    )
    // key 补全
    .map(menu => {
        // 配了 url 链接的 menu 直接返回
        if (!menu.key) {
            return menu;
        }

        let newKey = completeKey(menu.key, parentKey);

        // 判断补全结果是否存在，如果不存在就还是拿补全前的 key
        if (isValidKey(newKey, docMap)) {
            menu.key = newKey;
        }

        return menu;
    })
    // 去掉无效项
    .filter(menu => !menu.key || isValidKey(menu.key, docMap))
    // 去掉重复项
    .reduce((res, menu) => {
        if (!menu.key || !res.some(m => m.key === menu.key)) {
            res.push(menu);
        }

        return res;
    }, [])
    // 遍历子节点
    .map(menu => {
        if (isValidArray(menu.children)) {
            menu.children = completeMenu(menu.children, docMap, menu.key);
        }

        return menu;
    })
    .filter(menu => menu.children == null || isValidArray(menu.children));
}

function completeName(names, parentKey = '') {
    return Object.keys(names)
        .filter(key => key !== '')
        .reduce(
            (res, key) => set(
                res,
                completeKey(key, parentKey),
                names[key]
            ),
            {}
        );
}

function completeIgnore(ignores, parentKey = '') {
    return ignores.map(ignore => completeKey(ignore, parentKey));
}

export function completeKey(key, parentKey = '') {
    return startWith(key, parentKey) ? key : join(parentKey, key);
}

export function isValidKey(key, docMap) {
    return isDocKey(key, docMap) || isFolderKey(key, docMap);
}

export function isDocKey(key, docMap) {
    return !!docMap[key];
}

export function isFolderKey(key, docMap) {
    return Object.keys(docMap).some(k => startWith(k, `${key}/`));
}

// module.exports = {
//     completeMeta,
//     isValidKey
// };
