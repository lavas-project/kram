/**
 * @file helper
 * @author tanglei (tanglei02@baidu.com)
 * @description 跟 Kram 实现强相关的一些辅助函数
 */

import {startWith, isValidArray} from './index';

/**
 * 遍历查找获取菜单元素
 *
 * @param {MenuTree} menu 菜单树
 * @param {string} path 要查找的菜单元素路径
 * @return {Object} 菜单元素
 */
export function getMenuItem(menu, path) {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].path === path) {
            return menu[i];
        }

        if (startWith(path, menu[i].path) && isValidArray(menu[i].children)) {
            return getMenuItem(menu[i].children, path);
        }
    }
}
