/**
 * @file 编译文档
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = function (app) {
    return async function (params, next) {
        // 初始化文档
        app.doc.exec();

        await next();
    };
};
