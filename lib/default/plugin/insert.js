/**
 * @file 插入外部字符串
 * @author tanglei (tanglei02@baidu.com)
 */

import path from 'path';
import {relativePath, first} from '../../utils';

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
            AFTER_FILTER_FILE,
            FILTER_ENTRY,
            BEFORE_PARSE
        } = app.module.hook.STAGES;

        let map = new Map();

        on(AFTER_FILTER_FILE, docInfos => {
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

        on(FILTER_ENTRY,
            entryInfos => entryInfos.filter(
                info => !/\.partial\./.test(info.path)
            )
        );

        on(BEFORE_PARSE, (md, options) => {
            let matches = md.match(REGEX_GLOBAL);
            if (!matches) {
                return;
            }

            let insertPaths = matches.map(matched => {
                let originalPath = matched.match(REGEX)[1].trim();
                let fullPath = path.resolve(options.fullPath, '..', originalPath);
                return relativePath(app.config.basePath, fullPath);
            });

            insertPaths.forEach(insertPath => {
                if (!map.get(insertPath)) {
                    map.set(insertPath, []);
                }

                if (map.get(insertPath).every(info => info.path !== options.path)) {
                    map.get(insertPath).push({
                        path: options.path,
                        md5: options.md5,
                        file: options.file,
                        fullPath: options.fullPath
                    });
                }
            });

            const fileInfos = app.fileInfos;

            let replaceList = insertPaths.map(insertPath => {
                let info = first(fileInfos, info => info.path === insertPath);

                if (info) {
                    return info.file;
                }

                app.logger.warn(`[kram][plugin][insert] ${insertPath} isn't exist`);
                return '';
            });

            let index = 0;

            return md.replace(REGEX_GLOBAL, () => replaceList[index++]);

        }, this.priority);
    }
}
