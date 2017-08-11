import {locals} from '../../share/locals';
import fs from 'fs-extra';
import path from 'path';

import {
    contain,
    join,
    removePrefix,
    isValidArray,
    isObject,
    level,
    set
} from '../../utils';

import {get as getPaths} from './struct';

const INVALID = 'key_is_invalid';

export async function init(repo) {
    let metaPaths = getPaths(repo, {type: 'file', regex: /meta\.json$/});
console.log(metaPaths)
console.log('')
console.log('')
    let infos = await Promise.all(
        metaPaths.map(async path => {
            let meta = await fs.readFile(path, 'utf-8');

            try {
                meta = JSON.parse(meta);
                meta = complete(meta, path, repo);
            }
            catch (e) {
                locals.logger.error(e)
                return null;
            }

            return {path, meta};
        })
    );

    let map = infos.filter(info => info != null)
        .reduce((res, info) => set(res, info.path, info.meta), {});

    locals.meta[repo.name] = map;
}

export function complete(meta, metaPath, repo) {
    if (isValidArray(meta.menu)) {
        meta.menu = fullMenu(meta.menu, metaPath, repo);
    }

    if (isValidArray(meta.ignore)) {
        meta.ignore = fullIgnore(meta.ignore);
    }

    if (isObject(meta.name)) {
        meta.name = fullName(meta.name);
    }

    return meta;
}

function fullMenu(obj, metaPath, repo, parentKey = '') {
    if (!isObject(obj)) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => fullMenu(item, metaPath, repo, parentKey))
            .filter(item =>
                !isObject(item)
                || isValidArray(item)
                || item.key !== INVALID
                && item != null
            );
    }

    if (obj.key) {
        obj.key = fullKey(obj.key, metaPath, repo, parentKey);

        if (obj.key === INVALID) {
            return null;
        }
    }

    return Object.keys(obj)
        .filter(prop => prop !== 'key')
        .reduce((res, prop) => set(res, prop, fullMenu(obj[prop], metaPath, repo, obj.key)), {});
}

function fullName(names, parentKey = '') {
    return Object.keys(names)
        .filter(key => key !== '')
        .reduce((res, key) => set(res, fullKey(key, parentKey), names[key]), {});
}

function fullIgnore(ignores, parentKey = '') {
    return ignores.map(ignore => fullKey(ignore, parentKey));
}

function fullKey(key, metaPath, repo, parentKey) {
    let {name, loader: {dest}} = repo;

    let folders = getPaths(repo, {type: 'folder'});
    let files = getPaths(repo, {type: 'file'});

    let maybeFolder = path.resolve(dest, key);

    if (isValid(maybeFolder, folders, files)) {
        return join(name, key);
    }

    maybeFolder = path.resolve(metaPath, key);

    if (isValid(maybeFolder, folders, files)) {
        key = removePrefix(maybeFolder, dest);
        return join(name, key);
    }

    key = join(parentKey, key);
    maybeFolder = path.resolve(metaPath, key);

    if (isValid(maybeFolder, folders, files)) {
        key = removePrefix(maybeFolder, dest);
        return join(name, key);
    }

    return INVALID;
}

function isValid(maybeFolder, folders, files) {
    return contain(maybeFolder, folders) || contain(maybeFolder + '.md', files);
}

export function getIgnore(metaPaths, repo) {
    metaPaths = metaList.slice().sort((a, b) => level(a) - level(b));

    return metaPaths.reduce((res, path) => {
            let ignore = locals.meta[repo.name][path].ignore;
            if (isValidArray(ignore)) {
                res.push(...ignore);
            }
            return res;
        },
        []
    );
}

export function getName(metaPaths, repo) {
    metaPaths = metaList.slice().sort((a, b) => level(a) - level(b));

    return metaPaths.reduce((res, path) => {
            let name = locals.meta[repo.name][path].name;
            return Object.keys(res, name);
        },
        {}
    );
}
