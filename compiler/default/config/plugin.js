/**
 * @file plugin 配置文件
 * @author tanglei (tanglei02@baidu.com)
 */

import URLPlugin from '../plugin/url';
// import Stylus from '../plugin/stylus';
// import Style from '../plugin/style';
// import Minify from '../plugin/minify';

// export default [
//     new URLPlugin(),
//     new Stylus({priority: 9997}),
//     new Style({priority: 9998}),
//     new Minify({priority: 9999})
// ];

export default function (app) {
    return {
        URLPlugin: new URLPlugin()
    };
};
