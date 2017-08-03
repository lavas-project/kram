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
        if (ctx.error && ctx.error.message === 'Not Found') {
            displayMsg = '404，页面未找到';
        }
        // TODO 需要自定义实现
        ctx.body = await this.render('error', {message: displayMsg});
    }
};
