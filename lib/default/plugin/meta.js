/**
 * @file organize menu by meta.json
 * @author tanglei (tanglei02@baidu.com)
 */

import {
    set,
    isValidArray,
    startWith,
    is,
    removeExt,
    join,
    contain,
    subset
} from '../../utils';

export default class Meta {
    apply(on, app) {
        const {
            GET_CHANGED_FILES,
            GET_CHANGED_ENTRY_FILES,
            AFTER_FILE_PROCESS,
            CREATE_MENU
        } = app.STAGES;

        let isMetaChange;
        let isEntryFileChange;

        on(GET_CHANGED_FILES, fileInfos => {
            isMetaChange = fileInfos.some(info => /meta\.json$/.test(info.path));
        });

        on(GET_CHANGED_ENTRY_FILES, async entryInfos => {
            isEntryFileChange = !!entryInfos.length;
        });

        on(AFTER_FILE_PROCESS, async () => {
            if (isMetaChange && !isEntryFileChange) {
                await app.module.menu.generateAndStore();
            }
        });

        on(CREATE_MENU, async (menu, updateEntryInfos) => {
            let metaInfos = await app.getFileInfos(/meta\.json$/);

            if (!isValidArray(metaInfos)) {
                return;
            }

            let entryPaths = await app.getEntryPaths();

            let keyMap = entryPaths.reduce(
                (map, path) => {
                    map[removeExt(path, '.md')] = true;
                    return map;
                },
                {}
            );

            return metaInfos.reduce((menu, info) => {
                let meta;

                try {
                    meta = completeMeta(info, keyMap);
                }
                catch (e) {
                    app.logger.error('[kram][plugin][meta]', 'Error occur when complete meta.json');
                    app.logger.error('[kram][plugin][meta]', e);
                    return menu;
                }

                let parentKey = join(info.path, '..');
                let menuItem = findByKey(menu, parentKey);

                if (!menuItem) {
                    return menu;
                }

                if (isValidArray(meta.ignore)) {
                    ignoreMenu(menuItem, meta.ignore);
                }

                if (is(Object, meta.name)) {
                    renameMenu(menuItem, meta.name);
                }

                if (isValidArray(meta.menu)) {
                    adjustMenu(menuItem, meta.menu);
                }

                Object.assign(menuItem, subset(meta, ['ignore', 'name', 'menu'], true));

                return menu;

            }, menu);
        });
    }
}

function completeMeta(info, keyMap) {
    let parentKey = join(info.path, '..');
    let meta = JSON.parse(info.file);

    if (isValidArray(meta.menu)) {
        meta.menu = completeMenu(meta.menu, keyMap, parentKey, parentKey);
    }

    if (isValidArray(meta.ignore)) {
        meta.ignore = completeIgnore(meta.ignore, parentKey);
    }

    if (is(Object, meta.name)) {
        meta.name = completeName(meta.name, parentKey);
    }

    return meta;
}

function completeMenu(menus, keyMap, parentKey = '', rootKey = '') {
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
            return menu;
        }

        if (!rootKey) {
            return menu;
        }

        newKey = completeKey(menu.key, rootKey);

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
            menu.children = completeMenu(menu.children, keyMap, menu.key, rootKey);
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

function findByKey(menu, key) {
    if (!isValidArray(menu)) {
        return;
    }

    for (let i = 0; i < menu.length; i++) {
        let item = menu[i];
        if (item.path === key) {
            return item;
        }

        if (startWith(key, item.path) && isValidArray(item.children)) {
            return findByKey(item.children, key);
        }
    }
}

function ignoreMenu(menuItem, ignoreList) {
    menuItem.children = menuItem.children.reduce((list, child) => {
        if (contain(ignoreList, removeExt(child.path, '.md'))) {
            return list;
        }

        if (isValidArray(child.children)) {
            ignoreMenu(child, ignoreList);
        }

        list.push(child);
        return list;
    }, []);
}

function renameMenu(menuItem, nameMap) {
    if (isValidArray(menuItem.children)) {
        menuItem.children = menuItem.children.map(child => {
            let key = removeExt(child.path, '.md');
            let name = nameMap[key];
            if (name) {
                child.name = name;
            }

            if (isValidArray(child.children)) {
                renameMenu(child, nameMap);
            }

            return child;
        });
    }
}

function adjustMenu(menuItem, metaMenu) {
    if (!isValidArray(menuItem.children)) {
        return;
    }

    let indexMap = metaMenu.reduce((obj, item, i) => {
        obj[item.key] = i;
        return obj;
    }, {});

    menuItem.children = menuItem.children.reduce(
        (list, child) => {
            let key = removeExt(child.path, '.md');
            let index = indexMap[key];

            if (index == null) {
                list.push(child);
            }
            else {
                let metaMenuItem = metaMenu[index];
                Object.assign(child, subset(metaMenuItem, ['children', 'key'], true));

                if (isValidArray(metaMenuItem.children) && isValidArray(child.children)) {
                    adjustMenu(child, metaMenuItem.children);
                }

                list[index] = child;
            }

            return list;
        },
        new Array(metaMenu.length)
    )
    .filter(item => !!item);
}
