/**
 * @file dir.js 下载后的文件路径处理模块
 * @author tanglei (tanglei02@baidu.com)
 */

import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import {getDirs, removePrefix, removeExt, sep, set} from '../utils';

export default function (app, addModule) {
    const md5map = new Map();
    const sourceDirMap = {};
    const keyMap = {};

    const dirModule = {
        dirs(sourceName) {
            return sourceDirMap[sourceName];
        },

        createKey(dir) {
            let baseDir = app.config.baseDir;
            let key = removePrefix(sep(dir), sep(baseDir));
            return removeExt(key, '.md');
        },

        processAll(sources) {
            return Promise.all(
                sources.map(async source => dirModule.process(source))
            );
        },

        async process(source) {
            let dirs = await getDirs(source.to, '.*');

            let list = await dirModule.classify(dirs, sourceDirMap[source.name]);
            list = list.map(info => {
                if (path.extname(info.dir) === '.md') {
                    info.key = dirModule.createKey(info.dir);
                }

                return info;
            });

            sourceDirMap[source.name] = dirs;
            list.forEach(result => dirModule.updateMD5(result));

            return {source, list};
        },

        async classify(dirs, oldDirs) {
            let results = await Promise.all(
                dirs.map(async dir => await dirModule.detect(dir))
            );

            results = results.filter(result => result !== false);

            if (oldDirs) {
                let deleteInfos = oldDirs
                    .filter(oldDir => dirs.every(dir => dir !== oldDir))
                    .map(dir => ({dir, type: 'delete'}));

                results = results.concat(deleteInfos);
            }

            return results;
        },

        async detect(dir) {
            let mappedMD5 = md5map.get(dir);

            if (!await fs.exists(dir)) {
                if (mappedMD5) {
                    return {dir, type: 'delete'};
                }

                return false;
            }

            let file = await fs.readFile(dir);
            let md5 = crypto.createHash('md5').update(file).digest('hex');

            if (mappedMD5 === md5) {
                return false;
            }

            if (mappedMD5) {
                return {dir, md5, type: 'modify'};
            }

            return {dir, md5, type: 'add'};
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
