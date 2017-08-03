/**
 * @file struct.js 生成文档文件结构
 * @author tanglei tanglei02@baidu.com
 */

import fs from 'fs-extra';
import path from 'path';
import {join, removeExt} from '../utils/path';
import {set, isValidArray} from '../utils/basic';

export async function buildStruct(currPath, {rootPath, logger = console} = {}) {
    let dirs;

    try {
        dirs = await fs.readdir(currPath);
    }
    catch (e) {
        logger.error(e);
        return;
    }

    rootPath = rootPath || currPath;
    // len of 'rootPath/'
    let len = rootPath.length + 1;

    let infos = await Promise.all(
        dirs.map(async dir => {
            let childPath = join(currPath, dir);

            let info = {
                name: dir,
                path: childPath,
                key: childPath.slice(len)
            };

            let stat = await fs.stat(childPath);

            if (stat.isDirectory()) {
                info.children = await buildStruct(childPath, {rootPath, logger});
            }
            else {
                // 去掉 ".md"
                info.key = removeExt(info.key, '.md');
            }

            return info;
        })
    );

    return infos.filter(info => isDocPath(info.name) || isValidArray(info.children));
}

export function buildStructMap(structs) {
    let map = structs
        .filter(item => isValidArray(item.children))
        .reduce(
            (res, item) => {
                Object.assign(res, buildStructMap(item.children));
                return set(res, item.key, item);
            },
            {}
        );

    // 根目录
    map['/'] = structs;
    return map;
}

function isDocPath(name) {
    return path.extname(name) === '.md';
}
