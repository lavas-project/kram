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
