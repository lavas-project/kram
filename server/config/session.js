/**
 * @file session.js
 * @author sekiyika (px.pengxing@gmail.com)
 */

// const ConnectRedisMultiple = require('connect-redis-multiple')({
//     Store: require('events')
// });

// const redisStore = new ConnectRedisMultiple({
//     servers: require('./redis').servers,
//     balance: 'random'
// });

module.exports = {

    // 是否启用session
    enable: false,

    store: undefined,

    keys: ['akb'],

    // koa.session的配置
    // 参数配置参考 https://github.com/koajs/generic-session#options
    session: {
        secret: 'akb',
        key: 'NODE_SESSION_ID',
        cookie: {
            maxAge: null // session cookie
        }
    }

};
