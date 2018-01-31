/**
 * @file menu manager 生成文档目录结构的模块
 * @author tanglei (tanglei02@baidu.com)
 */

import {isValidArray, get, getMenuItem} from '../utils';
import path from 'path';

export default function (app) {

    const menuModule = {

        /**
         * 生成目录
         *
         * @return {MenuTree} 目录
         */
        async generate() {
            let {getEntryPaths, logger, store, module: {hook}, STAGES: {CREATE_MENU}} = app;

            // 获取文档全部路径
            let entryPaths = await getEntryPaths();

            if (!isValidArray(entryPaths)) {
                logger.warn('[kram] no entry file information for generating menu.');
                return [];
            }

            // 获取全部文档信息
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

            // 生成目录
            let menu = createMenu(entrys);
            return await hook.exec(CREATE_MENU, menu, entrys);
        },

        /**
         * 遍历查找目录元素
         *
         * @param {string=} path 查找条件
         * @return {Array|Object} 当查找条件为空时返回全部的目录信息，
         * 有条件则返回查找到的目录元素节点信息
         */
        async getMenuItem(path) {
            let menu = await app.store.get('menu', 'all');
            if (!path || !menu) {
                return menu;
            }

            return getMenuItem(menu, path);
        },

        /**
         * 获取目录
         *
         * @param {string=} path 查找条件
         * @return {MenuTree} 满足条件的目录 或者 子目录
         */
        async getMenu(path) {
            let menuItem = await menuModule.getMenuItem(path);
            return menuItem && menuItem.children;
        },

        /**
         * 存储编译生成好的目录
         *
         * @param {MenuTree} menu 目录
         */
        async store(menu) {
            await app.store.set('menu', 'all', menu);
        },

        /**
         * 编译生成目录后存储
         */
        async generateAndStore() {
            let menuInfo = await menuModule.generate();
            await menuModule.store(menuInfo);
        }
    };

    app.addModule('menu', () => menuModule);
}

/**
 * 利用文档信息生成树状目录结构
 *
 * @param {Array} entrys 文档信息列表
 * @return {MenuTree} 生成好的树状目录结构
 */
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
    .sort((a, b) => a.path.localeCompare(b))
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
