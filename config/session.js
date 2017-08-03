/**
 * @file session.js
 * @author sekiyika (px.pengxing@gmail.com)
 */

module.exports = {

    // 是否启用session
    enable: true,

    /**
     *  session store，默认本地内存
     *
     * ```javascript
     *
     * {
     *     set(sid, session, ttl) {
     *         return new Promise();
     *     },
     *
     *     get(sid) {
     *         return new Promise();
     *     },
     *
     *     destroy(sid) {
     *         return new Promise();
     *     }
     * }
     *
     * ```
     * @type {Object|undefined}
     */
    store: null,

    keys: ['akb'],

    // koa.session的配置
    // 参数配置参考 https://github.com/koajs/generic-session#options
    session: {
        secret: 'akb',
        key: 'NODE_SESSION_ID'
    }

};
