/**
 * @file 文档解析相关的配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

'use strict';

// import path from 'path';
import {join} from './libs/utils/path';
import {set} from './libs/utils/basic';
import {store} from './libs/component/store';

export const config = {

    /**
     * 文档解析完成后的存放仓库
     *
     * @type {Object}
     */
    'store': store,

    /**
     * 文档资源根目录
     * 默认的项目路径为 ${dir}/${tmpDirName}/${repo.name}
     * 默认的 github 文档下载地址为 ${dir}/${gitDirName}/${repo.name}
     *
     * @type {string}
     */
    'dir': './doc',

    'tmpDirName': 'tmp',

    'gitDirName': 'git',

    // 用于 a 链解析时，如果 a 链写的绝对路径的情况下，判断连接是站内还是站外
    'host': 'https://lavas.baidu.com',

    /**
     * 项目默认配置
     *
     * @type {Object}
     */
    'default': {

        /**
         * 首页配置
         *
         * @type {Object}
         */
        index: {
            repo: 'lavas',
            key: 'index'
        }
    },

    'repos': {
        'lavas': {

            /**
             * 是否需要跑定时任务去执行
             *
             * @type {boolean}
             */
            'cron': true,

            /**
             * repository, The short hand repository string to download the repository from
             * you can specify a branch or tag like: 'github:searchfe/pwa-doc#master', DEFAULT to 'master' branch
             *
             * @type {string}
             */
            'github': 'github:lavas-project/lavas-tutorial',

            /**
             * 本地文档地址
             *
             * @type {string}
             */
            // local: '',

            /**
             * 仓库对应的前端路由名称，会根据该名称生成字段 route: /${routName}
             *
             * @type {string}
             */
            'routeName': 'guide',

            /**
             * 仓库默认信息
             *
             * @type {Object}
             */
            'default': {
                title: '',
                catalog: 'vue'
            }
        },
        'pwa-doc': {

            /**
             * 是否需要跑定时任务去执行
             *
             * @type {boolean}
             */
            'cron': true,

            /**
             * repository, The short hand repository string to download the repository from
             * you can specify a branch or tag like: 'github:searchfe/pwa-doc#master', DEFAULT to 'master' branch
             *
             * @type {string}
             */
            'github': 'github:lavas-project/pwa-doc',

            /**
             * 本地文档地址
             *
             * @type {string}
             */
            // local: '',

            /**
             * 仓库对应的前端路由名称，会根据该名称生成字段 route: /${routName}
             *
             * @type {string}
             */
            'routeName': 'doc',

            /**
             * 仓库默认信息
             *
             * @type {Object}
             */
            'default': {
                title: '',
                catalog: '/'
            }
        }
    }
};

config.tmpDir = join(config.dir, config.tmpDirName);
config.gitDir = join(config.dir, config.gitDirName);

config.repoList = Object.keys(config.repos)
    .map(key => Object.assign(
        {
            name: key,
            dest: join(config.tmpDir, key),
            route: '/' + config.repos[key].routeName
        },
        config.repos[key].github ? {gitDest: join(config.gitDir, key)} : {},
        config.repos[key]
    ));

config.repos = config.repoList.reduce((res, repo) => set(res, repo.name, repo), {});
config.routeToRepo = config.repoList.reduce((res, repo) => set(res, repo.routeName, repo.name), {});
