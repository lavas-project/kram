/**
 * @file 插入外部字符串
 * @author tanglei (tanglei02@baidu.com)
 */
import fs from 'fs-extra';
import path from 'path';
import {relativeDir} from '../../lib/utils';

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
            AFTER_DIFF_DIR,
            BEFORE_PARSE
        } = app.module.hook.STAGES;

        let map = new Map();

        on(AFTER_DIFF_DIR, dirInfoList => {
            for (let i = 0; i < dirInfoList.length; i++) {
                let info = dirInfoList[i];
                let affects = map.get(info.dir);

                if (affects) {
                    for (let j = 0; j < affects.length; j++) {
                        if (dirInfoList.every(info => info.dir !== affects[j].dir)) {
                            dirInfoList.push(Object.assign({type: 'modify'}, affects[j]));
                        }
                    }
                }

                if (info.type === 'delete') {
                    map.delete(info.dir);
                }
            }

            return dirInfoList;
        });

        on(BEFORE_PARSE, async (md, options) => {
            let matches = md.match(REGEX_GLOBAL);
            if (!matches) {
                return;
            }

            let insertDirs = matches.map(matched => {
                let relativeDir = matched.match(REGEX)[1].trim();
                return path.resolve(options.fullDir, '..', relativeDir);
            });

            insertDirs.forEach(insertFullDir => {
                let insertDir = relativeDir(app.config.baseDir, insertFullDir);

                if (!map.get(insertDir)) {
                    map.set(insertDir, []);
                }

                if (map.get(insertDir).every(dirInfo => dirInfo.dir !== options.dir)) {
                    map.get(insertDir).push({
                        dir: options.dir,
                        fullDir: options.fullDir,
                        md5: options.md5
                    });
                }
            });

            let list = await Promise.all(
                insertDirs.map(async dir => {
                    let result = '';

                    if (!await fs.exists(dir)) {
                        app.logger.warn(`${dir} isn't exist`);
                        return result;
                    }

                    try {
                        result = await fs.readFile(dir, 'utf-8');
                    }
                    catch (e) {
                        app.logger.warn(`readFile ${dir} error`);
                    }

                    return result;
                })
            );

            let index = 0;

            return md.replace(REGEX_GLOBAL, () => list[index++]);

        }, this.priority);
    }
}
