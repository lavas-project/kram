/**
 * @file marked.js 默认配置文件
 * @author tanglei (tanglei02@baidu.com)
 */
import marked from 'marked';

export const BUILDIN_RENDERER_METHODS = Object.assign(
    /** @lends marked.Renderer.prototype */
    {},
    marked.Renderer.prototype
);

export default function (app) {
    return {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: app.module.highlighter.highlight,
        renderer: BUILDIN_RENDERER_METHODS
    };
}
