/**
 * @file doc init component
 * @author tanglei(tanglei02@badiu.com)
 */

'use strict';

import path from 'path';
import fs from 'fs-extra';
import {join} from './utils/path';
import {isValidArray} from './utils/basic';
import build from './build';
import pull from './pull';
import {config} from '../config';

const {tmpDir, gitDir, repoList} = config;

export default async () => {
    // 确保临时文件目录存在
    await ensureDir(tmpDir, gitDir);

    // 把不在配置列表里面的项目文件给删了
    await removeInvalidRepo(tmpDir, repoList);

    // 把本地的文件都扔到 tmp 目录下
    await copyLocalToDest(repoList);

    // 找到已存在和尚未存在的项目
    let {exist, notExist} = await classifyByExist(repoList);

    // 已存在的就先去编译 不存在的就先去下载再编译
    if (isValidArray(exist)) {
        build(exist);
    }

    if (isValidArray(notExist)) {
        pull('init', notExist).forEach(async res => build(await res));
    }
};

async function ensureDir(...dirs) {
    await Promise.all(dirs.map(dir => fs.ensureDir(dir)));
}

async function removeInvalidRepo(tmpDir, repoList) {
    let dirs = await fs.readdir(tmpDir);
    await Promise.all(
        dirs
        .filter(dir => !repoList.some(repo => repo.name === dir))
        .map(async dir => await fs.remove(join(tmpDir, dir)))
    );
}

async function copyLocalToDest(repoList) {
    await Promise.all(
        repoList
        .filter(repo => repo.local)
        .map(async repo => await fs.copy(repo.local, repo.dest))
    );
}

async function classifyByExist(repoList) {
    let map = await Promise.all(
        repoList
        .filter(repo => repo.github)
        .map(async repo => {
            let status = await isDocExist(repo.dest) ? 'exist' : 'notExist';
            return {status, repo};
        })
    );

    return map.reduce(
        (res, info) => {
            res[info.status].push(info.repo);
            return res;
        },
        {exist: [], notExist: []}
    );
}


async function isDocExist(rootPath) {
    if (!await fs.exists(rootPath)) {
        return false;
    }

    let paths = await fs.readdir(rootPath);

    let results = await Promise.all(
        paths.map(async dir => {
            let currPath = join(rootPath, dir);
            let stat = await fs.stat(currPath);

            if (stat.isDirectory()) {
                return await isDocExist(currPath);
            }

            return path.extname(dir) === '.md';
        })
    );

    return results.some(result => result);
}
