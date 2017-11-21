/**
 * @file plugin 配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

import Stylus from '../plugin/stylus';
import Style from '../plugin/style';
import Minify from '../plugin/minify';
import Insert from '../plugin/insert';
import Meta from '../plugin/meta';

export default function (app) {
    return {
        stylus: new Stylus(),
        style: new Style(),
        minify: new Minify(),
        insert: new Insert(),
        meta: new Meta()
    };
}
