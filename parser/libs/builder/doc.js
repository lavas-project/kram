/**
 * @file 生成文档 map
 * @author tanglei (tanglei02@baidu.com)
 */

import fs from 'fs-extra';
import {markdown} from '../compiler/markdown';
import {set} from '../utils/basic';

export async function buildDocMap(structs, {logger = console, host, repo}) {
    let opts = {logger, host, repo};

    let infos = await Promise.all(
        structs.map(async info => {
            if (info.children) {
                return await buildDocMap(info.children, opts);
            }

            try {
                let md = await fs.readFile(info.path, 'utf-8');
                return {
                    key: info.key,
                    value: markdown.parse(md, {
                        path: info.key,
                        host: host,
                        repo: repo
                    })
                };
            }
            catch (e) {
                logger.error(e);
                return null;
            }
        })
    );

    return infos
        .filter(info => info != null)
        .reduce((res, info) => {
            if (info && info.key && info.value) {
                return set(res, info.key, info.value);
            }

            return Object.assign(res, info);
        }, {});
}
