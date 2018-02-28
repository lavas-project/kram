/**
 * @file error.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = {

    /**
     * handle all errors
     *
     * @param {Context} ctx context
     * @param {Error} err error
     */
    async handle(ctx, err) {
        let displayMsg = '服务器开小差了';

        // 区分 手动 throw 和 自动抛出的错误，自动抛出的(key 不含有 message)不显示具体 message
        if (err && err.message && Object.keys(err).indexOf('message') !== -1) {
            if (err.message === 'Not Found') {
                displayMsg = '404，页面未找到';
            }
            else if (err.message !== 'Internal Server Error') {
                displayMsg = err.message;
            }
        }

        ctx.body = await this.render('error', {message: displayMsg});
    }
};
