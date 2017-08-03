/**
 * @file hook.js
 * @author sekiyika(pengxing@baidu.com)
 */

module.exports = {

    hookDir: './app/hooks',

    hooks: {
        // 'started': ['started'],
        'started': [
            'started'
        ],

        'beforeRequest': [],
        'afterResponse': [],

        'beforeRender': [],
        'afterRender': [],

        'beforeRal': [],
        'afterRal': []
    }
};
