/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

import {isValidArray, noop, each} from '../utils';

export const BEFORE_LOAD_ALL = 'beforeLoadAll';
export const AFTER_LOAD_ALL = 'afterLoadAll';
export const BEFORE_LOAD = 'beforeLoad';
export const AFTER_LOAD = 'afterLoad';

export const BEFORE_PROCESS_ALL_DIR = 'beforeProcessAllDir';
export const AFTER_PROCESS_ALL_DIR = 'afterProcessAllDir';

export const BEFORE_PARSE = 'beforeRender';
export const AFTER_PARSE = 'afterRender';
export const BEFORE_STORE = 'beforeStore';
export const AFTER_STORE = 'afterStore';
export const BEFORE_BUILD = 'beforeBuild';
export const AFTER_BUILD = 'afterBuild';

export const STAGES = {
    BEFORE_LOAD_ALL,
    AFTER_LOAD_ALL,
    BEFORE_LOAD,
    AFTER_LOAD,

    BEFORE_PROCESS_ALL_DIR,
    AFTER_PROCESS_ALL_DIR,

    BEFORE_PARSE,
    AFTER_PARSE,
    BEFORE_STORE,
    AFTER_STORE,
    BEFORE_BUILD,
    AFTER_BUILD
};

export const STAGE_SET = Object.keys(STAGES)
    .reduce((set, key) => set.add(STAGES[key]), new Set());

export default function (app, addModule) {
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
        get STAGES() {
            return STAGES;
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
