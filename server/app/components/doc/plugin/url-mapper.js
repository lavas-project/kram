/**
 * @file url mapper
 * @author tanglei (tanglei02@baidu.com)
 */

module.exports = class UrlMapper {
    apply(on, app) {
        on(app.STAGES.CREATE_DOC_STORE_OBJECT, async obj => {
            await app.store.set('doc-url-path', obj.url, obj.path);
        }, 10050);
    }
};
