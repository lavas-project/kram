/**
 * @file middleware.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

/* eslint-disable fecs-properties-quote */

// tanglei@2017.12.28
// I've been asked for changing from static to 'static' then 'static' to static
// **1000000 times**!

module.exports = {

    /**
     * the dir of all middlewares
     *
     * @type {string}
     */
    'dir': './app/middlewares',

    /**
     * all requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'all': [],

    /**
     * only dynamic requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'dynamic': [],

    /**
     * only static requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'static': []

};
