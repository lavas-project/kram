/**
 * @file 生成文章章节结构的插件
 * @author tangei (tanglei02@baidu.com)
 */
import {
    get,
    ensureArray,
    isValidArray,
    plainify
} from '../../utils';

class Chapter {
    apply(on, app) {
        let {
            RENDER_HEADING,
            CREATE_DOC_STORE_OBJECT,
            DONE
        } = app.module.hook.STAGES;

        let map = new Map();

        on(RENDER_HEADING, (html, {args: [text, level, raw], path}) => {

            // 从每篇文章的 h1 - h6 标签中提取出 hash
            let hash = '#' + raw.trim()
                .toLowerCase()
                .replace(/[^0-9a-zA-Z_ \u0391-\uFFE5+]/g, '')
                .replace(/ +/g, '-');

            // 提取内容
            let content = plainify(html);

            let info = map.get(path) || {hashMap: {}, list: []};

            if (info.hashMap[hash] == null) {
                info.hashMap[hash] = 0;
            }
            else {
                info.hashMap[hash]++;
                hash += info.hashMap[hash];
            }

            info.list.push({level, hash, text: content});
            map.set(path, info);

            // 生成新的 h1 - h6
            return html.replace(/(<h[1-6])(>| [^<]*?>)/mg, (str, start, end) => {
                end = end.slice(0, -1) + ` data-hash="${hash}">`;
                return start + end;
            });
        });

        on(CREATE_DOC_STORE_OBJECT, obj => {
            let info = map.get(obj.path);
            if (!get(info, 'list.length')) {
                app.logger.warn(`[kram][chapter] no title information in ${obj.path}`);
                return;
            }

            // 挂载到文档存储对象中
            obj.chapters = buildTree(info.list);
            return obj;
        });

        on(DONE, () => {
            // 清理缓存
            map = new Map();
        });
    }
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

export default function (app) {
    let chapterPlugin = new Chapter();
    return () => {
        app.module.plugin.register('chapter', chapterPlugin);
    };
}
