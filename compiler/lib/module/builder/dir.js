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
import {ON_PROCESS_DIR} from '../hook/stage';

export default function (app, addModule) {
    let dirInfoMap = new Map();
    let builtInfoMap = new Map();

    const dirModule = {
        get dirInfoArray() {
            return Array.from(dirInfoMap).map(keyVal => keyVal[1]);
        },

        get dirInfoObject() {
            return Array.from(dirInfoMap).reduce((obj, [key, val]) => set(obj, key, val), {});
        },

        get builtInfoArray() {
            return Array.from(builtInfoMap).map(keyVal => keyVal[1]);
        },

        get builtInfoObject() {
            return Array.from(builtInfoMap).reduce((obj, [key, val]) => set(obj, key, val), {});
        },

        getRelativeDir(dir) {
            let baseDir = app.config.baseDir;
            return removePrefix(sep(dir), sep(baseDir));
        },

        async process(sources = app.config.sources) {
            let infoChunk = await Promise.all(sources.map(this.getSourceInfo));

            let infoList = infoChunk.reduce((res, list) => res.concat(list), []);
            infoList = await app.module.hook.exec(ON_PROCESS_DIR, infoList);

            infoList.forEach(this.updateDirInfo);

            return infoList;
        },

        async getSourceInfo(source) {
            let dirs = await getDirs(source.to, '.*');
            dirs = dirs.filter(dir => !/\/\./.test(dir));

            let dirInfos = dirs.map(fullDir => ({
                dir: this.getRelativeDir(fullDir),
                fullDir: fullDir
            }));

            return await this.classify(dirInfos, this.dirInfoArray);
        },

        async classify(dirInfos, oldDirInfos) {
            let results = await Promise.all(
                dirInfos.map(async info => await this.detect(info))
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

        updateDirInfo(info) {
            if (info.type === 'delete') {
                dirInfoMap.delete(info.dir);
            }
            else {
                dirInfoMap.set(info.dir, merge({}, info, {ignore: 'type'}));
            }

        },

        updateBuiltInfo(info) {
            if (info.type === 'delete') {
                builtInfoMap.delete(info.dir);
            }
            else {
                builtInfoMap.set(info.dir, merge({}, info, {ignore: 'type'}));
            }
        }
    };

    return {
        name: 'dir',
        module: {
            get() {
                return dirModule;
            }
        },
        init() {
            let AFTER_BUILD = app.STAGES.AFTER_BUILD;
            app.on(AFTER_BUILD, builtInfos => {
                builtInfos.forEach(dirModule.updateBuiltInfo);
            });
        }
    };
}
