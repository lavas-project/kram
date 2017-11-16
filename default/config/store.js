/**
 * @file store 配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

import {MemoryStore} from '../store';

export default function (app) {
    return {
        options: {
            prefix: 'KRAM',
            delimiter: '$$'
        },
        storage: new MemoryStore()
    };
}
