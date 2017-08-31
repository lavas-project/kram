/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

import {isValidArray, noop, each} from '../utils';
import {STAGE_SET} from './stage';

export default function (app) {
    const config = {
        list: {},
        hooks: {}
    };

    const plugin = {
        get config() {
            return config.list;
        },
        get default() {
            return app.default.config.plugin;
        },
        register(name, plugin) {
            if (config.list[name]) {
                return;
            }

            plugin.apply(
                (stage, fn, priority = 999) => {
                    if (!STAGE_SET.has(stage)) {
                        return;
                    }

                    config.hooks[stage] = config.hooks[stage] || [];
                    config.hooks[stage].push({priority, fn, name});
                    config.hooks[stage].sort((a, b) => a.priority - b.priority);
                },
                app
            );

            config.list[name] = plugin;
        },
        async exec(stage, ...args) {
            let deliverable = args.length > 1;
            let result = deliverable ? () => args[0] : noop;

            let hook = config.hooks[stage];

            if (!isValidArray(hook)) {
                return result();
            }

            for (let i = 0; i < hook.length; i++) {
                try {
                    let val = await hook[i].fn(...args);
                    if (deliverable && val != null) {
                        args[0] = val;
                    }
                }
                catch (e) {
                    app.logger.error(`Plugin: ${hook[i].name} occur ERROR in stage: ${stage}`);
                    app.logger.error(e);
                }
            }

            return result();
        },
        execSync(stage, ...args) {
            let deliverable = args.length > 1;
            let result = deliverable ? () => args[0] : noop;

            let hook = config.hooks[stage];

            if (!isValidArray(hook)) {
                return result();
            }

            for (let i = 0; i < hook.length; i++) {
                try {
                    let val = hook[i].fn(...args);
                    if (deliverable && val != null) {
                        args[0] = val;
                    }
                }
                catch (e) {
                    app.logger.error(`Plugin: ${hook[i].name} occur ERROR in stage: ${stage}`);
                    app.logger.error(e);
                }
            }

            return result();
        }
    };

    return {
        name: 'plugin',
        config: {
            get() {
                return config;
            }
        },
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
