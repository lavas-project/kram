/**
 * @file 生成文档目录的方法
 * @author tanglei (tanglei02@baidu.com)
 */

import path from 'path';
import fs from 'fs-extra';
import {
    merge,
    get,
    set,
    isValidArray,
    ensureArray,
    isObject,
    contain
} from '../utils/basic';

import {completeMeta} from './meta';

export async function buildCatalogMap(structMap, docMap, {repo, logger = console}) {
    let opts = {repo, logger, docMap, structMap};

    let map = await Promise.all(
        Object.keys(structMap)
        .map(async key => {
            let struct = structMap[key];
            let catalog;

            if (key === '/') {
                catalog = await buildCatalog(
                    struct,
                    Object.assign({rootPath: repo.dest}, opts)
                );
            }
            else {
                let {children, path: rootPath, key: rootKey} = struct;

                catalog = await buildCatalog(
                    children,
                    Object.assign({rootPath, rootKey}, opts)
                );
            }

            return {key, catalog};
        })
    );

    return map.reduce((res, {key, catalog}) => set(res, key, catalog), {});
}

export async function buildCatalog(
    struct,
    {
        repo,
        logger = console,
        docMap,
        structMap,
        rootPath,
        rootKey = ''
    }
) {
    let opts = {repo, logger, docMap, structMap};

    let originCatalog = await Promise.all(
        struct.map(async info => {
            let re = {
                name: get(docMap, info.key, 'title') || info.name,
                key: info.key
            };

            if (info.children) {
                let {children, key: rootKey, path: rootPath} = info;

                re.children = await buildCatalog(
                    children,
                    Object.assign({rootPath, rootKey}, opts)
                );
            }
            else {
                re.url = docMap[info.key].url;
            }

            return re;
        })
    );

    let metaPath = path.resolve(rootPath, './meta.json');

    if (!await fs.exists(metaPath)) {
        return originCatalog;
    }

    let meta = await fs.readFile(metaPath, 'utf-8');

    try {
        meta = completeMeta(meta, docMap, rootKey);
        let {menu, ignore, name} = meta;

        if (isValidArray(menu)) {
            await mergeCatalog(menu, originCatalog, opts);
        }

        if (isValidArray(ignore)) {
            menu = ignoreMenu(menu, ignore);
        }

        if (isObject(name)) {
            menu = renameMenu(menu, name);
        }

        return menu;
    }
    catch (e) {
        logger.error('Error when Parsing JSON:');
        logger.error(metaPath);
        logger.error('');
        logger.error(e);

        return originCatalog;
    }
}

// 策略是，没有写配置的放在配置的后面

async function mergeCatalog(menu, origin, opts) {
    // 分三步 第一步先基于 menu 进行重建
    mergeExsitToMenu(menu, origin);

    // 第二步 把没有在 menu 里定义的目录和文件按照原来的层级
    appendNotExsitToMenu(menu, origin, origin);

    // 第三步 把不在 origin 树状结构里的相邻目录拼合过来
    await appendAdjacentToMenu(menu, opts);
}

function mergeExsitToMenu(menu, origins) {
    origins
        .map(origin => ({
            menuItem: getMenuItem(origin.key, menu),
            origin: origin
        }))
        .filter(obj => !!obj.menuItem)
        .forEach(({origin, menuItem}) => {
            merge(menuItem, origin, {type: 'append', ignore: 'children'});
        });

    origins
        .filter(origin => isValidArray(origin.children))
        .forEach(origin => mergeExsitToMenu(menu, origin.children));
}

function appendNotExsitToMenu(menu, currs, parent) {
    let appendList;

    if (Array.isArray(parent)) {
        appendList = menu;
    }
    else {
        let parentInMenu = getMenuItem(parent.key, menu);

        if (parentInMenu) {
            parentInMenu.children = ensureArray(parentInMenu.children);
            appendList = parentInMenu.children;
        }
    }

    appendList && currs
        .filter(curr => !getMenuItem(curr.key, menu))
        .forEach(curr => {
            let item = merge({}, curr, {ignore: 'children'});
            appendList.push(item);
        });

    currs
        .filter(curr => curr.children)
        .forEach(curr => appendNotExsitToMenu(menu, curr.children, curr));
}

async function appendAdjacentToMenu(menus, opts) {
    await Promise.all(
        menus
        .filter(menu => !menu.url && !isValidArray(menu.children))
        .map(async menu => {
            let {children, key: rootKey, path: rootPath} = opts.structMap[menu.key];

            menu.children = await buildCatalog(
                children,
                Object.assign({rootKey, rootPath}, opts)
            );
        })
    );

    await Promise.all(
        menus
        .filter(menu => isValidArray(menu.children))
        .map(async menu => await appendAdjacentToMenu(menu.children, opts))
    );
}

function ignoreMenu(menus, ignore) {
    return menus
        .filter(menu => !contain(ignore, menu.key))
        .map(menu => {
            if (isValidArray(menu.children)) {
                menu.children = ignoreMenu(menu.children, ignore);
            }
            return menu;
        });
}

function renameMenu(menus, names) {
    return menus
        .map(menu => {
            menu.name = names[menu.key] || menu.name;

            if (isValidArray(menu.children)) {
                menu.children = renameMenu(menu.children, names);
            }

            return menu;
        });
}


function getMenuItem(key, menu) {
    if (!Array.isArray(menu)) {
        return null;
    }

    for (let i = 0, max = menu.length; i < max; i++) {
        if (menu[i].key === key) {
            return menu[i];
        }

        if (isValidArray(menu[i].children)) {
            let childMenu = getMenuItem(key, menu[i].children);

            if (childMenu) {
                return childMenu;
            }
        }
    }

    return null;
}
