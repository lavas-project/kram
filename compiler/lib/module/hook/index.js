import {startWith} from '../../utils';
import {STAGES} from './stage';

export default function (app) {
    const hook = {
        get STAGES() {
            return STAGES;
        },
        async exec(stage, ...args) {
            let {event, plugin} = app.module;
            let result;

            if (startWith(stage, 'before')) {
                event.emit(stage, ...args);
                result = await plugin.exec(stage, ...args);
            }
            else {
                result = await plugin.exec(stage, ...args);
                event.emit(stage, ...args);
            }

            return result;
        },
        execSync(stage,) {
            let {event, plugin} = app.module;
            let result;

            if (startWith(stage, 'before')) {
                event.emit(stage, ...args);
                result = plugin.execSync(stage, ...args);
            }
            else {
                result = plugin.execSync(stage, ...args);
                event.emit(stage, ...args);
            }

            return result;
        }
    };

    return {
        name: 'hook',
        module: {
            get() {
                return hook;
            }
        }
    }
}
