/**
 * @file plugin
 * @author tanglei (tanglei02@baidu.com)
 */

// import * as kram from '../../index';
// import {locals} from '../share/locals';
import {isValidArray, noop} from '../utils';

export const BEFORE_LOAD_REPOS = 'beforeLoadRepos';
export const BEFORE_LOAD = 'beforeLoad';
export const AFTER_LOAD = 'afterLoad';
export const BEFORE_BUILD_REPOS = 'beforeBuildRepos';
export const BEFORE_PARSE = 'beforeRender';
export const AFTER_PARSE = 'afterRender';
export const BEFORE_DOC_STORE = 'beforeDocStore';
export const AFTER_DOC_STORE = 'afterDocStore';
export const BEFORE_BUILD_DOCS = 'beforeBuildDocs';
export const FINISH_BUILD_DOCS = 'finishBuildDocs';

export const STAGES = [
    BEFORE_LOAD_REPOS,
    BEFORE_LOAD,
    AFTER_LOAD,
    BEFORE_BUILD_REPOS,
    BEFORE_PARSE,
    AFTER_PARSE,
    BEFORE_DOC_STORE,
    AFTER_DOC_STORE,
    BEFORE_BUILD_DOCS,
    FINISH_BUILD_DOCS
]
.reduce((set, val) => set.add(val), new Set());

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
        register(name, plugin) {
            if (config.list[name]) {
                return;
            }

            plugin.apply(
                (stage, fn, priority = 999) => {
                    if (!STAGES.has(stage)) {
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
        }
    };

    addModule('plugin', {
        config: config,
        module: plugin,
        init(plugins = plugin.default) {
            Object.keys(plugins).forEach(name => plugin.register(name, plugins[name]));
        }
    });
};
