/**
 * @file app-shell module
 * @author lavas
 */

import {contain} from '@/assets/common/utils/basic';

export const SET_SHOW_HEADER = 'set_show_header';
export const SET_SHOW_FOOTER = 'set_show_footer';
export const SET_SHOW_LOGO = 'set_show_logo';
export const SET_SIDEBAR_STATUS = 'set_sidebar_status';
export const SET_PATH = 'set_path';

export const state = () => {
    return {
        path: null,
        sidebarStatus: false,
        headerDefault: {
            header: true,
            sidebarIcon: false,
            logo: false,
            search: false
        },
        footerDefault: {
            footer: false
        },
        list: [
            {
                name: 'hello',
                text: '首页',
                route: '/',
                showInTabs: true,
                show: {
                    header: true,
                    sidebarIcon: false,
                    logo: true,
                    footer: true,
                    search: true
                }
            },
            {
                name: 'guide',
                text: 'LAVAS 教程',
                route: '/guide',
                showInTabs: true,
                show: {
                    header: true,
                    logo: false,
                    sidebarIcon: true,
                    footer: false,
                    search: true
                }
            },
            {
                name: 'codelab',
                text: 'CODELAB',
                route: '/codelab',
                showInTabs: true,
                show: {
                    header: true,
                    logo(path) {
                        return path === '/codelab';
                    },
                    sidebarIcon(path) {
                        return path !== '/codelab';
                    },
                    footer(path) {
                        return path === '/codelab';
                    },
                    search: true
                }
            },
            {
                name: 'search',
                text: '搜索',
                route: '/search',
                showInTabs: false,
                show: {
                    header: true,
                    logo: true,
                    sidebarIcon: false,
                    footer: true,
                    search: false
                }
            },
            {
                name: 'error',
                text: '错误',
                route: '/error',
                showInTabs: false,
                show: {
                    header: true,
                    logo: true,
                    sidebarIcon: false,
                    footer: true,
                    search: true
                }
            }
        ]
    };
};

export const getters = {
    tabs(state) {
        return state.list.filter(route => route.showInTabs !== false);
    },

    rootPath(state) {
        if (state.path == null) {
            return null;
        }

        return state.path.split('/').slice(0, 2).join('/');
    },

    activeItem(state, getters) {
        if (!getters.rootPath) {
            return null;
        }

        return state.list.find(item => {
            if (Array.isArray(item.route)) {
                return contain(item.route, getters.rootPath);
            }
            return getters.rootPath === item.route;
        });
    },

    activeIndex(state, getters) {
        if (state.path == null) {
            return -1;
        }

        return getters.tabs.findIndex(tab => {
            if (Array.isArray(tab.route)) {
                return contain(tab.route, getters.rootPath);
            }
            return getters.rootPath === tab.route;
        });
    },

    showSidebarIcon(state, getters) {
        if (!state.path || !getters.activeItem) {
            return state.headerDefault.sidebarIcon;
        }

        if (getters.activeItem.show.sidebarIcon) {
            if (typeof getters.activeItem.show.sidebarIcon === 'boolean'
                || getters.activeItem.show.sidebarIcon(state.path)
            ) {
                return true;
            }
        }

        return false;
    },

    showLogo(state, getters) {
        if (!state.path || !getters.activeItem) {
            return state.headerDefault.logo;
        }

        if (getters.activeItem.show.logo) {
            if (typeof getters.activeItem.show.logo === 'boolean'
                || getters.activeItem.show.logo(state.path)
            ) {
                return true;
            }
        }

        return false;
    },

    showSearch(state, getters) {
        if (!state.path || !getters.activeItem) {
            return state.headerDefault.search;
        }

        if (getters.activeItem.show.search) {
            if (typeof getters.activeItem.show.search === 'boolean'
                || getters.activeItem.show.search(state.path)
            ) {
                return true;
            }
        }

        return false;
    },

    showHeader(state, getters) {
        if (!state.path || !getters.activeItem) {
            return state.headerDefault.header;
        }

        if (getters.activeItem.show.header) {
            if (typeof getters.activeItem.show.header === 'boolean'
                || getters.activeItem.show.header(state.path)
            ) {
                return true;
            }
        }

        return false;
    },

    showFooter(state, getters) {
        if (!state.path || !getters.activeItem) {
            return state.footerDefault.footer;
        }

        if (getters.activeItem.show.footer) {
            if (typeof getters.activeItem.show.footer === 'boolean'
                || getters.activeItem.show.footer(state.path)
            ) {
                return true;
            }
        }

        return false;
    }
};

export const mutations = {
    [SET_SIDEBAR_STATUS](state, status) {
        state.sidebarStatus = status;
    },

    [SET_PATH](state, path) {
        state.path = path;
    }
};

export const actions = {
    setSidebarStatus({commit}, status) {
        commit(SET_SIDEBAR_STATUS, status);
    },

    setPath({commit}, path) {
        commit(SET_PATH, path);
    }
};
