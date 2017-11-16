/**
 * @file download-git-repo.js
 * @author tanglei (tanglei02@baidu.com)
 */

import fs from 'fs-extra';
import download from 'download-git-repo';

export function downloadGitRepo({from, to, tmp}) {
    return new Promise((resolve, reject) => {
        download(from, tmp, {clone: false}, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })
    .then(() => fs.move(tmp, to, {overwrite: true}));
}
