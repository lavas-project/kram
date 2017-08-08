/**
 * @file marked.js 默认配置文件
 * @author tanglei (tanglei02@baidu.com)
 */
import marked from 'marked';
import {highlight} from '../../lib/component/highlight';

export const defaultRenderer = new marked.Renderer();

export default {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: highlight,
    renderer: defaultRenderer
};
