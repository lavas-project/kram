/**
 * @file 需要身份验证情况下的 ui 数据请求封装
 * @author mj(zoumiaojiang@gmail.com)
 */

import axios from 'axios';

/**
 * 封装的请求函数
 *
 * @param  {string} url 请求 url
 * @param  {Obejct} state 额外的 store.state 相关参数
 * @param  {Object} params 请求参数
 * @param  {string} method 请求方法
 * @return {Promise}      返回的 promise
 */
export default async function (url, state, params = {}, method = 'get') {

    let data;

    // 如果是 ssr
    if (process.env.VUE_ENV === 'server') {
        let cookie = state.cookie || '';

        data = await axios({
            url,
            params,
            method: 'get',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                cookie
            }
        });

        return data.data;
    }

    let options = {
        method: method,
        url,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    if (method === 'get') {
        Object.assign(options, {params});
    }
    else if (method === 'post' || method === 'put') {
        Object.assign(options, {data: params});
    }

    data = await axios(options);

    let redirectUrl;

    if (process.env.NODE_ENV === 'development') {
        redirectUrl = 'http://lavasdev.baidu.com:3000';
    }
    else {
        redirectUrl = 'https://lavas.baidu.com';
    }

    // 在前端环境下的登录和注册状态的判断
    if (data.data && process.env.VUE_ENV === 'client' && !url.includes('/api/user/isLogin')) {
        if (data.data.status === 'LOGIN') {
            location.href = redirectUrl + '/app/redirect?u=' + encodeURIComponent(location.href);
        }
        else if (data.data.status === 'REGISTER') {
            location.href = redirectUrl + '/app/user';
        }
    }

    return data.data;
}
