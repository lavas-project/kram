/**
 * @file mapURL 将文档中的相对地址变成实际路径的方法
 * @author tanglei (tanglei02@baidu.com)
 */
import {join} from '../utils/path';
import urlUtils from 'url';
import {get} from '../utils/basic';

const MAP = [
    {

        regex: /\[([^\[]+?)\]\(([^\(]+)( ?[^\(]*?)\)/mg,
        replace(opts, str, alt, url, title) {
            url = completeURL(url, opts);
            return `[${alt}](${url}${title})`;
        }
    },
    {
        regex: /(<[a-zA-Z0-9-]+ [^<]*?)(href|src)=(.*?)(>| [^<]*?>)/mg,
        replace(opts, str, achorStart, propName, url, achorEnd) {
            let quote = getQuote(url);

            if (quote) {
                url = url.slice(1, -1);
            }

            url = completeURL(url, opts);

            if (quote) {
                url = quote + url + quote;
            }

            return `${achorStart}${propName}=${url}${achorEnd}`;
        }
    }
];

export function mapURL(md, opts) {
    return MAP.reduce(
        (md, {regex, replace}) => md.replace(
            regex,
            (...args) => {
                args.unshift(opts);
                return replace(...args);
            }
        ),
        md
    );
}

export function docURL({path, repo}) {
    let docPath = path;
    let route = get(repo, 'route');

    if (route) {
        return join(route, path);
    }

    return docPath;
}


function completeURL(url, {repo, path, host}) {
    if (isRelativeURL(url)) {
        return join(docURL({repo, path}), '..', url);
    }

    if (host) {
        let info = urlUtils.parse(url);
        let hostInfo = urlUtils.parse(host);
        // 如果域名一样 那就不用写 hostname 前面的部分啦
        if (info.hostname === hostInfo.hostname) {
            return url.split(info.hostname).slice(1).join(info.hostname);
        }
    }

    return url;
}

function isRelativeURL(str) {
    return /^\.{1,2}\//.test(str);
}

function getQuote(str) {
    if (str.length < 2) {
        return null;
    }

    let start = str[0];
    let end = str.slice(-1);

    if (start === end) {
        return start;
    }

    return null;
}
