/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */
import {markdown} from './libs/compiler/markdown';
import {STATIC} from './libs/component/static';
import {merge} from './libs/utils/basic';

export {config} from './config';
export {default as init} from './libs/init';
export {default as pull} from './libs/pull';
export {default as build} from './libs/build';
export {default as get} from './libs/get';

export function configure({logger, marked, highlight}) {
    merge(STATIC, {logger});
    markdown.config({logger, marked, highlight});
}

export const parse = markdown.parse.bind(markdown);
