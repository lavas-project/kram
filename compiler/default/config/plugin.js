/**
 * @file plugin 配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

import Stylus from '../plugin/stylus';
import Style from '../plugin/style';
import Minify from '../plugin/minify';
import Chapter from '../plugin/chapter';
import Catalog from '../plugin/catalog';
import Info from '../plugin/info';
import Insert from '../plugin/insert';

export default function (app) {
    return {
        stylus: new Stylus(),
        style: new Style(),
        minify: new Minify(),
        chapter: new Chapter(),
        catalog: new Catalog(),
        info: new Info(),
        insert: new Insert()
    };
}
