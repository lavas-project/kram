/**
 * @file guide.vue data store
 * @author tanglei (tanglei02@baidu.com)
 */

import axios from 'axios';
import Vue from 'vue';

export const SET_MENU = 'set_menu';
// export const GET_DATA = 'get_data';
export const SET_DETAILS = 'set_details';
export const SET_DETAIL = 'set_detail';
export const SET_VERSIONS = 'set_versions';
export const SET_MAPPER = 'set_mapper';
export const SET_ERROR = 'set_error';



export const state = () => {
    return {
        menus: {},
        menu: [],
        details: {},
        mapper: {},
        versions: [],
        detail: {},
        error: {
            header: '提示信息',
            message: '',
            show: false
        }
    };
};

export const mutations = {
    [SET_MENU](state, data) {
        state.menu = data || [];
    },
    [SET_DETAILS](state, data) {
        Vue.set(state.details, data.url, data);
    },
    [SET_DETAIL](state, data) {
        state.detail = data;
    },
    [SET_MAPPER](state, {from, to}) {
        Vue.set(state.mapper, from, to);
    },
    [SET_VERSIONS](state, data) {
        state.versions = data || [];
        // state.versions = data && data.concat({name: 'v2', path: 'pwa'}) || [];
    },
    [SET_ERROR](state, {message, header = '提示信息', show = true}) {
        if (message) {
            state.error.message = message;
        }

        state.error.header = header;
        state.error.show = show;
    }
};

export const actions = {
    async getMenu({commit}, {url, path}) {
        try {
            commit(SET_ERROR, {
                message: '',
                show: false
            });

            let result = await axios('/api/doc/menu', {
                method: 'get',
                params: path ? {path} : {url}
            });

            if (result.status === 200 && result.data.status === 0) {
                commit(SET_MENU, result.data.data);
            }
            else {
                commit(SET_ERROR, {
                    message: '糟糕！找不到相应的文档...'
                });
            }
        }
        catch (e) {
            commit(SET_ERROR, {
                message: '糟糕！网络发生了点错误...'
            });
        }
    },
    async getDetail({commit, state}, {url, path}) {
        let mappedUrl = state.mapper[url];

        if (state.details[mappedUrl]) {
            commit(SET_DETAIL, state.details[mappedUrl]);
            return;
        }

        try {
            let result = await axios('/api/doc/detail', {
                method: 'get',
                params: path ? {path} : {url}
            });

            if (result.status === 200 && result.data.status === 0) {
                let detail = result.data.data;
                commit(SET_DETAILS, detail);
                commit(SET_DETAIL, detail);

                if (!path) {
                    commit(SET_MAPPER, {from: url, to: detail.url});
                }
                commit(SET_MAPPER, {from: detail.url, to: detail.url});
            }
            else {
                commit(SET_DETAIL, {});
                commit(SET_ERROR, {
                    message: '糟糕！找不到相应的文档...'
                });
            }
        }
        catch (e) {
            commit(SET_DETAIL, {});
            commit(SET_ERROR, {
                message: '糟糕！网络发生了点错误...'
            });
        }
    },
    async getVersions({commit, state}) {
        try {
            commit(SET_ERROR, {
                message: '',
                show: false
            });

            let result = await axios('/api/doc/list', {
                method: 'get',
                params: {
                    path: 'lavas'
                }
            });

            if (result.status === 200 && result.data.status === 0) {
                commit(SET_VERSIONS, result.data.data);
            }
        }
        catch (e) {
            commit(SET_ERROR, {
                message: '糟糕！网络发生了点错误...'
            });
        }
    }
};
