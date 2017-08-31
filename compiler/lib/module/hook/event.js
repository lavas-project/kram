/**
 * @file event module
 * @author tanglei (tanglei02@baidu.com)
 */

import {STAGE_SET} from './stage';
import events from 'events';

export default function (app) {
    const event = new events.EventEmitter();
    return {
        name: 'event',
        module: {
            get() {
                return event;
            }
        }
    }
}
