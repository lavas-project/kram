/**
 * @file style.js 解析 style 标签相关的工具
 * @author tanglei (tanglei02@baidu.com)
 */

export default class Style {
    constructor({priority} = {}) {
        this.priority = priority;
    }

    apply(on, kram) {
        on('afterRender', function (html) {
            let style = [];

            html = html.replace(
                /<style[\s\S]*?>([\s\S]*?)<\/style>/mg,
                (str, css) => {
                    style.push(css);
                    return '';
                }
            );

            if (!style.length) {
                return html;
            }

            style = `<style>${style.join('\n')}</style>`;

            if (/<head>[\s\S]*?<\/head>/.test(html)) {
                return html.replace(/<\/head>/, `${style}\n</head>`);
            }

            return `${style}${html}`;
        }, this.priority);
    }
}
