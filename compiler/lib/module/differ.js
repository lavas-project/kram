/**
 * @file differ.js 文件 diff 模块
 * @author tanglei (tanglei02@baidu.com)
 */

import glob from 'glob';
import crypto from 'crypto';
import fs from 'fs-extra';

export default function (app) {
    const md5map = new Map();

    const differ = {
        diffAll(infos) {
            return Promise.all(
                infos.map(async info => differ.diff(info))
            );
        },

        async diff({source, info}) {
            if (info != null) {
                return {source, info};
            }

            let dirs = await getDirs(source.to, '.*');
            let results = await Promise.all(
                dirs.map(async dir => await differ.detect(dir))
            );
            results = results.filter(result => result !== false);
            results.forEach(result => differ.update(result));

            info = results.reduce((res, {type, dir}) => {
                res[type] = res[type] || [];
                res[type].push(dir);
                return res;
            }, {});

            return {source, info};
        },

        async detect(dir) {
            let mappedMD5 = md5map.get(dir);

            if (!await fs.exists) {
                if (mappedMD5) {
                    return {dir, type: 'delete'};
                }

                return false;
            }

            let file = await fs.readFile(dir);
            let md5 = crypto.createHash('md5').update(file).digest('hex');

            if (mappedMD5 === md5) {
                return false;
            }

            if (mappedMD5) {
                return {dir, md5, type: 'modify'};
            }

            return {dir, md5, type: 'add'};
        },

        update({dir, md5, type}) {
            if (type === 'delete') {
                md5map.delete(dir);
            }
            else {
                md5map.set(dir, md5);
            }
        }
    };
}

function getDirs(baseDir, ext = '') {
    return new Promise((resolve, reject) => {
        glob(path.resolve(baseDir, '**/*' + ext), (err, dirs) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(dirs);
            }
        });
    });
}
