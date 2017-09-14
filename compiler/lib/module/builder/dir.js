/**
 * @file dir.js 下载后的文件路径处理模块
 * @author tanglei (tanglei02@baidu.com)
 */

import crypto from 'crypto';
import fs from 'fs-extra';
// import path from 'path';
import {
    getDirs,
    removePrefix,
    removeExt,
    sep,
    set,
    get,
    first,
    subset,
    exclude,
    toArray,
    flatten
} from '../../utils';
import {ON_PROCESS_DIR} from '../hook/stage';

export default function (app) {
    let dirInfoMap = new Map();
    let builtInfoMap = new Map();

    const relativeDir = dir => removePrefix(sep(dir), sep(app.config.baseDir));

    const getSourceInfo = async source => {
        let dirs = await getDirs(source.to, '.*');

        let dirInfos = dirs.map(fullDir => ({
            dir: relativeDir(fullDir),
            fullDir: fullDir
        }));

        return await classify(dirInfos);
    };

    const classify = async infos => {
        let results = await Promise.all(infos.map(detect));

        results = results.filter(result => result !== false);

        if (dirInfoMap.size) {
            results = [
                ...results,
                ...exclude(toArray(dirInfoMap), infos, 'dir')
                    .map(info => Object.assign({type: 'delete'}, info))
            ];
        }

        return results;
    };

    const detect = async ({fullDir, dir}) => {
        let oldInfo = dirInfoMap.get(dir);
        // let oldInfo = first(dirInfoList, info => info.dir === dir);
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
    };

        // updateDirInfo(info) {
        //     if (info.type === 'delete') {
        //         dirInfoMap.delete(info.dir);
        //     }
        //     else {
        //         dirInfoMap.set(info.dir, subset(info, 'type', 'ignore'));
        //     }

        // },

        // updateBuiltInfo(info) {
        //     if (info.type === 'delete') {
        //         builtInfoMap.delete(info.dir);
        //     }
        //     else {
        //         builtInfoMap.set(info.dir, subset(info, 'type', 'ignore'));
        //     }
        // }


    const dirModule = {
        // get dirInfoArray() {
        //     return Array.from(dirInfoMap).map(keyVal => keyVal[1]);
        // },

        // get dirInfoObject() {
        //     return Array.from(dirInfoMap).reduce((obj, [key, val]) => set(obj, key, val), {});
        // },

        // get builtInfoArray() {
        //     return Array.from(builtInfoMap).map(keyVal => keyVal[1]);
        // },

        // get builtInfoObject() {
        //     return Array.from(builtInfoMap).reduce((obj, [key, val]) => set(obj, key, val), {});
        // },

        async process(sources = app.config.sources) {
            let infoChunk = await Promise.all(sources.map(getSourceInfo));
            let infoList = flatten(infoChunk);
            // let infoList = infoChunk.reduce((res, list) => res.concat(list), []);
            infoList = await app.module.hook.exec(ON_PROCESS_DIR, infoList);

            infoList.forEach(this.updateDirInfo);

            return infoList;
        }
    };

    app.addModule('dir', () => dirModule);

    return () => {
        app.on(app.STAGES.AFTER_BUILD, builtInfos => {
            builtInfos.forEach(dirModule.updateBuiltInfo);
        });
    };
}
