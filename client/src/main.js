/**
 * @file main.js
 * @author tanglei (tanglei02@baidu.com)
 */
import Vue from 'vue';
import App from './App';
import Router from './router';
import Vuetify from 'vuetify';
import axios from 'axios';
import ProgressBar from '@/widgets/ProgressBar';

Vue.config.productionTip = false;

Vue.use(Router);
Vue.use(Vuetify);

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Vue.prototype.$loading = new Vue(ProgressBar).$mount();
document.body.appendChild(Vue.prototype.$loading.$el);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router: new Router(),
    template: '<App/>',
    components: {
        App
    }
});

window.PointerEvent = undefined;
