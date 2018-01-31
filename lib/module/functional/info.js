/**
 * @file 获取文章信息
 * @author tanglei (tanglei02@baidu.com)
 */

import path from 'path';

const INFO_REGEX = /^(.+?[:：].+?\r?\n)+(-+\r?\n)/mg;

class Info {
    apply(on, app) {
        let map = new Map();

        let {
            BEFORE_PARSE,
            CREATE_DOC_STORE_OBJECT
        } = app.STAGES;

        on(BEFORE_PARSE, (md, options) => md.replace(INFO_REGEX, str => {

            // 如果文章开头存在：
            // a: 1
            // b: 2
            // ------
            //
            // 这样的类似结构，则将这些数据提取出来作为文档相关数据

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
