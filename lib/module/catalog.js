/**
 * @file catalog manager 生成文档目录结构的模块
 * @author tanglei (tanglei02@baidu.com)
 */

import {isValidArray, get} from '../utils';
import path from 'path';

export default function (app) {
    const catalogModule = {
        generate() {
            let entryInfos = app.entryInfos;
            if (!isValidArray(entryInfos)) {
                app.logger.warn('[kram] no entry file information for generating catalog.');
                return [];
            }

            return createCatalog(entryInfos);
        }
    };

    app.addModule('catalog', () => catalogModule);
}

function createCatalog(entryInfos) {
    let tree = entryInfos.map(info => {
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

    return treeToCatalog(tree);
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

function treeToCatalog(tree) {
    return tree.map(node => {
        let obj = {};

        if (node.children) {
            obj.name = node.name;
            obj.path = node.path;
            obj.children = treeToCatalog(node.children);
        }
        else {
            obj.name = node.info.title;
            obj.path = node.info.path;
            obj.url = node.info.url;
        }

        return obj;
    });
}
