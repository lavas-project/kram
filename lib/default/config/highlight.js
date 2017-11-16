/**
 * @file highlight.js 默认配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

import npm from '../highlight/npm';
import vue from '../highlight/vue';

export default {
    options: {
        tabReplace: '    '
    },
    languages: {
        npm,
        vue
    }
};
