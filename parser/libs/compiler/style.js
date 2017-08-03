/**
 * @file style.js 解析 style 标签相关的工具
 * @author tanglei (tanglei02@baidu.com)
 */

import stylus from 'stylus';
import minifier from 'html-minifier';
import {countPrefixSpace, contain} from '../utils/basic';

const minifyEngine = minifier.minify;

/**
 * 判断 css 代码块是否为空
 *
 * @param {string} css css 代码块
 * @return {boolean} 是否为空
 */
export function empty(css) {
    return css.split('\n').every(str => /^[ ]*$/.test(str));
}

/**
 * 编译 stylus
 *
 * @param {string} style stylus 字符串
 * @param {Object=} options options
 * @param {Object} options.logger logger
 * @return {string} css
 */
export function compileStylus(style, {logger = console}) {
    try {
        let arr = style.replace(/\t/mg, '    ')
            .split('\n')
            .filter(str => !/^[ ]*$/.test(str));

        let spaceLen = arr.reduce(
            (res, str) => Math.min(res, countPrefixSpace(str)),
            style.length
        );

        style = arr.map(str => str.slice(spaceLen)).join('\n');
        return stylus.render(style);
    }
    catch (e) {
        logger.error('Error in Parsing stylus:');
        logger.error(e);

        return '';
    }
}

/**
 * 给 css 增加 scope
 * .a .b {background: #000} => .a[unique-string] .b {background: #000}
 *
 * @param {string} style style
 * @param {string} unique scope string
 * @return {string} scoped style
 */
export function scope(style, unique) {
    return style.replace(
        /(^|\n)([^@]+?)( \{[\s\S]+?\})/mg,
        (str, gap, selector, attr) => `${gap}[${unique}] ${selector.trim()}${attr}`
    );
}

/**
 * 压缩 css
 *
 * @param {string} style 标签块
 * @param {Object=} options options
 * @param {Object=} options.logger logger
 * @return {string} 压缩后的 style 标签块
 */
export function minify(style, {logger = console} = {}) {
    try {
        style = minifyEngine(style, {
            minifyCSS: true
        });
    }
    catch (e) {
        logger.error('Error in minify css:');
        logger.error(e);
    }

    return style;
}

/**
 * 处理 html 片段中的 style 标签块
 *
 * @param {string} html html 片段
 * @param {Object=} options options
 * @param {Object=} options.logger logger
 * @param {Object=} options.scope style 标签块作用域标识
 * @return {string} 处理好的 html
 */
export function process(html, {logger = console, unique} = {}) {
    return html.replace(
        /<style([\s\S]*?)>([\s\S]*?)<\/style>/mg,
        (str, attr, css) => {
            // 空的 style 直接干掉
            if (empty(css)) {
                return '';
            }
            // stylus 解析
            if (contain(attr, 'lang="stylus"')) {
                css = stylus.render(css, {logger});

                if (css) {
                    attr = attr.replace(' lang="stylus"', '');
                }
                else {
                    return '';
                }
            }
            // 限定 css 的作用域
            if (unique && !contain(attr, 'scoped="off"')) {
                css = scope(css, unique);
            }
            else {
                attr = attr.replace('scoped="off"', '');
            }
            // 压缩 css
            let style = `<style${attr}>${css}</style>`;
            style = minify(style, {logger});

            return style;
        }
    );
}
