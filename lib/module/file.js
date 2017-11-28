/**
 * @file file manager 处理文件过滤的模块
 * @author tanglei (tanglei02@baidu.com)
 */

import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import {
    getPaths,
    // removePrefix,
    // removeExt,
    relativePath,
    // sep,
    // set,
    // get,
    // first,
    isValidArray,
    classify,
    subset,
    // exclude,
    // toArray,
    flatten
    // ,
    // contain
} from '../utils';
import {
    BEFORE_FILTER_FILE,
    AFTER_FILTER_FILE,
    FILTER_ENTRY
} from './hook/stage';

const WHITE_LIST = ['.md', '.json', '.html', '.xml', '.tpl', '.txt'];

export default function (app) {
    const FILE_INFOS = 'fileInfos';
    const FILE_PATHS = 'filePaths';
    const ENTRY_INFOS = 'entryInfos';
    const ENTRY_PATHS = 'entryPaths';

    // let fileInfoMap = new Map();
    // let entryInfoMap = new Map();

    async function getChangeFileInfos(infos) {
        let results = await Promise.all(
            infos.map(async info => {
                let exist = await app.store.get(FILE_INFOS, info.path);
                let type = !exist
                    ? 'add'
                    : exist.md5 === info.md5
                        ? 'modify' : 'nochange';

                return Object.assign({}, info, {type});
            })
        );

        results = results.filter(result => result.type !== 'nochange');

        let paths = await app.store.get(FILE_INFOS, FILE_PATHS);

        if (isValidArray(paths)) {
            results = [
                ...results,
                ...paths.filter(path => infos.every(info => info.path !== path))
                    .map(path => ({path, type: 'remove'}))
            ];
        }

        return results;
    }

    async function getFileInfos(source) {
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
    }

    async function update(type, pathListName, infos) {
        let {add = [], modify = [], remove = []} = classify(infos, info => info.type);

        await Promise.all([
            ...[...add, ...modify].map(info => app.store.set(type, info.path, subset(info, ['type'], 'ignore'))),
            ...remove.map(info => app.store.remove(type, info.path))
        ]);

        let paths = await app.store.get(type, pathListName);
        paths = paths && paths.filter(path => remove.every(info => info.path !== path)) || [];

        paths = add.reduce(
            (paths, info) => {
                paths.push(info.path);
                return paths;
            },
            paths
        );

        await app.store.set(type, pathListName, paths);
    }

    const fileModule = {
        fileInfo(path) {
            return app.store.get(FILE_INFOS, path);
        },

        async filePaths(filter) {
            let paths = await app.store.get(FILE_INFOS, FILE_PATHS);

            if (!isValidArray(paths)) {
                return paths;
            }

            switch (typeof filter) {
                case 'function':
                    return paths.filter(filter);
                case 'object':
                    return paths.filter(path => filter.test(path));
                default:
                    return paths;
            }
        },

        async fileInfos(filter) {
            let paths;

            if (Array.isArray(filter)) {
                paths = filter;
            }
            else {
                paths = await fileModule.filePaths(filter);
            }

            if (isValidArray(paths)) {
                return await Promise.all(paths.map(path => fileModule.fileInfo(path)));
            }
        },

        entryInfo(path) {
            return app.store.get(ENTRY_INFOS, path);
        },

        async entryPaths(filter) {
            let paths = await app.store.get(ENTRY_INFOS, ENTRY_PATHS);

            if (!isValidArray(paths)) {
                return paths;
            }

            switch (typeof filter) {
                case 'function':
                    return paths.filter(filter);
                case 'object':
                    return paths.filter(path => filter.test(path));
                default:
                    return paths;
            }
        },

        async entryInfos(filter) {
            let paths;

            if (Array.isArray(filter)) {
                paths = filter;
            }
            else {
                paths = await fileModule.entryPaths(filter);
            }

            if (isValidArray(paths)) {
                return await Promise.all(paths.map(path => fileModule.entryInfo(path)));
            }
        },

        async filter(sources = app.config.sources) {
            let hook = app.module.hook;

            let infoChunk = await Promise.all(sources.map(getFileInfos));
            let infos = flatten(infoChunk);

            infos = await hook.exec(BEFORE_FILTER_FILE, infos);

            infos = await getChangeFileInfos(infos);

            infos = await hook.exec(AFTER_FILTER_FILE, infos);

            await update(FILE_INFOS, FILE_PATHS, infos);

            let entryInfos = infos.filter(info => path.extname(info.path) === '.md');
            entryInfos = await hook.exec(FILTER_ENTRY, entryInfos);

            await update(ENTRY_INFOS, ENTRY_PATHS, entryInfos);

            let typeMap = {
                remove: 'remove',
                add: 'change',
                modify: 'change'
            };

            return classify(entryInfos, ({type}) => typeMap[type]);
        }
    };

    app.addModule('file', () => fileModule);
}

function createMD5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
