/**
 * @file dir.js 下载后的文件路径处理模块
 * @author tanglei (tanglei02@baidu.com)
 */

import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import {getDirs, removePrefix, removeExt, sep, set} from '../utils';
import {
    BEFORE_PROCESS_ALL_DIR,
    AFTER_PROCESS_ALL_DIR
} from './plugin';

export default function (app, addModule) {
    const md5map = new Map();
    const sourceDirMap = {};

    const dirModule = {
        dirs(sourceName) {
            return sourceDirMap[sourceName];
        },

        getRelativeDir(dir) {
            let baseDir = app.config.baseDir;
            return removePrefix(sep(dir), sep(baseDir));
        },

        async process(sources) {
            let plugin = app.module.plugin;
            let toProcess = await plugin.exec(BEFORE_PROCESS_ALL_DIR, sources.slice(0), sources);

            let sourceList = await Promise.all(
                toProcess.map(async source => dirModule.processSource(source))
            );

            let all = sourceList.reduce((res, list) => res.concat(list), []);
            return await app.module.plugin.exec(AFTER_PROCESS_ALL_DIR, all.slice(0), all);
        },

        async processSource(source) {
            let dirs = await getDirs(source.to, '.*');
            dirs = dirs.filter(dir => !/\/\./.test(dir));

            let dirInfos = dirs.map(fullDir => ({
                dir: dirModule.getRelativeDir(fullDir),
                fullDir: fullDir
            }));

            let list = await dirModule.classify(dirInfos, sourceDirMap[source.name]);

            sourceDirMap[source.name] = dirInfos;
            list.forEach(result => dirModule.updateMD5(result));

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
            let mappedMD5 = md5map.get(dir);

            if (!await fs.exists(fullDir)) {
                if (mappedMD5) {
                    return {fullDir, dir, type: 'delete'};
                }

                return false;
            }

            let file = await fs.readFile(fullDir);
            let md5 = crypto.createHash('md5').update(file).digest('hex');

            if (mappedMD5 === md5) {
                return false;
            }

            if (mappedMD5) {
                return {fullDir, dir, md5, type: 'modify'};
            }

            return {fullDir, dir, md5, type: 'add'};
        },

        updateMD5({dir, md5, type}) {
            if (type === 'delete') {
                md5map.delete(dir);
            }
            else {
                md5map.set(dir, md5);
            }
        }
    };

    addModule('dir', {
        module: dirModule
    });
}
