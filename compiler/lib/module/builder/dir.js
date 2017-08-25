/**
 * @file dir.js 下载后的文件路径处理模块
 * @author tanglei (tanglei02@baidu.com)
 */

import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import {
    getDirs,
    removePrefix,
    removeExt,
    sep,
    set,
    get,
    first,
    merge
} from '../../utils';
import {
    BEFORE_PROCESS_ALL_DIR,
    AFTER_PROCESS_ALL_DIR
} from '../plugin';

export default function (app, addModule) {
    let dirInfoList = [];

    const dirModule = {
        get dirs() {
            return dirInfoList;
        },

        getRelativeDir(dir) {
            let baseDir = app.config.baseDir;
            return removePrefix(sep(dir), sep(baseDir));
        },

        async process(sources) {
            let plugin = app.module.plugin;
            let toProcess = await plugin.exec(BEFORE_PROCESS_ALL_DIR, sources.slice(0), sources);

            let sourceList = await Promise.all(
                toProcess.map(async source => dirModule.processOne(source))
            );

            let all = sourceList.reduce((res, list) => res.concat(list), []);
            return await app.module.plugin.exec(AFTER_PROCESS_ALL_DIR, all.slice(0), all);
        },

        async processOne(source) {
            let dirs = await getDirs(source.to, '.*');
            dirs = dirs.filter(dir => !/\/\./.test(dir));

            let dirInfos = dirs.map(fullDir => ({
                dir: dirModule.getRelativeDir(fullDir),
                fullDir: fullDir
            }));

            let list = await dirModule.classify(dirInfos, dirInfoList);

            list.forEach(info => dirModule.update(info));

            return list;
        },

        async classify(dirInfos, oldDirInfos) {
            let results = await Promise.all(
                dirInfos.map(async info => await dirModule.detect(info))
            );

            results = results.filter(result => result !== false);

            if (oldDirInfos) {
                let deleteInfos = oldDirInfos
                    .filter(({dir: oldDir}) => dirInfos.every(({dir: newDir}) => newDir !== oldDir))
                    .map(({fullDir, dir}) => ({fullDir, dir, type: 'delete'}));

                results = results.concat(deleteInfos);
            }

            return results;
        },

        async detect({fullDir, dir}) {
            let oldInfo = first(dirInfoList, info => info.dir === dir);
            let oldMD5 = get(oldInfo, 'md5');

            if (!await fs.exists(fullDir)) {
                if (oldMD5) {
                    return {fullDir, dir, type: 'delete'};
                }

                return false;
            }

            let file = await fs.readFile(fullDir);
            let md5 = crypto.createHash('md5').update(file).digest('hex');

            if (oldMD5 === md5) {
                return false;
            }

            if (oldMD5) {
                return {fullDir, dir, md5, type: 'modify'};
            }

            return {fullDir, dir, md5, type: 'add'};
        },

        update(dirInfo) {
            if (dirInfo.type === 'delete') {
                dirInfoList = dirInfoList.filter(info => info.dir !== dirInfo.dir);
            }
            else {
                let info = merge({}, dirInfo, {ignore: 'type'});
                dirInfoList.push(info);
            }
        }
    };

    return {
        name: 'dir',
        module: {
            get() {
                return dirModule;
            }
        }
    };
}
