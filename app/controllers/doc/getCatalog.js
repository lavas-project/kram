/**
 * @file 获取文档目录的接口
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

const get = require('../../utils/basic').get;
const parser = require('../../../parser');
let {routeToRepo, default: defaultParams, repos} = parser.config;

module.exports = async function getCatalog(ctx) {
    let page = ctx.param('page');

    let repoKey;
    let catalogKey;

    if (page) {
        repoKey = routeToRepo[page];
        catalogKey = ctx.param('catalog') || get(repos, repoKey, 'default', 'catalog');
    }
    else {
        repoKey = defaultParams.index.repo;
        catalogKey = defaultParams.index.catalog;
    }

    let result = await parser.get({repoKey, catalogKey}, 'catalog');

    ctx.json(result);
};
