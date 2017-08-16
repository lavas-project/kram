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

export default function (app) {
    app.config.plugin = {
        list: {},
        hooks: {}
    };

    let {list, hooks} = app.config.plugin;

    // let HOOKS = app.config.plugin.hooks;

    async function plugin(stage, ...args) {
        let isDeliver = args.length > 1;
        let result = isDeliver ? () => args[0] : noop;

        let hook = hooks[stage];

        if (!isValidArray(hook)) {
            return result();
        }

        for (let i = 0; i < hook.length; i++) {
            let val;

            try {
                val = await hook[i].fn(...args);
            }
            catch (e) {
                app.logger.error(`Plugin: ${hook[i].name} ERROR in stage: ${stage}`);
                app.logger.error(e);
                continue;
            }

            if (isDeliver && val != null) {
                args[0] = val;
            }
        }

        return result();
    }

    plugin.init = function (plugins = app.default.config.plugin) {
        Object.keys(plugins).forEach(name => this.register(name, plugins[name]));
    };

    plugin.register = function (name, plugin) {
        if (app.config.plugin.list[name]) {
            return;
        }

        plugin.apply(
            (stage, fn, priority = 999) => {
                if (!STAGES.has(stage)) {
                    return;
                }

                hooks[stage] = hooks[stage] || [];
                hooks[stage].push({priority, fn, name});
                hooks[stage].sort((a, b) => a.priority - b.priority);
            },
            app
        );

        list[name] = plugin;
    };

    // plugin.unregister = function (name) {

    // };

    return plugin;
};
