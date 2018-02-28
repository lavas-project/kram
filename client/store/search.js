/**
 * @file search module
 * @author lavas
 */

import axios from 'axios';
export const GET_RESULT = 'get_result';
export const SET_RESULT = 'set_result';
export const SET_QUERY = 'set_query';
export const SET_SELECT = 'set_select';
export const SET_ERROR = 'set_error';
export const SET_STATUS = 'set_status';



export const state = function () {
    return {
        searchResult: [],
        query: '',
        scope: '',
        status: 'free',
        error: {
            header: '提示信息',
            message: '',
            show: false
        }
    };
};

export const mutations = {
    [SET_RESULT](state, data = []) {
        // v1 被要求一定要放到搜索结果的最最最下面
        let {rest, v1} = data.reduce(function (obj, item) {
            if (/\/v1/i.test(item.menu)) {
                obj.v1.push(item);
            }
            else {
                obj.rest.push(item);
            }

            return obj;

        }, {rest: [], v1: []});

        data = [...rest, ...v1];

        state.searchResult = data;
    },
    [SET_QUERY](state, data) {
        state.query = data || '';
    },
    [SET_SELECT](state, data) {
        state.select = data || '';
    },
    [SET_ERROR](state, {message, header = '提示信息', show = true}) {
        if (message) {
            state.error.message = message;
        }

        state.error.header = header;
        state.error.show = show;
    },
    [SET_STATUS](state, status) {
        state.status = status;
    }
};

export const actions = {
    setSearchResult({commit}, data) {
        commit(SET_RESULT, data || []);
    },
    setSearchQuery({commit}, data) {
        commit(SET_QUERY, data);
    },
    setSearchScope({commit}, data) {
        commit(SET_SELECT, data);
    },
    setSearchError({commit}, data) {
        commit(SET_ERROR, data || {message: ''});
    },
    clearSearchData({commit}) {
        commit(SET_RESULT, []);

        commit(SET_ERROR, {
            message: '',
            show: false
        });

        commit(SET_QUERY, '');

        commit(SET_SELECT, '');
    },
    async getSearchResult({commit, state}, params) {
        if (params.query.trim() === state.query && state.searchResult.length > 0) {
            return;
        }

        commit(SET_RESULT, []);

        commit(SET_ERROR, {
            message: '',
            show: false
        });

        commit(SET_QUERY, params.query.trim());
        commit(SET_STATUS, 'searching');

        try {
            let result = await axios('/api/doc/search', {
                method: 'get',
                params: params
            });

            if (result.status === 200 && result.data.status === 0) {
                let data = result.data.data;
                commit(SET_RESULT, data);
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

        commit(SET_STATUS, 'free');
    }
};
