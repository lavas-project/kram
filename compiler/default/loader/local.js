/**
 * @file local.js 将本地文件移动至文档目录
 * @author tanglei (tanglei02@baidu.com)
 */

import fs from 'fs-extra';

export async function local({from, to}) {
    if (!await fs.exists(from)) {
        throw new Error('文档不存在');
    }

    let stat = await fs.stat(from);

    if (!stat.isDirectory()) {
        throw new Error('不是文件夹');
    }

    await fs.ensureDir(to);
    await fs.copy(from, to);

    return to;
};
