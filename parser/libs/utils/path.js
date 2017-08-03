/**
 * @file 路径处理相关
 * @author tanglei (tanglei02@baidu.com)
 */
import path from 'path';

/**
 * 路径分隔符替换 由 windows 上的 \ 分隔符统一替换成 /
 *
 * @param {string} str 路径字符串
 * @return {string} 处理好的路径
 */
export function delimiter(str) {
    return str.replace(/\\/g, '/').replace(/\/$/, '');
}

/**
 * 生成以 / 为分隔符的路径
 *
 * @param {...string} arr 待拼接的路径
 * @return {string} 拼接好的路径
 */
export function join(...arr) {
    return delimiter(path.join(...arr));
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
