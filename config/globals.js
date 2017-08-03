/**
 * @file globals
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = {

    /**
     * env, at most time, this property should be development or production
     *
     * @type {string}
     */
    env: process.env.NODE_ENV,

    /**
     * app name
     *
     * @type {string}
     */
    appname: 'bpwa-web',

    /**
     * appdir, will be changed after config loaded.
     *
     * @type {string}
     */
    appdir: process.cwd(),

    /**
     * version
     *
     * @type {string}
     */
    version: '0.0.0.1'

};
