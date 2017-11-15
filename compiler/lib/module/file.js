/**
 * @file file-manager.js 处理文件过滤的模块
 * @author tanglei (tanglei02@baidu.com)
 */

import crypto from 'crypto';
import fs from 'fs-extra';
// import path from 'path';
import {
    getPaths,
    // removePrefix,
    // removeExt,
    relativePath,
    // sep,
    // set,
    get,
    // first,
    classify,
    subset,
    exclude,
    toArray,
    flatten
} from '../utils';
import {
    BEFORE_FILTER,
    AFTER_FILTER
} from './hook/stage';

const WHITE_LIST = ['.md', '.json', '.html', '.xml', '.tpl', '.txt'];

export default function (app) {
    let fileInfoMap = new Map();
    // let builtInfoMap = new Map();

    const getChangeFileInfos = async infos => {
        let results = infos.map(info => {
            let oldMD5 = get(fileInfoMap.get(info.path), 'md5');

            let type = oldMD5 === info.md5
                ? 'nochange'
                : oldMD5 ? 'modify' : 'add';

            return Object.assign({}, info, {type});
        })
        .filter(result => result.type !== 'nochange');

        if (fileInfoMap.size) {
            results = [
                ...results,
                ...exclude(toArray(fileInfoMap), infos, ['path'])
                    .map(info => Object.assign({type: 'delete'}, info))
            ];
        }

        return results;
    };

    const getFileInfos = async source => {
        let paths = await getPaths(source.to, WHITE_LIST);

        return await Promise.all(
            paths.map(async fullPath => {
                let file = await fs.readFile(fullPath, 'utf-8');

                return {
                    path: relativePath(app.config.basePath, fullPath),
                    fullPath: fullPath,
                    file: file,
                    md5: createMD5(file),
                    source: source
                };
            })
        );
    };

    const update = (map, info) => {
        if (info.type === 'delete') {
            map.delete(info.path);
        }
        else {
            map.set(info.path, subset(info, ['type'], 'ignore'));
        }
    };

    const fileModule = {
        get fileInfos() {
            return fileInfoMap;
        },

        async filter(sources = app.config.sources) {
            let hook = app.module.hook;

            let infoChunk = await Promise.all(sources.map(getFileInfos));
            let infos = flatten(infoChunk);

            infos = await hook.exec(BEFORE_FILTER, infos);

            infos = getChangeFileInfos(infos);

            infos = await hook.exec(AFTER_FILTER, infos);

            infos.forEach(info => update(fileInfoMap, info));

            let typeMap = {
                'delete': 'remove',
                'add': 'change',
                'modify': 'change'
            };

            return classify(infos, ({type}) => typeMap[type]);
        }
    };

    app.addModule('file', () => fileModule);

    // return () => {
    //     app.on(app.STAGES.AFTER_STORE_DOC, builtInfos => {
    //         builtInfos.forEach(info => update(builtInfoMap, info));
    //     });
    // };
}

function createMD5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
