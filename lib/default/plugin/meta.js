/**
 * @file organize catalog by meta.json
 * @author tanglei (tanglei02@baidu.com)
 */
import path from 'path';
import {
    set,
    isValidArray,
    startWith,
    is,
    removeExt,
    join
} from '../../utils';

export class Meta {
    constructor() {

    }

    apply(on, app) {
        const STAGE = app.STAGE;
        on(STAGE.CREATE_CATALOG, (catalog, entryInfos) => {
            let metaInfos = app.fileInfos.filter(info => path.basename(info.path) === 'meta.json');
            if (!metaInfos.length) {
                return;
            }

            let keyMap = entryInfos.reduce(
                (map, info) => {
                    map[removeExt(info.path)] = true;
                    return map;
                },
                {}
            );

            return metaInfos.map((catalog, info) => {
                let meta = completeMeta(info, keyMap);
                let parentKey = join(key, '..');
                let subCatalog = findByKey(catalog, parentKey);
                return catalog;
            }, catalog);
        });
    }
}

function findByKey(catalog, key) {

}

function completeMeta(info, keyMap) {
    let {file, path: key} = info;
    let parentKey = join(key, '..');

    let meta = JSON.parse(meta);

    if (isValidArray(meta.menu)) {
        meta.menu = completeMenu(meta.menu, keyMap, key);
    }

    if (isValidArray(meta.ignore)) {
        meta.ignore = completeIgnore(meta.ignore, key);
    }

    if (is(Object, meta.name)) {
        meta.name = completeName(meta.name, key);
    }

    return meta;
}

function completeMenu(menus, keyMap, parentKey = '') {
    // 初步过滤
    return menus.filter(
        menu => is(Object, menu) && !!(menu.key || (menu.url && menu.name))
    )
    // key 补全
    .map(menu => {
        // 配了 url 链接的 menu 直接返回
        if (!menu.key) {
            return menu;
        }

        let newKey = completeKey(menu.key, parentKey);

        // 判断补全结果是否存在，如果不存在就还是拿补全前的 key
        if (isValidKey(newKey, keyMap)) {
            menu.key = newKey;
        }

        return menu;
    })
    // 去掉无效项
    .filter(menu => !menu.key || isValidKey(menu.key, keyMap))
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
            menu.children = completeMenu(menu.children, keyMap, menu.key);
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

function completeKey(key, parentKey = '') {
    return startWith(key, parentKey) ? key : join(parentKey, key);
}

function isValidKey(key, keyMap) {
    return isDocKey(key, keyMap) || isFolderKey(key, keyMap);
}

function isDocKey(key, keyMap) {
    return keyMap[key];
}

function isFolderKey(key, keyMap) {
    return Object.keys(keyMap).some(k => startWith(k, `${key}/`));
}
