/**
 * @file 获取编译好的文档
 * @author tanglei (tanglei02@baidu.com)
 */
import {get, isValidArray} from '../utils/basic';
import {config} from '../../config';

const {repos, store} = config;

export default async ({repoKey, docKey, catalogKey = '/'}) => {
    let repo = await store.get(repoKey);
    docKey = docKey || defaultDocKey({repos, repoKey, catalogKey, repo});

    let msg = validate({repos, repoKey, docKey, repo});

    if (msg) {
        return {status: 1, msg};
    }

    return {
        status: 0,
        data: {
            doc: repo.doc[docKey],
            key: docKey
        }
    };
};

function validate({repos, repoKey, docKey, repo}) {
    if (!repoKey) {
        return '参数不对';
    }

    if (!repos[repoKey]) {
        return '文档不存在';
    }

    if (!repo) {
        return '文档正在初始化';
    }

    if (!docKey) {
        return '文档不存在';
    }

    let doc = repo.doc[docKey];

    if (!doc) {
        return '文档不存在';
    }
}

function defaultDocKey({repos, repoKey, catalogKey, repo}) {
    let catalog = get(repo, 'catalog', catalogKey);

    if (!catalog) {
        return null;
    }

    // 拿当前目录下的第一篇
    while (catalog.length) {
        if (isValidArray(catalog[0].children)) {
            catalog = catalog[0].children;
        }
        else {
            return catalog[0].key;
        }
    }

    return null;
}
