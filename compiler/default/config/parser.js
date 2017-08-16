/**
 * @file marked.js 默认配置文件
 * @author tanglei (tanglei02@baidu.com)
 */
import marked from 'marked';
// import {highlight} from '../../lib/module/renderer/highlight';

// export const defaultRenderer = new marked.Renderer();
export const BUILDIN_RENDERER_METHODS = Object.assign({}, marked.Renderer.prototype);

export default function (app) {
    return {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: app.highlight,
        renderer: BUILDIN_RENDERER_METHODS
    };
}
