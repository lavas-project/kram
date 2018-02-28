/**
 * @file menu info
 * @author tanglei (tanglei02@baidu.com)
 * @description 为文章对象添加 menu 信息
 */

module.exports = class MenuInfo {
    apply(on, app) {
        let needUpdate;

        on(app.STAGES.GET_CHANGED_ENTRY_FILES, entryInfos => {
            needUpdate = entryInfos.some(info => info.type === 'remove' || info.type === 'add');
        }, 10050);

        on(app.STAGES.DONE, async () => {
            if (!needUpdate) {
                return;
            }

            let entryPaths = await app.getEntryPaths();
            if (!entryPaths || !entryPaths.length) {
                return;
            }

            let allMenus = await app.getMenuItem();

            if (!allMenus || !allMenus.length) {
                return;
            }

            Promise.all(entryPaths.map(async entryPath => {
                let docInfo = await app.getDoc(entryPath);

                if (!docInfo) {
                    return;
                }

                // 查看该篇文章是否在目录中

                let menuPath = await app.getMenuPath(docInfo.url);

                if (!menuPath) {
                    return;
                }

                // 查找文章对应目录的名称

                let menus = getBreadcrumbs(allMenus, menuPath);

                if (menus) {
                    docInfo.info.menu = menus.join('/');
                }

                let breadcrumbs = getBreadcrumbs(allMenus, entryPath);

                if (breadcrumbs) {
                    docInfo.info.breadcrumbs = breadcrumbs.join('/');
                }

                await app.store.set('doc', docInfo.path, docInfo);
            }));

        }, 10050);
    }
};

function getMenuItemByPath(menuItem, path) {
    if (!menuItem) {
        return null;
    }

    let stack;

    if (Array.isArray(menuItem)) {
        stack = menuItem.slice(0);
    }
    else {
        stack = [menuItem];
    }

    while (stack.length) {
        let item = stack.shift();
        if (item.path === path) {
            return item;
        }

        if (path.indexOf(item.path) === 0 && item.children && item.children.length) {
            stack = stack.concat(item.children);
        }
    }

    return null;
}

function getBreadcrumbs(allMenus, targetPath) {
    let menu = allMenus;
    let paths = targetPath.split('/');
    let breadcrumbs = [];

    for (let i = 0; i < paths.length; i++) {
        let path = paths.slice(0, i + 1).join('/');
        let menuItem = getMenuItemByPath(menu, path);

        if (!menuItem) {
            return null;
        }

        menu = menuItem;
        breadcrumbs.push(menuItem.info && menuItem.info.name || menuItem.name);
    }

    return breadcrumbs;
}
