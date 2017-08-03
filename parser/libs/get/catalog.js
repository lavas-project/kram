/**
 * @file 获取编译好的文档目录
 * @author tanglei (tanglei02@baidu.com)
 */

import {get} from '../utils/basic';
import {config} from '../../config';

const {repos, store} = config;

export default async ({repoKey, catalogKey = '/'}) => {
    let repo = await store.get(repoKey);
    let msg = validate({repos, repoKey, catalogKey, repo});

    if (msg) {
        return {status: 1, msg};
    }

    return {
        status: 0,
        data: {
            catalog: repo.catalog[catalogKey]
        }
    };
};

function validate({repos, repoKey, catalogKey, repo}) {
    if (!repoKey) {
        return '参数不对';
    }

    if (!repos[repoKey]) {
        return '文档不存在';
    }

    if (!repo) {
        return '文档正在初始化';
    }

    if (!catalogKey) {
        return '文档不存在';
    }

    let catalog = get(repo, 'catalog', catalogKey);

    if (!catalog) {
        return '没有相应的文档目录';
    }
}
