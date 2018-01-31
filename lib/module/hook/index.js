/**
 * @file hook index
 * @author tanglei (tanglei02@baidu.com)
 */

import {startWith} from '../../utils';
import {STAGES} from './stage';

export default function (app) {

    const hook = {

        get STAGES() {
            return STAGES;
        },

        /**
         * 触发异步执行的钩子
         *
         * @param {string} stage 钩子名称
         * @param {*} data 钩子要处理的数据
         * @param {*} options 处理数据的相关参数
         * @return {*} 处理好的数据
         */
        async exec(stage, data, options) {
            let {event, plugin} = app.module;
            let result;

            if (startWith(stage, 'before')) {
                event.emit(stage, data, options);
                result = await plugin.exec(stage, data, options);
            }
            else {
                result = await plugin.exec(stage, data, options);
                event.emit(stage, data, options);
            }

            return result;
        },

        /**
         * 触发同步执行的钩子
         *
         * @param {string} stage 钩子名称
         * @param {*} data 钩子要处理的数据
         * @param {*} options 处理数据的相关参数
         * @return {*} 处理好的数据
         */
        execSync(stage, data, options) {
            let {event, plugin} = app.module;
            let result;

            if (startWith(stage, 'before')) {
                event.emit(stage, data, options);
                result = plugin.execSync(stage, data, options);
            }
            else {
                result = plugin.execSync(stage, data, options);
                event.emit(stage, data, options);
            }

            return result;
        }
    };

    app.addModule('hook', () => hook);
}
