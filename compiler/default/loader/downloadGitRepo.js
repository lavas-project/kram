import fs from 'fs-extra';
import {get} from '../../lib/utils';
import download from 'download-git-repo';

export async function downloadGitRepo({from, to}) {
    if (await fs.exists(to)) {
        await fs.remove(to);
    }

    await new Promise((resolve, reject) => {
        download(from, to, {clone: false}, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });

    return to;
    // await fs.move(tmp, to, {overwrite: true});
}
