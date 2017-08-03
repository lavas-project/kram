/**
 * @file updateDoc.js
 * @author chenqiushi(chenqiushi@badiu.com)
 */

'use strict';

const cluster = require('cluster');
const parser = require('../../parser');
// const noop = require('../utils/basic').noop;

module.exports = function (app) {
    if (cluster.isWorker) {
        return () => {};
    }

    return async function () {
        app.logger.info('cron.updateDoc start');

        try {
            parser.pull().forEach(async resolve => parser.build(await resolve));
        }
        catch (err) {
            app.logger.error(err);
        }
    };
};
