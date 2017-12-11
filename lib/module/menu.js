/**
 * @file menu manager 生成文档目录结构的模块
 * @author tanglei (tanglei02@baidu.com)
 */

import {isValidArray, get, getMenuItem} from '../utils';
import path from 'path';

export default function (app) {
    const menuModule = {
        async generate() {
            let {getEntryPaths, logger, store, module: {hook}, STAGES: {CREATE_MENU}} = app;
            let entryPaths = await getEntryPaths();

            if (!isValidArray(entryPaths)) {
                logger.warn('[kram] no entry file information for generating menu.');
                return [];
            }

            let entrys = await Promise.all(
                entryPaths.map(async entryPath => {
                    let storeInfo = await store.get('doc', entryPath);

                    return {
                        info: storeInfo.info,
                        path: entryPath,
                        url: storeInfo.url
                    };
                })
            );

            let menu = createMenu(entrys);
            return await hook.exec(CREATE_MENU, menu, entrys);
        },
        async get(path) {
            let menu = await app.store.get('menu', 'all');
            if (!path || !menu) {
                return menu;
            }

            return getMenuItem(menu, path);
        },
        async store(menu) {
            await app.store.set('menu', 'all', menu);
        }
    };

    app.addModule('menu', () => menuModule);
}

function createMenu(entrys) {
    let tree = entrys.map(info => {
        let extname = path.extname(info.path);
        let basename = path.basename(info.path, extname);

        let obj = {
            path: info.path,
            url: info.url,
            levels: getPathLevel(info.path),
            title: get(info, 'info.title')
                || get(info, 'chapter[0].text')
                || basename
        };

        return obj;
    })
    .reduce((tree, info) => appendToTree(tree, info.levels, info), []);

    return treeToMenu(tree);
}

function getPathLevel(path) {
    return path.split('/').filter(str => str !== '');
}

function appendToTree(tree, levels, info) {
    let levelLen = levels.length;
    let node = tree;

    for (let i = 0; i < levelLen; i++) {
        let nodeLen = node.length;
        let j;

        for (j = 0; j < nodeLen; j++) {
            if (node[j].name === levels[i]) {
                if (i === levelLen - 1) {
                    node[j].info = info;
                }
                else {
                    node[j].children = node[j].children || [];
                    node = node[j].children;
                }

                break;
            }
        }

        if (j === nodeLen) {
            if (i === levelLen - 1) {
                node.push({
                    name: levels[i],
                    info: info
                });
            }
            else {
                node.push({
                    name: levels[i],
                    path: levels.slice(0, i + 1).join('/'),
                    children: []
                });
                node = node[j].children;
            }
        }
    }

    return tree;
}

function treeToMenu(tree) {
    return tree.map(node => {
        let obj = {};

        if (node.children) {
            obj.name = node.name;
            obj.path = node.path;
            obj.children = treeToMenu(node.children);
        }
        else {
            obj.name = node.info.title;
            obj.path = node.info.path;
            obj.url = node.info.url;
        }

        return obj;
    });
}
