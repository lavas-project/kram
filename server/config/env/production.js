/**
 * @file production.js
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

module.exports = {
    cron: {

        /**
         * cron tasks
         *
         * Documentation: https://github.com/kelektiv/node-cron
         *
         * 说明：
         *  - 更新文档 五分钟 更新一次
         */
        crons: {
            updateDoc: '0 */5 * * * *'
        }
    }
};
