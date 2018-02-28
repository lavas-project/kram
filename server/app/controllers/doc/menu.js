/**
 * @file doc menu api
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

    let {getMenu, getMenuItem, getMenuPath} = ctx.app.doc;

    let menuInfo;

    if (path) {
        path = decodeURI(path);
    }
    else {
        url = decodeURI(url);
        path = await getMenuPath(url);

        if (!path) {
            return ctx.json({
                status: 1,
                msg: '找不到相应的列表'
            });
        }
    }

    let needMenuInfo = +ctx.param('needMenuInfo');

    if (needMenuInfo) {
        menuInfo = await getMenuItem(path);
    }
    else {
        menuInfo = await getMenu(path);
    }

    if (menuInfo) {
        return ctx.json({
            status: 0,
            data: menuInfo
        });
    }

    return ctx.json({
        status: 1,
        msg: '找不到相应的列表'
    });
};
