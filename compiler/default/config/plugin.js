/**
 * @file plugin 配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

// import URLPlugin from '../plugin/url';
import Stylus from '../plugin/stylus';
import Style from '../plugin/style';
import Minify from '../plugin/minify';
import Chapter from '../plugin/chapter';

export default function (app) {
    return {
        // URLPlugin: new URLPlugin(),
        stylus: new Stylus(),
        style: new Style(),
        minify: new Minify(),
        chapter: new Chapter()
    };
};
