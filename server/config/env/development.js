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
        port: 8849,
        cluster: {
            enable: false
        }
    },

    view: {
        cacheable: false
    }
};

