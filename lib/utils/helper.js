/**
 * @file helper
 * @author tanglei (tanglei02@baidu.com)
 */

import {startWith, isValidArray} from './index';

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
