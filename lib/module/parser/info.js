/**
 * @file 获取文章信息
 * @author tanglei (tanglei02@baidu.com)
 */
const INFO_REGEX = /^(.+?[:：].+?\r?\n)+(-+\r?\n)/mg;

class Info {
    constructor() {
        this.template = tpl;
    }

    apply(on, app) {
        let map = new Map();

        let {
            BEFORE_PARSE,
            // RENDER_HEADING,
            CREATE_DOC_STORE_OBJECT
        } = app.module.hook.STAGES;

        on(BEFORE_PARSE, (md, options) => md.replace(INFO_REGEX, str => {
            let info = str.split('\n')
                .filter(line => !/^\s+$/.test(line))
                .map(line => line.match(/^(.+?)[:：](.*)/))
                .filter(match => match != null)
                .reduce((res, match) => {
                    res[match[1].trim()] = match[2].trim();
                    return res;
                }, {});

            map.set(options.path, info);

            return this.template(info, options, app);
        }));

        on(CREATE_DOC_STORE_OBJECT, obj => {
            let info = map.get(obj.path);
            if (info) {
                obj.info = info;
            }

            return obj;
        });
    }

    setTemplate(template) {
        this.template = template;
    }
}

function tpl({title, author, time, tag}, options, app) {
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

export default function (app) {
    let infoPlugin = new Info();

    const info = {
        setTemplate(...args) {
            infoPlugin.setTemplate(...args);
        }
    };

    app.addModule('info', () => info);

    return () => {
        app.module.plugin.register('info', infoPlugin);
    };
}
