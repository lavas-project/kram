/**
 * @file 读取编译结果的方法
 * @author tanglei (tanglei02@baidu.com)
 */

import catalog from './catalog';
import doc from './doc';

export default async (params, type = 'doc') => {
    if (type === 'doc') {
        return await doc(params);
    }

    return await catalog(params);
};
