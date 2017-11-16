/**
 * @file store 配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

import {store} from '../store';

export default {
    options: {
        storage: store,
        prefix: 'KRAM',
        delimiter: '$$'
    },
    storage: store
};
