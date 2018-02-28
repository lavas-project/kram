/**
 * @file doc detail api
 * @author tanglei (tanglei02@baidu.com)
 */

module.exports = async function (ctx) {
    let url = ctx.param('url');
    let path = ctx.param('path');

    if (!url && !path) {
        return ctx.json({
            status: 1,
            msg: '缺少参数'
        });
    }

    let {getDocByUrl, getDoc} = ctx.app.doc;

    let docInfo;

    if (path) {
        path = decodeURI(path);
        docInfo = await getDoc(path);
    }
    else {
        url = decodeURI(url);
        docInfo = await getDocByUrl(url);
    }

    if (docInfo) {
        return ctx.json({
            status: 0,
            data: {
                html: docInfo.html,
                chapters: docInfo.chapters,
                info: docInfo.info,
                url: docInfo.url,
                path: docInfo.path
            }
        });
    }

    return ctx.json({
        status: 1,
        msg: '找不到相应的文章'
    });
};

