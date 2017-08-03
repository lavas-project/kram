/**
 * @file testing
 * @author sekiyika (px.pengxing@gmail.com)
 */

'use strict';

module.exports = {

    globals: {
        env: 'testing'
    },

    http: {
        controllerCache: false
    },

    logger: {
        level: 'debug'
    },

    server: {
        cluster: {
            enable: false
        }
    },

    view: {
        cacheable: false
    }

};

