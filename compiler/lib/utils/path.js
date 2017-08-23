/**
 * @file 路径处理相关
 * @author tanglei (tanglei02@baidu.com)
 */
import glob from 'glob';
import path from 'path';

/**
 * 路径分隔符替换 由 windows 上的 \ 分隔符统一替换成 /
 *
 * @param {string} str 路径字符串
 * @return {string} 处理好的路径
 */
export function sep(str) {
    return str.replace(/\\/g, '/').replace(/\/$/, '');
}

/**
 * 生成以 / 为分隔符的路径
 *
 * @param {...string} arr 待拼接的路径
 * @return {string} 拼接好的路径
 */
export function join(...arr) {
    return sep(path.join(...arr));
}

/**
 * 去除路径中的后缀
 * 如：a/b/c.txt => a/b/c
 *
 * @param {string} str 待处理路径字符串
 * @param {string} ext 待去除的尾缀
 * @return {string} 去除后的路径字符串
 */
export function removeExt(str, ext) {
    let len = ext.length;

    if (str.slice(-len) === ext) {
        return str.slice(0, -len);
    }

    return str;
}


export function removePrefix(str, prefix) {
    let len = prefix.length;
    if (str.slice(0, len) === prefix) {
        str = str.slice(len);

        if (str[0] === '/') {
            str = str.slice(1);
        }

        return str;
    }

    return str
}

export function level(dir) {
    return dir.split('/').length;
}

export function getDirs(baseDir, ext = '') {
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
