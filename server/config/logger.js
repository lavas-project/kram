/**
 * @file logger.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');

let dir = path.resolve(__dirname, '../tmp/logs');
fs.ensureDirSync(dir);

module.exports = {

    /**
     * logger engine, developer can custom logger engine, which default is winston.
     *
     * ```javascript
     * function (app) {
     *     return {
     *         debug(){...},
     *         info(){...},
     *         warn(){...},
     *         error(){...}
     *     };
     * }
     *
     * ```
     *
     * @type {Function|undefined}
     */
    engine: undefined,

    /**
     * enable logger or disable
     *
     * @type {boolean}
     */
    enable: true,

    /**
     * dir of saved logs, default is ${appdir}/logs
     *
     * @type {string}
     */
    dir: dir,

    /**
     * if logger should print out the line number of invoking code
     *
     * @type {Object}
     */
    lineno: {
        warn: true,
        error: true
    },

    /**
     * debug info warn error
     *
     */
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

    /**
     * default size of single log file 4GB
     *
     * @type {number}
     */
    maxsize: 4 * 1024 * 1024 * 1024 * 1024,

    /**
     * auto ratote pattern
     *
     * @type {string}
     */
    dailyRotatePattern: '.yyyy-MM-dd',

    /**
     * override default transports or not
     *
     * default to override systemic transport, set false to switch to append mode
     *
     * @type {boolean}
     */
    overrideTransports: true,

    /**
     * transports of debug and info.
     *
     * file transport is default, and console transport will be added under debug
     * developer can add custom transport here
     *
     * @type {Array.<winston.transports.Transport>}
     */
    transports: [],

    /**
     * transports of warn and error
     *
     * file transport is default, and console transport will be added under debug
     * developer can add custom transport here
     *
     * @type {Array.<winston.transports.Transport>}
     */
    wfTransports: []

};
