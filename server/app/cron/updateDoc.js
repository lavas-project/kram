/**
 * @file update-doc.js
 * @author chenqiushi(chenqiushi@badiu.com)
 */

'use strict';

module.exports = function (app) {
    let interval = 5 * 60 * 1000;
    let startTime = Date.now();
    let finishTime = Date.now();

    return async function () {
        let now = Date.now();

        app.logger.info('cron.updateDoc start');

        try {
            if (now - startTime >= interval && now - finishTime >= interval) {
                startTime = Date.now();
                await app.doc.exec();
                finishTime = Date.now();
            }

            app.logger.info('cron.updateDoc finish');
        }
        catch (err) {
            app.logger.error(err);
        }
    };
};
