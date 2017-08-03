/**
 * @file html.js html 字符串相关处理方法
 * @author tanglei (tanglei02@baidu.com)
 */

/**
 * 生成标签对字符串
 *
 * @param {string} tag 标签名
 * @param {string} content 标签内容
 * @param {string} props 标签属性
 * @return {string} 标签字符串
 */
export function tag(tag, content = '', props = '') {
    return `<${tag} ${props}>${content}</${tag}>`;
}

/**
 * 编码标签对
 *
 * @param {string} str 待编码的字符串
 * @return {string} 编码后的字符串
 */
export function encodeTag(str) {
    return str.replace(/</mg, '&lt;').replace(/>/mg, '&gt;');
}

/**
 * 解码引号 " '
 *
 * @param {string} str 待解码字符串
 * @return {string} 解码后的字符串
 */
export function decodeQuote(str) {
    return str.replace(/&quot;/mg, '"').replace(/&apos;/mg, '\'');
}

/**
 * 获取过滤 html 标签之后的文本
 *
 * @param {string} str 待过滤字符串
 * @return {string} 纯文本
 */
export function plainify(str) {
    // material icon 给过滤掉
    str = str.replace(
        /<i [^<]*?class="[\w ]*material-icons[\w ]*"[^<]*?>[^<]*?<\/i>/g,
        ''
    );

    let matchRegExp = /<[^<]+?>([\s\S]*?)<\/[^<]+?>/m;
    let replaceRegExp = /<[^<]+?>([\s\S]*?)<\/[^<]+?>/mg;

    // 保留 html 标签里的内容 <a>...</a> <code>...</code>
    // 用循环去除嵌套标签
    while (str.match(matchRegExp)) {
        str = str.replace(replaceRegExp, '$1');
    }
    // 去除空行并合并多行
    str = str.split('\n').map(line => line.trim()).join('');
    // 剩余的 比如 <haha> 之类的将标签对编码掉
    return encodeTag(str);
}

export function createIndexHTML(code, className) {
    let html = code
        .split('\n')
        .map((c, i) => `<div>${i + 1}</div>`)
        .join('');

    return `<div class="${className}">${html}</div>`;
}
