/**
 * @file mapURL 将文档中的相对地址变成实际路径的方法
 * @author tanglei (tanglei02@baidu.com)
 */

export default class URLPlugin {
    constructor() {

    }

    apply(on, kram) {
        on('beforeRender', function (md, options) {
            console.log('in url plugin - before renderer')
            return md.replace(
                /\[([^\[]+?)\]\(([^\(]+)( ?[^\(]*?)\)/mg,
                '[zhuoxiaoji](#haha)'
            );
        });

        on('afterRender', function (html, options) {
            console.log('in url plugin - after renderer')
            return html;
        });
    }
}
