/**
 * @file js.js
 * @author sekiyika (px.pengxing@gmail.com)
 */

module.exports = function (app) {

    /**
     * 转义需要直接填充到js变量中的字符串
     * example: var text = '${text|js}';
     *
     * @param {string} str string
     * @return {string} string
     */
    return function js(str) {
        return String(str)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, '\\\'')
            .replace(/"/g, '\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\n')
            .replace(/<\//g, '<\\/');
    };

};
