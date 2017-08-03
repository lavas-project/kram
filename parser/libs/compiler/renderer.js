/**
 * @file markdown 渲染器
 * @author tanglei (tanglei02@baidu.com)
 */

import marked from 'marked';
import url from 'url';
import path from 'path';
import {removeExt} from '../utils/path';
import {highlight} from './highlight';
import {process as processStyle} from './style';
import {merge, chunk} from '../utils/basic';
import {
    tag,
    plainify,
    decodeQuote,
    createIndexHTML
} from '../utils/html';

export const defaultRenderer = {
    heading(text, level, raw, {hash, plainText, id}) {
        return `
            <h${level} data-id="${id}" class="md-heading">
                <a class="heading-link" href="${hash}">
                    <i class="material-icons">link</i>
                </a>
                ${text}
            </h${level}>
        `;
    },
    link(href, title, text) {
        if (title === '{=download=}') {
            let filename = path.basename(href);
            return `
                <a href="${href}" download="${filename}">
                    ${text}<i class="material-icons">file_download</i>
                </a>
            `;
        }

        title = title ? `title="${title}"` : '';
        let info = url.parse(href);

        if (info.hostname) {
            return `
                <a href="${href}" ${title} target="_blank">
                    ${text}<i class="material-icons">open_in_new</i>
                </a>
            `;
        }

        href = removeExt(href, '.md');

        return `<a href="${href}" ${title}>${text}</a>`;
    },
    image(href, text, alt) {
        let titleProp = text ? `title="${text}"` : '';
        let altProp = alt ? `alt="${alt}"` : '';
        let descHTML = text ? `<p>${text}</p>` : '';

        return `
            <div class="md-img">
                <img class="ui-dep-2" src="${href}" ${altProp} ${titleProp}>
                ${descHTML}
            </div>
        `;
    },
    html(html) {
        return processStyle(html, {unique: this.unique, logger: this.logger});
    },
    blockquote(quote) {
        let [one, ...quotes] = quote.split(/<p>({=(.*?)=}|info|error|warn)<\/p>/mg);

        return ''
            + (one ? tag('blockquote', one) : '')
            + chunk(quotes, 3)
            .map(([className, props, content]) => {
                props = props !== undefined ? decodeQuote(props) : 'class="className"';
                return tag('blockquote', content, props);
            })
            .join('');
    },
    code(code, language) {
        code = highlight(code, language, {logger: this.logger});

        let className = language ? ` class="lang-${language}"` : '';
        let indexHTML = this.lineNumber ? createIndexHTML(code, 'code-index') : '';

        // 必须得写成一行，不然 pre 和 code 之间会有诡异间距
        return `<pre${className}>${indexHTML}<code>${code}</code></pre>`;
    }
};

export const Renderer = marked.Renderer;

export function adapter({renderer} = {}) {
    let conf = Object.assign({}, defaultRenderer, renderer);
    let newRenderer = new Renderer();
    merge(newRenderer, conf);

    newRenderer.config = function ({scope, lineNumber = true, unique, logger}) {
        merge(this, {
            headingId: 0,
            headings: [],
            hashMap: {},
            scope,
            unique,
            lineNumber,
            logger
        });
    };

    newRenderer.createId = function () {
        let id = `md-heading-${this.headingId}`;
        this.headingId++;
        return id;
    };

    newRenderer.hashify = function (plainText, append = true) {
        let hash = '#' + plainText.replace(/ +/g, '-');

        if (append) {
            if (this.hashMap[hash] == null) {
                this.hashMap[hash] = 0;
            }
            else {
                this.hashMap[hash]++;
            }
        }

        if (this.hashMap[hash]) {
            hash += this.hashMap[hash] + (append ? '' : 1);
        }

        return hash;
    };

    let rawHeading = newRenderer.heading;

    newRenderer.heading = function (text, level, raw) {
        let id = this.createId();
        let plainText = plainify(text);
        let hash = this.hashify(plainText);

        let html = rawHeading(text, level, raw, {id, plainText, hash});

        this.headings.push({
            id,
            text: plainText,
            level,
            hash
        });

        return html;
    };

    return newRenderer;
}
