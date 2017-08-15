/**
 * @file 生成文章目录
 * @author tanglei (tanglei02@baidu.com)
 */

import {locals} from '../../share/locals';
import {
    getDocInfos,
    getDocFolderPaths,
    getDocMetaPaths
} from './utils';
import {getIgnore} from './meta';

import {startWith} from '../../utils';

export async function build(repo, docKeys) {
    let docInfos = await Promise.all(
        docKeys.map(async key => {
            let {path, title} = await locals.store.get(key);
            return {path, key, title};
        })
    );
    let docPaths = docInfos.map(info => info.path);
    let folderPaths = getDocFolderPaths(repo, docPaths);
console.log(Object.keys(locals.meta.lavas))
// console.log(folderPaths)
    let metaPaths = getDocMetaPaths(repo, folderPaths);
    let metaMaps = metaPaths.map(path => {
        let file = locals.meta[path];
        return {file, path};
    })

    let ignore = getIgnore(metaPaths, repo);
    docInfos = docInfos.filter(info => ignore.every(key => key !== info.key));

// console.log(metaMaps)
    // let keyList = docInfos.map(info => info.key);
    // 这里加钩子
}

// function