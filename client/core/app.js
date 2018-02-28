/**
 * @file entry
 * @author tanglei02(tanglei02@baidu.com)
 */

import Vue from 'vue';
import Meta from 'vue-meta';
import Vuetify from 'vuetify';

import {createRouter} from '@/.lavas/router';
import {createStore} from '@/.lavas/store';
import AppComponent from './App.vue';

Vue.use(Vuetify, {
    theme: {
        primary: '#1976d2'
    }
});

Vue.use(Meta);

Vue.config.productionTip = false;

export function createApp() {
    let router = createRouter();
    let store = createStore();
    let App = Vue.extend({
        router,
        store,
        ...AppComponent
    });
    return {App, router, store};
}

if (module.hot) {
    module.hot.accept();
}
