/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

import {isValidArray, noop, each} from '../../utils';
import {STAGE_SET} from './stage';

export default function (app) {
    const list = {};
    const hooks = {};

    const plugin = {
        get hooks() {
            return hooks;
        },

        hook(stage) {
            return hooks[stage];
        },

        get list() {
            return list;
        },

        get default() {
            return app.default.config.plugin;
        },

        register(name, plugin) {
            if (list[name]) {
                return;
            }

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

        async exec(stage, data, options) {
            let hook = hooks[stage];

            if (!isValidArray(hook)) {
                return data;
            }

            for (let i = 0; i < hook.length; i++) {
                try {
                    let val = await hook[i].fn(data, options);
                    if (val != null) {
                        args[0] = val;
                    }
                }
                catch (e) {
                    app.logger.error(`Plugin: ${hook[i].name} occur ERROR in stage: ${stage}`);
                    app.logger.error(e);
                }
            }

            return data;
        },

        execSync(stage, ...args) {
            let hook = hooks[stage];

            if (!isValidArray(hook)) {
                return data;
            }

            for (let i = 0; i < hook.length; i++) {
                try {
                    let val = hook[i].fn(data, options);
                    if (val != null) {
                        args[0] = val;
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

    return {
        name: 'plugin',
        module: {
            get() {
                return plugin;
            }
        },
        init(plugins = plugin.default) {
            each(plugins, plugin.register);
        }
    };
};
