/**
 * @file default document
 * @author tanglei (tanglei02@baidu.com)
 * @description 对于缺省的文档 url，如 /guide /pwa 则默认返回该路由对应的目录结构下的第一篇文章
 */
const utils = require('../../../utils/basic');

module.exports = class DefaultDoc {
    apply(on, app) {
        let menuConfig = app.config.menus;
        let map = {};

        on(app.STAGES.CREATE_DOC_STORE_OBJECT, obj => {
            // 找出文档 url 所匹配的目录
            let config = menuConfig.find(config => config.url.test(obj.url) && config.menu(obj.url));

            if (!config) {
                return;
            }

            // 找到匹配的目录路径，就缓存起来
            let menuPath = config.menu(obj.url);
            map[menuPath] = true;
        }, 10050);

        on(app.STAGES.DONE, async () => {
            await Promise.all(
                Object.keys(map).map(async menuPath => {
                    // 找出文档目录信息
                    let menu = await app.getMenu(menuPath);
                    if (!menu) {
                        return;
                    }

                    // 找出文档目录中第一篇文章
                    let node = utils.firstNode(menu);
                    let docInfo = await app.getDoc(node.path);

                    if (!docInfo) {
                        return;
                    }

                    await app.store.set('doc', menuPath, docInfo);
                })
            );

            // 清空缓存
            map = {};
        }, 10050);
    }
};
