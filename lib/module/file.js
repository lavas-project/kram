/**
 * @file file manager
 * @author tanglei (tanglei02@baidu.com)
 * @description 处理文件过滤的模块，对于 loader 载入的文档，
 * 通过该模块会与旧文档进行匹配，过滤出有改动的文件进行下一步的编译操作
 */

import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import {
    getPaths,
    relativePath,
    isValidArray,
    classify,
    subset,
    flatten
} from '../utils';
import {
    GET_ORIGINAL_FILES,
    GET_CHANGED_FILES,
    GET_CHANGED_ENTRY_FILES,
    AFTER_FILE_PROCESS
} from './hook/stage';

const WHITE_LIST = ['.md', '.json', '.html', '.xml', '.tpl', '.txt'];

export default function (app) {
    const FILE_INFOS = 'fileInfos';
    const FILE_PATHS = 'filePaths';
    const ENTRY_INFOS = 'entryInfos';
    const ENTRY_PATHS = 'entryPaths';

    /**
     * 将源文件转换成文件信息列表
     *
     * @param {Object} source source config object
     * @return {Array} file info list in this source
     */
    async function getFileInfos(source) {
        if (Array.isArray(source)) {
            let infoChunk = await Promise.all(source.map(getFileInfos));
            return flatten(infoChunk);
        }

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

    /**
     * 找出加载的文件信息里面哪些是 增加 修改 和删除的
     *
     * @param {Array.<Object>} infos loading file info
     * @param {Array|Object} sources loading sources
     * @return {Array.<Object>} loading file info in add modify or remove type
     */
    async function getChangeFileInfos(infos, sources) {
        let results = await Promise.all(
            infos.map(async info => {
                let exist = await app.store.get(FILE_INFOS, info.path);
                let type = !exist
                    ? 'add'
                    : exist.md5 === info.md5
                        ? 'nochange' : 'modify';

                return Object.assign({}, info, {type});
            })
        );

        results = results.filter(result => result.type !== 'nochange');

        if (!Array.isArray(sources)) {
            sources = [sources];
        }

        let pathsInSources = await Promise.all(
            sources.map(async source => {
                let paths = await app.store.get(FILE_INFOS, FILE_PATHS + '/' + source.name);
                return [source, paths];
            })
        );

        return [
            ...results,
            ...pathsInSources.filter(info => info[1] != null)
                .map(pathInfo => {
                    let [source, paths] = pathInfo;
                    let infoInSources = infos.filter(info => info && info.source && info.source.name === source.name);
                    return paths.filter(path => infoInSources.every(info => info.path !== path))
                        .map(path => ({
                            path,
                            source,
                            type: 'remove'
                        }));
                })
                .reduce((arr, deleteInfo) => [...arr, ...deleteInfo], [])
        ];
    }

    /**
     * update file data
     *
     * @param {string} type data type
     * @param {string} pathListName data name
     * @param {Aarray} infos update data
     * @param {Array|Object} sources loading sources
     */
    async function update(type, pathListName, infos, sources) {
        let {add = [], modify = [], remove = []} = classify(infos, info => info.type);

        await Promise.all([
            ...[...add, ...modify].map(info => app.store.set(type, info.path, subset(info, ['type'], 'ignore'))),
            ...remove.map(info => app.store.remove(type, info.path))
        ]);

        if (!Array.isArray(sources)) {
            sources = [sources];
        }

        // 以 source 为范围存储当前 source 下文件路径信息
        await Promise.all(
            sources.map(async source => {
                let removeInSource = remove.filter(info => info && info.source && info.source.name === source.name);
                let addInSource = add.filter(info => info && info.source && info.source.name === source.name);

                let paths = await app.store.get(type, pathListName + '/' + source.name);
                paths = paths && paths.filter(path => removeInSource.every(info => info.path !== path)) || [];

                paths = [...paths, ...addInSource.map(info => info.path)];
                paths = Array.from(new Set(paths));

                await app.store.set(type, pathListName + '/' + source.name, paths);
                return paths;
            })
        );

        // 存储所有文件路径信息
        let allPaths = await app.store.get(type, pathListName);
        allPaths = allPaths && allPaths.filter(path => remove.every(info => info.path !== path)) || [];
        allPaths = [...allPaths, ...add.map(info => info.path)];
        allPaths = Array.from(new Set(allPaths));

        await app.store.set(type, pathListName, allPaths);
    }

    const fileModule = {

        /**
         * 获取单个文件信息
         *
         * @param {string} path 文件路径
         * @return {Object|undefined} 文件对象，查找不到时返回 undefined
         */
        fileInfo(path) {
            return app.store.get(FILE_INFOS, path);
        },

        /**
         * 获取文件路径信息
         *
         * @param {Function|RegExp|undefined} filter 过滤条件
         * @return {Array|undefined} 文件路径信息列表
         */
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

        /**
         * 获取文件信息
         *
         * @param {Function|RegExp|undefined} filter 过滤条件
         * @return {Array|undefined} 文件信息列表
         */
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

        /**
         * 获取入口文件信息
         *
         * @param {string} path 入口文件路径
         * @return {Object|undefined} 入口文件信息
         */
        entryInfo(path) {
            return app.store.get(ENTRY_INFOS, path);
        },

        /**
         * 获取入口文件（.md）路径列表
         *
         * @param {Function|RegExp} filter 过滤条件
         * @return {Array|undefined} 入口文件路径列表
         */
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

        /**
         * 获取入口文件（.md）信息
         *
         * @param {Function|RegExp} filter 过滤条件
         * @return {Array|undefined} 入口文件信息
         */
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

        async process(sources = app.config.sources) {
            let hook = app.module.hook;

            // step 1. 加载源文件并转换成文件对象
            let infos = await getFileInfos(sources);
            infos = await hook.exec(GET_ORIGINAL_FILES, infos);

            // step 2. 将加载的新文件与旧文件 diff 找出变化的文件信息
            infos = await getChangeFileInfos(infos, sources);
            infos = await hook.exec(GET_CHANGED_FILES, infos);

            // step 2.1 更新源文件信息
            await update(FILE_INFOS, FILE_PATHS, infos, sources);

            // step 3. 找出变化的文档信息
            let entryInfos = infos.filter(info => path.extname(info.path) === '.md');
            entryInfos = await hook.exec(GET_CHANGED_ENTRY_FILES, entryInfos);

            // step 3.1 更新变化的文档信息
            await update(ENTRY_INFOS, ENTRY_PATHS, entryInfos, sources);

            // 通知文件处理结束
            await hook.exec(AFTER_FILE_PROCESS);

            let typeMap = {
                remove: 'remove',
                add: 'change',
                modify: 'change'
            };

            // 将变化的文档分类并返回给下一步
            return classify(entryInfos, ({type}) => typeMap[type]);
        }
    };

    app.addModule('file', () => fileModule);
}

function createMD5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
