/**
 * @file doc search api 一个简易版的文档搜索
 * @author tanglei (tanglei02@baidu.com)
 */
const path = require('path');
const utils = require('../../utils/basic');

module.exports = async function search(ctx) {
    let query = ctx.param('query');

    if (!query) {
        return ctx.json({
            status: 1,
            msg: '请输入搜索关键字'
        });
    }

    let queryList = query.toLowerCase().split(/\s/).filter(q => !!q);
    let queryListLength = queryList.length;

    if (queryListLength === 0) {
        return ctx.json({
            status: 1,
            msg: '请输入搜索关键字'
        });
    }

    let {getEntryPaths, get, config} = ctx.app.doc;

    let scope = ctx.param('scope');

    let entryPaths = await getEntryPaths(scope && (entryPath => utils.startWith(entryPath, scope)));

    if (!utils.isValidArray(entryPaths)) {
        return ctx.json({
            status: 1,
            msg: '找不到相应的文章'
        });
    }

    entryPaths = entryPaths.filter(entryPath => {
        let folder = entryPath.split('/')[0];
        let source;

        for (let i = 0; i < config.sources.length; i++) {
            let basename = path.basename(config.sources[i].to);
            if (basename === folder) {
                source = config.sources[i];
                break;
            }
        }

        if (!source || source.searchable === false) {
            return false;
        }

        return true;
    });

    if (!utils.isValidArray(entryPaths)) {
        return ctx.json({
            status: 1,
            msg: '找不到相应的文章'
        });
    }

    let docInfos = await Promise.all(entryPaths.map(entryPath => get('doc', entryPath)));

    let result = docInfos
        .filter(info => info && info.info && !!info.info.menu && !!info.info.breadcrumbs)
        .filter(info => {
            let tag;

            if (info.info.tag) {
                if (Array.isArray(info.info.tag)) {
                    tag = info.info.tag.map(str => (str + '').toLowerCase()).join(' ');
                }
                else {
                    tag = (str + '').toLowerCase();
                }
            }
            else {
                tag = '';
            }

            let breadcrumbs = info.info.breadcrumbs.toLowerCase();
            let title = info.info.title.toLowerCase();
            let description = info.info.description.toLowerCase();
            let str = [tag, title, breadcrumbs, description].join(' ');

            return queryList.every(query => str.indexOf(query) > -1);
        })
        .map(info => {
            let {url, info: {title, description, menu, breadcrumbs}, path} = info;
            return {title, description, url, path, menu, breadcrumbs};
        });

    if (!result.length) {
        return ctx.json({
            status: 2,
            msg: '找不到相应的文章'
        });
    }

    return ctx.json({
        status: 0,
        data: result
    });
};
