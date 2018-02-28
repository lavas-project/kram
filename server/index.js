/**
 * @file 入口
 * @author sekiyika(pengxing5501854@gmail.com)
 */

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = require('akb')({
    appdir: __dirname
});

app.run();
