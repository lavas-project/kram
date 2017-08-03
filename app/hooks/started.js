/**
 * @file 编译文档
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';
const cluster = require('cluster');
const parser = require('../../parser');

module.exports = function (app) {
    return async function (params, next) {

        if (cluster.isMaster) {
            parser.configure({logger: app.logger});
            parser.init();
        }

        await next();
    };
};
