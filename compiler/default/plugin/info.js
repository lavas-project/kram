/**
 * @file 获取文章信息
 * @author tanglei (tanglei02@baidu.com)
 */
const INFO_REGEX = /^(.+?[:：].+?\r?\n)+(-+\r?\n)/mg;

export default class Info {
    constructor({
        priority,
        template = tpl
    } = {}) {
        this.priority = priority;
        this.template = template;
    }

    apply(on, app) {
        // let map = new Map();

        on(app.module.hook.STAGES.BEFORE_PARSE, function (md, options) {
            return md.replace(INFO_REGEX, str => {
                let data = str.split('\n')
                    .filter(line => !/^\s+$/.test(line))
                    .map(line => line.match(/^(.+?)[:：](.*)/))
                    .filter(match => match != null)
                    .reduce((res, match) => {
                        res[match[1].trim()] = match[2].trim();
                        return res;
                    }, {});

                return this.template(data, options, app);
            });
        }, this.priority);
    }

    setTemplate(template) {
        this.template = template;
    }
}

export function tpl({title, author, time, tag}, options, app) {
    let titleHtml = title ? `<h1>${title}</h1>` : '';
    let authorHtml = author ? listHtml(author, 'km-author') : '';
    let tagHtml = tag ? listHtml(tag, 'km-tag') : '';
    let timeHtml = time ? `<p class="km-release-time">${time}</p>` : '';

    return '<div class="km-header">'
        + titleHtml
        + authorHtml
        + tagHtml
        + timeHtml
        + '</div>';
}

function listHtml(str, className) {
    let list = str.split(/[,，]/).map(str => `<li>${str.trim()}</li>`).join('');
    return list ? `<ul class="${className}">${list}</ul>` : '';
}
