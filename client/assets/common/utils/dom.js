/**
 * @file dom.js
 * @author tanglei (tanglei02@baidu.com)
 */

import {merge} from './basic';

export function deviceWidth() {
    return window.innerWidth || document.documentElement.clientWidth;
}

export function clientWidth() {
    return document.documentElement.clientWidth;
}

export function deviceHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
}

export function clientHeight() {
    return document.documentElement.clientHeight;
}

export function scrollTop() {
    return document.body.scrollTop || document.documentElement.scrollTop;
}

export function scrollHeight() {
    return document.body.scrollHeight;
}

export function getMediaQueryValue(arr, clientWidth) {
    if (!Array.isArray(arr)) {
        return arr;
    }

    return arr.filter(
        ({minWidth, maxWidth}) => (
            (minWidth == null || minWidth <= clientWidth) && (maxWidth == null || maxWidth >= clientWidth)
        )
    )
    .reduce((res, props) => merge(res, props.value), {});
}

export function toUnit(val) {
    return val + 'px';
}

export function rAF(callback) {
    let r = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || (cb => window.setTimeout(cb, 1000 / 60));
    r(callback);
}
