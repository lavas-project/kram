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

/**
 * 移除路径前缀
 *
 * @param {string} str 待处理的路径字符串
 * @param {string} prefix 路径前缀
 * @return {string} 移除后的结果
 */
export function removePrefix(str, prefix) {
    let len = prefix.length;
    if (str.slice(0, len) === prefix) {
        str = str.slice(len);

        if (str[0] === '/') {
            return str.slice(1);
        }
    }

    return str;
}

/**
 * 获取路径层级
 *
 * @param {string} dir 路径字符串
 * @return {number} 路径层级
 */
export function level(dir) {
    return dir.split('/').length;
}

/**
 * 获取特定目录下的满足特定后缀名文件的全部路径
 *
 * @param {string} basePath 目录路径
 * @param {string|Array} ext 后缀名 or 列表
 * @return {Array} 全部路径
 */
export function getPaths(basePath, ext = '') {
    let extStr;

    if (Array.isArray(ext)) {
        extStr = `@(${ext.join('|')})`;
    }
    else {
        extStr = ext;
    }

    return new Promise((resolve, reject) => {
        glob(path.resolve(basePath, '**/*' + extStr), (err, dirs) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(dirs);
            }
        });
    });
}

/**
 * a 是否为 b 的子路径
 *
 * @param {string} subpath 待检测的路径
 * @param {string} rootpath 根路径
 * @return {boolean} 判断 subpath 是否在 rootpath 下
 */
export function isSubpath(subpath, rootpath) {
    let relativePath = path.relative(subpath, rootpath);
    return relativePath.split(path.sep).every(str => str === '..');
}

/**
 * 获取相对路径
 *
 * @param {string} from 出发路径
 * @param {string} to 目标路径
 * @return {string} 相对路径
 */
export function relativePath(from, to) {
    return sep(path.relative(from, to));
    // return removePrefix(sep(dir), sep(baseDir))
}
