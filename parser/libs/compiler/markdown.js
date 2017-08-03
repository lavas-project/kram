/**
 * @file markdown 解析器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
import crypto from 'crypto';
import {minify} from 'html-minifier';
import {mapURL, docURL} from './url';
import {adapter} from './renderer';
import {hljsRegister, hljsConfigure} from './highlight';

import {
    merge,
    get,
    ensureArray,
    isValidArray
} from '../utils/basic';

const markedOpts = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
};

export let markdown = {
    config({
        logger = console,
        marked: {
            scope = true,
            options = {}
        } = {},
        highlight: {
            configure,
            register,
            lineNumber = true
        } = {}
    } = {}) {
        merge(this, {logger, scope});

        // 配置 renderer
        let renderer = adapter(options);
        renderer.config({lineNumber, logger, scope});
        this.renderer = renderer;

        // 配置 marked
        let opts = Object.assign({}, markedOpts, options, {renderer});
        marked.setOptions(opts);

        // 配置 highlight
        if (isValidArray(register)) {
            register.forEach(reg => hljsRegister(reg));
        }

        if (configure) {
            hljsConfigure(configure);
        }
    },
    parse(md, {path, host, repo}) {
        // 配置 renderer
        let unique = this.scope ? createUnique(md) : '';
        this.renderer.config({path, unique});
        // url 处理
        md = mapURL(md, {path, host, repo});
        // md -> html
        let html = marked(md);

        let headings = this.renderer.headings;
        // 生成章节
        let chapters = buildTree(headings);
        // 获取文章标题
        let title = get(headings, 0, 'text') || '';
        // 插入 文档相关 html
        html = html + relatedHTML({title, repo, path});
        // scope html
        html = `<div ${unique}>${html}</div>`;
        // 文本压缩
        html = minifyHTML(html, {logger: this.logger}).replace(/<p><\/p>/mg, '');
        // 获取本文 url
        let url = docURL({path, repo});

        return {chapters, html, title, url};
    }
};

markdown.config();

/**
 * 利用 markdown 文本生成文章的 md5 戳
 *
 * @param {string} md markdown 文本
 * @return {string} md5 string
 */
function createUnique(md) {
    return 'data-md-' + crypto.createHash('md5')
        .update(md.slice(0, 100))
        .digest('hex')
        .slice(0, 6);
}

/**
 * 通过章节标题生成树形结构的章节数据
 *
 * @param {Array} arr 章节标题数组
 * @return {Array} 树形结构
 */
function buildTree(arr) {
    if (!isValidArray(arr)) {
        return arr;
    }

    let [first, ...rest] = arr;

    return rest.reduce((res, info) => {
            let last = res[res.length - 1];

            if (last.level < info.level) {
                last.children = ensureArray(last.children).concat(info);
            }
            else {
                res.push(info);
            }

            return res;
        }, [first])
        .map(info => {
            if (info.children) {
                info.children = buildTree(info.children);
            }

            return info;
        });
}

/**
 * 文章的编辑和反馈信息 ui
 *
 * @param {Object} options options
 * @param {Object} options.repo 仓库信息
 * @param {string} options.title 文章标题
 * @param {string} options.path 当前文章路径
 * @return {string} html
 */
function relatedHTML({repo, title, path}) {
    let githubConf = get(repo, 'github');

    if (!githubConf) {
        return '';
    }

    let github = githubConf.replace(/^github:/, 'https://github.com/');
    let fileEdit = github + `/edit/master/${path}.md`;

    return `
        <div class="md-related-wrapper">
            <a class="md-related to-edit ui-dep-2"
                href="${fileEdit}"
                target="_blank"
            >
                <div class="md-ripple"></div>
                <i class="material-icons">mode_edit</i>编辑
            </a>
            <a class="md-related to-feedback ui-dep-2"
                target="_blank"
                href="${github}/issues/new?title=反馈：${title}"
            >
                <div class="md-ripple"></div>
                <i class="material-icons">feedback</i>反馈
            </a>
        </div>
    `;
}

/**
 * 压缩 html
 *
 * @param {string} html 压缩前的 html
 * @param {Object=} options options
 * @param {Object} options.logger logger
 * @return {string} 压缩后的 html
 */
function minifyHTML(html, {logger}) {
    try {
        html = minify(html, {
            collapseWhitespace: true
        });
    }
    catch (e) {
        logger.error(e);
    }

    return html;
}
