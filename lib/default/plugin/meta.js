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
    join,
    contain
} from '../../utils';

export default class Meta {
    apply(on, app) {
        const STAGES = app.STAGES;
        on(STAGES.CREATE_CATALOG, (catalog, entryInfos) => {
            let metaInfos = app.fileInfos.filter(info => path.basename(info.path) === 'meta.json');
            if (!metaInfos.length) {
                return;
            }

            let keyMap = entryInfos.reduce(
                (map, info) => {
                    map[removeExt(info.path, '.md')] = true;
                    return map;
                },
                {}
            );

            return metaInfos.reduce((catalog, info) => {
                let meta = completeMeta(info, keyMap);
                let parentKey = join(info.path, '..');
                let catalogItem = findByKey(catalog, parentKey);

                if (!catalogItem) {
                    return catalog;
                }

                if (isValidArray(meta.ignore)) {
                    ignoreCatalog(catalogItem, meta.ignore);
                }

                if (is(Object, meta.name)) {
                    renameCatalog(catalogItem, meta.name);
                }

                return catalog;

            }, catalog);
        });
    }
}

function completeMeta(info, keyMap) {
    let parentKey = join(info.path, '..');
    let meta = JSON.parse(info.file);

    if (isValidArray(meta.menu)) {
        meta.menu = completeMenu(meta.menu, keyMap, parentKey);
    }

    if (isValidArray(meta.ignore)) {
        meta.ignore = completeIgnore(meta.ignore, parentKey);
    }

    if (is(Object, meta.name)) {
        meta.name = completeName(meta.name, parentKey);
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

function findByKey(catalog, key) {
    if (!isValidArray(catalog)) {
        return;
    }

    for (let i = 0; i < catalog.length; i++) {
        let item = catalog[i];
        if (item.path === key) {
            return item;
        }

        if (startWith(key, item.path) && isValidArray(item.children)) {
            return findByKey(item.children, key);
        }
    }
}

// function adjustCatalogByMeta(catalogItem, meta) {
//     catalogItem.children = catalogItem.children.reduce((list, ))
// }

function ignoreCatalog(catalogItem, ignoreList) {
    catalogItem.children = catalogItem.children.reduce((list, child) => {
        if (contain(ignoreList, removeExt(child.path, '.md'))) {
            return list;
        }

        if (isValidArray(child.children)) {
            ignoreCatalog(child, ignoreList);
        }

        list.push(child);
        return list;
    }, []);
}

function renameCatalog(catalogItem, nameMap) {
    catalogItem.children = catalogItem.children.map(child => {
        let key = removeExt(catalogItem.path, '.md');
        let name = nameMap[key];
        if (name) {
            child.title = name;
        }

        if (isValidArray(child.children)) {
            child.children = renameCatalog(child, nameMap);
        }
    });
}
