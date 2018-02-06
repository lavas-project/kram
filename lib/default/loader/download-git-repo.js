/**
 * @file download-git-repo.js
 * @author tanglei (tanglei02@baidu.com)
 */

import fs from 'fs-extra';
import download from 'download-git-repo';

export function downloadGitRepo({from, to, tmp}) {
    let tmpDir = tmp || to;

    let promise = new Promise((resolve, reject) => {
        download(from, tmpDir, {clone: false}, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });

    if (tmp) {
        promise.then(() => fs.move(tmp, to, {overwrite: true}));
    }

    return promise;
}
