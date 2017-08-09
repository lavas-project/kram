/**
 * @file 文档原始结构
 * @author tanglei (tanglei02@baidu.com)
 */

import {locals} from '../../share/locals';
import path from 'path';
import fs from 'fs-extra';

export function get(repo, options) {
    let struct = locals.structs[repo.name];

    if (!options) {
        return struct;
    }

    let {type, regex} = options;
    struct = struct[type];

    if (!regex) {
        return struct;
    }

    return struct.filter(dir => regex.test(dir));
}

export async function set(repo) {
    let struct = await construct(repo.pull.dest);
    locals.structs[repo.name] = struct;
    return locals.structs[repo.name];
}

export async function construct(curr) {
    let dirs = await fs.readdir(curr);
    let infos = await Promise.all(
        dirs.map(async dir => {
            let child = path.resolve(curr, dir);
            let stat = await fs.stat(child);
            return {
                type: stat.isDirectory() ? 'folder' : 'file',
                path: child
            }
        })
    );

    let map = infos.reduce(
        (res, info) => {
            res[info.type].push(info.path);
            return res;
        },
        {
            folder: [],
            file: []
        }
    );

    let childMap = await Promise.all(
        map.folder.map(async folder => await construct(folder))
    );

    return childMap.reduce((res, child) => {
        res.folder = res.folder.concat(child.folder);
        res.file = res.file.concat(child.file);
        return res;
    }, map);
}

