/**
 * @file router/index.js
 * @author tanglei
 */

import VueRouter from 'vue-router';

import Hello from '@/components/Hello';
import Doc from '@/components/Doc';
import Demo from '@/components/Demo';

export const routes = [
    {
        path: '/',
        name: '/',
        component: Hello,
        meta: {
            title: 'Lavas',
            text: '首页',
            route: '/'
        }
    },
    {
        path: '/guide/:path*',
        name: 'guide',
        meta: {
            title: '教程 | Lavas',
            text: 'LAVAS 教程',
            route: '/guide',
            sidebar: true
        },
        component: Doc
    },
    {
        path: '/doc/:path*',
        name: 'doc',
        meta: {
            title: '文档 | Lavas',
            text: 'PWA 文档',
            route: '/doc',
            sidebar: true
        },
        component: Doc
    },
    {
        path: '/demo',
        name: 'demo',
        meta: {
            title: '示例 | Lavas',
            text: '示例',
            route: '/demo'
        },
        component: Demo
    }
];

export default class Router {
    constructor() {
        const router = new VueRouter({
            routes: routes,
            mode: 'history',
            scrollBehavior(to, from, savedPosition) {
                if (from.path !== to.path) {
                    return {x: 0, y: 0};
                }
            }
        });

        return router;
    }
}

Router.install = Vue => {
    Vue.use(VueRouter);
};
