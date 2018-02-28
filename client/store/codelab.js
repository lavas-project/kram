/**
 * @file codelab module
 * @author lavas
 */

import axios from 'axios';
import Vue from 'vue';

export const SET_LIST = 'set_list';
export const SET_MENU = 'set_menu';
export const SET_MENU_INFO = 'set_menu_info';
export const SET_DETAIL = 'set_detail';
export const SET_MAPPER = 'set_mapper';
export const SET_ERROR = 'set_error';



export const state = () => {
    return {
        list: [],
        menu: [],
        menuInfo: {},
        details: {},
        mapper: {},
        // menu: [],
        // data: [{
        //     html: ''
        // }],
        // detail: {},
        error: {
            header: '提示信息',
            message: '',
            show: false
        }
    };
};

export const mutations = {
    [SET_LIST](state, data) {
        state.list = data || [];
    },
    [SET_MENU](state, data) {
        state.menu = data && data.children || [];
    },
    [SET_MENU_INFO](state, data) {
        state.menuInfo = Object.assign({
            name: data.name
        }, data.info);
    },
    [SET_DETAIL](state, data) {
        Vue.set(state.details, data.url, data);
        // state.detail = data || [];
    },
    [SET_MAPPER](state, {from, to}) {
        Vue.set(state.mapper, from, to);
        Vue.set(state.mapper, to, to);
    },
    // [GET_DATA](state, {data = {html: ''}, i = 0}) {
    //     state.data[i] = data;
    // },
    [SET_ERROR](state, {message, header = '提示信息', show = true}) {
        if (message) {
            state.error.message = message;
        }

        state.error.header = header;
        state.error.show = show;
    }
};

export const actions = {
    async getList({commit}) {
        try {
            commit(SET_ERROR, {
                message: '',
                show: false
            });

            let result = await axios('/api/doc/list', {
                method: 'get',
                params: {
                    path: 'codelab'
                }
            });

            if (result.status === 200 && result.data.status === 0) {
                commit(SET_LIST, result.data.data);
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
    async getMenu({commit}, url) {
        try {
            commit(SET_ERROR, {
                message: '',
                show: false
            });

            let result = await axios('/api/doc/menu', {
                method: 'get',
                params: {
                    url,
                    needMenuInfo: 1
                }
            });

            if (result.status === 200 && result.data.status === 0) {
                commit(SET_MENU, result.data.data);
                commit(SET_MENU_INFO, result.data.data);
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
    async getDetail({commit, state}, url) {
        let mappedUrl = state.mapper[url];

        if (state.details[mappedUrl]) {
            return;
        }

        try {
            let result = await axios('/api/doc/detail', {
                method: 'get',
                params: {url}
            });

            if (result.status === 200 && result.data.status === 0) {
                let detail = result.data.data;
                commit(SET_DETAIL, detail);
                commit(SET_MAPPER, {from: url, to: detail.url});
                // commit(GET_DATA, {data, i: query.index});
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
    }
};




