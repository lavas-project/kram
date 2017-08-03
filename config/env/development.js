/**
 * @file development
 * @author sekiyika (px.pengxing@gmail.com)
 */

'use strict';

module.exports = {

    globals: {
        env: 'development',
        enableHotReload: true
    },

    logger: {
        level: 'debug'
    },

    server: {
        cluster: {
            enable: false,
            max: 2
        }
    },

    view: {
        cacheable: false
    },

    cron: {
        crons: {
            updateDoc: '0 */5 * * * *'
        }
    }

};

