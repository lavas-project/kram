/**
 * @file 获取文章信息
 * @author tanglei (tanglei02@baidu.com)
 */

import path from 'path';

const INFO_REGEX = /^(.+?[:：].+?\r?\n)+(-+\r?\n)/mg;

class Info {
    constructor() {}

    apply(on, app) {
        let map = new Map();

        let {
            BEFORE_PARSE,
            CREATE_DOC_STORE_OBJECT
        } = app.STAGES;

        on(BEFORE_PARSE, (md, options) => md.replace(INFO_REGEX, str => {
            let info = str.split('\n')
                .filter(line => !/^\s+$/.test(line))
                .map(line => line.match(/^(.+?)[:：](.*)/))
                .filter(match => match != null)
                .reduce((res, match) => {
                    res[match[1].trim()] = match[2].trim();
                    return res;
                }, {});

            map.set(options.path, info);
        }));

        on(CREATE_DOC_STORE_OBJECT, obj => {
            let info = map.get(obj.path);
            if (info) {
                obj.info = info;
            }
            else if (obj.chapters) {
                obj.info = {
                    title: obj.chapters[0].text
                };
            }
            else {
                obj.info = {
                    title: path.basename(obj.path, path.extname(obj.path))
                };
            }

            return obj;
        });


    }
}

export default function (app) {
    let infoPlugin = new Info();

    return () => {
        app.module.plugin.register('info', infoPlugin);
    };
}
