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
    get
} from '../../utils';

export function docKey(repoName, mdPath, dest) {
    let key = removePrefix(mdPath, dest);
    key = join(repoName, key);
    return removeExt(key, '.md');
}

export function getDocInfos(repo) {
    let mdPaths = getPaths(repo, {type: 'file', regex: /\.md$/});

    return infos = mdPaths.map(path => {
        let key = docKey(repo.name, path, repo.pull.dest);
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

// export function toTree(keyList) {
//     return keyList.map(key => {
//         let list = key.split('/');
//         return {key, list};
//     })
//     .reduce((res, info) => {
//         let list = info.list;
//         return res.reduce(())
//         for (let i = 0; i < info.length; i++) {
//             if ()
//             if (get(res, ...info.slice(0, i + 1))) {
//                 continue;
//             }

//             get(res, ...info.slice(0, i))
//         }
//     }, [])
// }

// function append(tree, list) {
//     let lastOne = list[list.length - 1];
//     return tree.reduce((res, node) => {

//         if (node.name === lastOne)
//     })
// }

// function getProp(obj, list) {
//     for (let i = 0; i < list.length)
// }