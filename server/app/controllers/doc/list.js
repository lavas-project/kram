/**
 * @file codelab list api
 * @author tanglei (tanglei02@baidu..com)
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

    let {getMenu, getMenuByUrl, getUrl} = ctx.app.doc;

    let menus;

    if (path) {
        path = decodeURI(path);
        menus = await getMenu(path);
    }
    else {
        url = decodeURI(url);
        menus = await getMenuByUrl(url);
    }

    if (!menus) {
        return ctx.json({
            status: 2,
            msg: '找不到相应的列表'
        });
    }

    let list = await Promise.all(
        menus
        .filter(item => !!item.children)
        .map(async item => {
            let obj = {
                name: item.name,
                path: item.path,
                url: item.url,
                info: item.info || {}
            };

            if (!obj.url) {
                obj.url = await getUrl(obj.path);
            }

            return obj;
        })
    );

    return ctx.json({
        status: 0,
        data: list
    });
};
