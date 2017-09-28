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
import {
    BEFORE_PROCESS_DIR,
    AFTER_PROCESS_DIR
} from '../hook/stage';

export default function (app) {
    let dirInfoMap = new Map();
    let builtInfoMap = new Map();

    const relativeDir = dir => removePrefix(sep(dir), sep(app.config.baseDir));

    const getSourceInfo = async source => {
        let dirs = await getDirs(source.to, '.*');

        let dirInfos = dirs.map(
            fullDir => ({
                dir: relativeDir(fullDir),
                fullDir: fullDir
            })
        );

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
        let oldMD5 = get(oldInfo, 'md5');

        if (!await fs.exists(fullDir)) {
            if (oldMD5) {
                return {fullDir, dir, type: 'delete'};
            }

            return false;
        }

        let file = await fs.readFile(fullDir);
        let md5 = createMD5(file);

        if (oldMD5 === md5) {
            return false;
        }

        return {
            fullDir,
            dir,
            md5,
            type: oldMD5 ? 'modify' : 'add'
        };
    };

    const update = (map, info) => {
        if (info.type === 'delete') {
            map.delete(info.dir);
        }
        else {
            map.set(info.dir, subset(info, ['type'], 'ignore'));
        }
    };

    const dirModule = {
        get originalDirs() {
            return dirInfoMap;
        },

        get builtDirs() {
            return builtInfoMap;
        },

        async process(sources = app.config.sources) {
            let hook = app.module.hook;
            sources = await hook.exec(BEFORE_PROCESS_DIR, sources);

            let infoChunk = await Promise.all(sources.map(getSourceInfo));
            let infoList = flatten(infoChunk);

            infoList = await hook.exec(AFTER_PROCESS_DIR, infoList);
            infoList.forEach(info => update(dirInfoMap, info));

            return infoList;
        }
    };

    app.addModule('dir', () => dirModule);

    return () => {
        app.on(app.STAGES.AFTER_BUILD, builtInfos => {
            builtInfos.forEach(info => update(builtInfoMap, info));
        });
    };
}

function createMD5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}