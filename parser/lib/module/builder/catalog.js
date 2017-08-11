/**
 * @file 生成文章目录
 * @author tanglei (tanglei02@baidu.com)
 */

import {locals} from '../../share/locals';
import {getDocInfos, getDocFolderPaths} from './doc';
import {getIgnore} from './meta';

import {startWith} from '../../utils';

export async function build(repo, docKeys) {
    let docPaths = docInfos.map(info => info.path);
    let folderPaths = getDocFolderPaths(repo, docPaths);
    let metaPaths = getDocMetaPaths(repo, folderPaths);

    let ignore = getIgnore(metaPaths, repo);
    docInfos = docInfos.filter(info => ignore.every(key => key !== info.key));


    // let keyList = docInfos.map(info => info.key);
    // 这里加钩子
}
