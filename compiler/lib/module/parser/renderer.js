/**
 * @file marked.js 默认配置文件
 * @author tanglei (tanglei02@baidu.com)
 */
import marked from 'marked';
import {contain} from '../../utils';

export const ORIGIN_RENDER = Object.assign({}, marked.Renderer.prototype);
export const RENDER_NAMES = Object.keys(ORIGIN_RENDER);

export default function (app) {
    // const methods = Object.assign
    let renderer = new marked.Renderer();

    const module = {
        get renderer() {
            return renderer;
        },
        setRenderer(...args) {
            let plugin = app.module.plugin;

            if (args.length === 2) {
                let [name, fn] = args;

                if (!contain(RENDER_NAMES, name)) {
                    return;
                }

                renderer[name] = (...args) => {
                    let html = fn(...args);
                    return plugin.execSync('onRender:' + name, html, args);
                };
            }
            else if (typeof args[0] === 'function') {

            }
            else {

            }
        }
    };

    return {
        name: 'renderer',
        module: module,
        init() {

        }
    };
}
