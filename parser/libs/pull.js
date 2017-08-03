/**
 * @file updateDoc.js
 * @author chenqiushi(chenqiushi@badiu.com)
 */

'use strict';

import download from 'download-git-repo';
import fs from 'fs-extra';
import {config} from '../config';
import {STATIC} from './component/static';

const repoList = config.reopList;

export default (type = 'cron', repos) => {
    repos = repos || repoList.filter(
        ({github, cron}) => github && (type !== 'cron' || cron)
    );

    return repos.map(async repo => {
        await downloadRepo(repo, {logger: STATIC.logger});

        if (await fs.exists(repo.gitDest)) {
            await fs.move(repo.gitDest, repo.dest, {overwrite: true});
        }

        return repo;
    });
};

function downloadRepo(repo, {logger = console} = {}) {
    return new Promise(resolve => {
        logger.info(`start to download repo:${repo.name}`);

        download(
            repo.github,
            repo.gitDest,
            {clone: false},
            err => {
                if (err) {
                    logger.error(`download repo failed:${repo.name}`);
                }
                else {
                    logger.info(`download repo success:${repo.name}`);
                }

                resolve();
            }
        );
    });
}

