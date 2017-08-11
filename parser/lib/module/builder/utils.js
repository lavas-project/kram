/**
 * @file builder 相关工具函数
 * @author tanglei (tanglei02@baidu.com)
 */

import {get as getPaths} from './struct';
import {
    removePrefix,
    removeExt,
    join,
    startWith,
    level,
    get,
    isEmptyObject
} from '../../utils';

export function docKey(repoName, mdPath, dest) {
    let key = removePrefix(mdPath, dest);
    key = join(repoName, key);
    return removeExt(key, '.md');
}

export function getDocInfos(repo) {
    let mdPaths = getPaths(repo, {type: 'file', regex: /\.md$/});

    return mdPaths.map(path => {
        let key = docKey(repo.name, path, repo.loader.dest);
        return {path, key};
    });
}

export function getDocFolderPaths(repo, docPaths) {
    let folderPaths = getPaths(repo, {type: 'folder'});
    return folderPaths.filter(
        folder => docPaths.some(doc => startWith(doc, folder))
    );
}

export function getDocMetaPaths(repo, folderPaths) {
    let metaPaths = getPaths(repo, {type: 'file', regex: /meta\.json/});
    return metaPaths.filter(
        meta => folderPaths.some(folder => startWith(meta, folder))
    );
}

export function toTree(keyList) {
    let obj = keyList.map(key => {
        let list = key.split('/');
        return list;
    })
    .reduce((res, info) => mergeToObj(res, info), {});

    return objToTree(obj);
}

function mergeToObj(obj, list) {
    return list.reduce(
        (obj, item, i) => {
            if (get(obj, ...list.slice(0, i + 1))) {
                return obj;
            }

            let parentNode = i === 0 ? obj : get(obj, ...list.slice(0, i));
            parentNode[item] = {};
            return obj;
        },
        obj
    );
}

function objToTree(obj, parentKey = '') {
    return Object.keys(obj)
        .reduce((res, key) => {
            let curr = [parentKey, key].filter(k => k !== '').join('/');

            let item = {
                name: key,
                key: curr
            };

            if (!isEmptyObject(obj[key])) {
                item.children = objToTree(obj[key], curr);
            }

            res.push(item);
            return res;
        }, []);
}
