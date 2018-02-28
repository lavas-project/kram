/**
 * @file 通用 state
 * @author tanglei (tanglei02@baidu.com)
 */
// import validateReq from '@/assets/common/utils/validateReq';
export const SET_META = 'set_meta';

// export const namespaced = true;

export const state = () => {
    return {
        title: '',
        description: '',
        keywords: '',
        csrfToken: ''
    };
};

export const mutations = {
    [SET_META](state, {title, description, keywords}) {
        state.title = title || 'Lavas | 基于 Vue 的 PWA 完整解决方案';
        state.description = description || '基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题';
        state.keywords = keywords || 'lavas, pwa, vue, baidu, service wroker';
    }
};

export const actions = {
    setMeta({commit, state}, meta) {
        commit(SET_META, meta);
        if (process.env.VUE_ENV === 'client') {
            document.title = state.title;
            document.querySelector('meta[name="description"]').content = state.description;
            document.querySelector('meta[name="keywords"]').content = state.keywords;
        }
    }
};
