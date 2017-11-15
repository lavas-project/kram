/**
 * @file 插入外部字符串
 * @author tanglei (tanglei02@baidu.com)
 */
import fs from 'fs-extra';
import path from 'path';
import {relativePath} from '../../lib/utils';

const REGEX = /{{- *insert:(.*)?-}}/;
const REGEX_GLOBAL = new RegExp(REGEX, 'mg');

export default class Insert {
    constructor({
        priority = 200
    } = {}) {
        this.priority = priority;
    }

    apply(on, app) {
        let {
            AFTER_FILTER,
            BEFORE_PARSE
        } = app.module.hook.STAGES;

        let map = new Map();

        on(AFTER_FILTER, docInfos => {
            for (let i = 0; i < docInfos.length; i++) {
                let info = docInfos[i];
                let affects = map.get(info.path);

                if (affects) {
                    for (let j = 0; j < affects.length; j++) {
                        if (docInfos.every(info => info.path !== affects[j].path)) {
                            docInfos.push(Object.assign({type: 'modify'}, affects[j]));
                        }
                    }
                }

                if (info.type === 'delete') {
                    map.delete(info.path);
                }
            }

            return docInfos;
        });

        on(BEFORE_PARSE, async (md, options) => {
            let matches = md.match(REGEX_GLOBAL);
            if (!matches) {
                return;
            }

            let insertPaths = matches.map(matched => {
                let insertPath = matched.match(REGEX)[1].trim();
                return path.resolve(options.fullPath, '..', insertPath);
            });

            insertPaths.forEach(insertFullPath => {
                let insertPath = relativePath(app.config.basePath, insertFullPath);

                if (!map.get(insertPath)) {
                    map.set(insertPath, []);
                }

                if (map.get(insertPath).every(info => info.path !== options.path)) {
                    map.get(insertPath).push({
                        path: options.path,
                        md5: options.md5,
                        fullPath: options.fullPath
                    });
                }
            });

            let list = await Promise.all(
                insertPaths.map(async fullPath => {
                    let result = '';

                    if (!await fs.exists(fullPath)) {
                        app.logger.warn(`${fullPath} isn't exist`);
                        return result;
                    }

                    try {
                        result = await fs.readFile(fullPath, 'utf-8');
                    }
                    catch (e) {
                        app.logger.warn(`readFile ${fullPath} error`);
                    }

                    return result;
                })
            );

            let index = 0;

            return md.replace(REGEX_GLOBAL, () => list[index++]);

        }, this.priority);
    }
}
