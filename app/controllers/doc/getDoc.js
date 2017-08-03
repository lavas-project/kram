/**
 * @file 获取文档的内容的接口
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

const get = require('../../utils/basic').get;
const parser = require('../../../parser');
let {routeToRepo, default: defaultParams, repos} = parser.config;

module.exports = async function getDoc(ctx) {
    let page = ctx.param('page');

    let repoKey;
    let docKey;
    let catalogKey;

    if (page) {
        repoKey = routeToRepo[page];
        docKey = ctx.param('key') || get(repos, repoKey, 'default', 'key');
        catalogKey = ctx.param('catalog') || get(repos, repoKey, 'default', 'catalog');
    }
    else {
        repoKey = defaultParams.index.repo;
        docKey = defaultParams.index.key;
        catalogKey = defaultParams.index.catalog;
    }

    let result = await parser.get({repoKey, docKey, catalogKey}, 'doc');
    ctx.json(result);
};
