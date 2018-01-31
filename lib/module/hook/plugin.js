/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

import {
    isValidArray,
    each
} from '../../utils';
import {STAGE_SET} from './stage';

export default function (app) {
    const list = {};
    const hooks = {};

    const plugin = {
        get hooks() {
            return hooks;
        },

        getHook(stage) {
            return hooks[stage];
        },

        get list() {
            return list;
        },

        get default() {
            return app.default.config.plugin;
        },

        /**
         * 注册钩子事件
         *
         * @param {string} name 插件名称
         * @param {Object} plugin 插件对象
         */
        register(name, plugin) {
            if (list[name]) {
                app.logger.info(`[kram][plugin] ${name} has registered.`);
                return;
            }

            // 每个插件通过实现 apply 函数去注册钩子:
            //
            // pluginDemo.apply = function (on, app) {
            //      on(STAGE_NAME, function () {}, 1) ...
            // }

            plugin.apply(
                (stage, fn, priority = 999) => {
                    if (!STAGE_SET.has(stage)) {
                        return;
                    }

                    hooks[stage] = hooks[stage] || [];
                    hooks[stage].push({priority, fn, name});
                    hooks[stage].sort((a, b) => a.priority - b.priority);
                },
                app
            );

            list[name] = plugin;
        },

        /**
         * 触发钩子事件
         *
         * @param {string} stage 钩子名称
         * @param {*} data 钩子要处理的数据
         * @param {*} options 处理数据的相关参数
         * @return {*} 处理好的数据
         */
        async exec(stage, data, options) {
            let hook = hooks[stage];

            if (!isValidArray(hook)) {
                return data;
            }

            for (let i = 0; i < hook.length; i++) {
                try {
                    let val = await hook[i].fn(data, options);
                    if (val != null) {
                        data = val;
                    }
                }
                catch (e) {
                    app.logger.error(`Plugin: ${hook[i].name} occur ERROR in stage: ${stage}`);
                    app.logger.error(e);
                }
            }

            return data;
        },

        /**
         * 触发钩子事件并同步执行
         *
         * @param {string} stage 钩子名称
         * @param {*} data 钩子要处理的数据
         * @param {*} options 处理数据的相关参数
         * @return {*} 处理好的数据
         */
        execSync(stage, data, options) {
            let hook = hooks[stage];

            if (!isValidArray(hook)) {
                return data;
            }

            for (let i = 0; i < hook.length; i++) {
                try {
                    let val = hook[i].fn(data, options);
                    if (val != null) {
                        data = val;
                    }
                }
                catch (e) {
                    app.logger.error(`Plugin: ${hook[i].name} occur ERROR in stage: ${stage}`);
                    app.logger.error(e);
                }
            }

            return data;
        }
    };

    app.addModule('plugin', () => plugin);

    return () => {
        let plugins = Object.assign({}, plugin.default, app.config.plugin);
        each(plugins, plugin.register);
    };
}
