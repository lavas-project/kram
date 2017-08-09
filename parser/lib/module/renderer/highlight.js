/**
 * @file highlight.js 代码高亮相关
 * @author tanglei (tanglei02@baidu.com)
 */

import hljs from 'highlight.js';
import {locals} from '../../share/locals';
import {isObject} from '../../utils/basic';
import {encodeTag} from '../../utils/html';

/**
 * highlight.js 配置
 *
 * @param {Object} options 配置参数
 */
export function configure({register, config} = {}) {
    if (isObject(register)) {
        Object.keys(register).forEach(key => hljs.registerLanguage(key, register[key]));
    }

    if (isObject(config)) {
        hljs.configure(Object.assign({}, locals.default.highlight.config, config));
    }
}


/**
 * 高亮代码块
 *
 * @param {string} code 代码
 * @param {string} language 代码语言
 * @return {string} 高亮好的代码块
 */
export function highlight(code, language) {
    if (hljs.getLanguage(language)) {
        try {
            return hljs.highlight(language, code).value;
        }
        catch (e) {
            // auto 的染色都是有问题的 还不如不染了
            locals.logger.error(`Error in highlight lang=${language}:`);
        }
    }

    return encodeTag(code);
}
