/**
 * @file sw.js
 * @author chenqiushi(chenqiushi@baidu.com)
 */

/* eslint-disable max-nested-callbacks */

var CACHE_NAME = 'pwa-precache-' + (self.registration ? self.registration.scope : '');

var PRECACHE_LIST = [];

// HTTP 请求成功的 status code
var SUCCESS_RESPONSE_REGEXP = /^0|([123]\d\d)|(40[14567])|410$/;

/**
 * 缓存策略
 *
 * @type {Object.<string, Function>}
 */
var strategies = (function () {

    return {

        /**
         * 网络优先,失败了再从缓存中取
         *
         * @param {Request} req request
         * @return {Promise}
         */
        networkFallbackToCache: function (req) {
            return fetchAndCache(req)
                .catch(function () {
                    if (req.mode === 'navigate') {
                        postMessage();
                    }

                    var newReq;

                    if (req.headers.get('accept').indexOf('text/html') > -1) {
                        newReq = new Request('/index.html');
                    }
                    else {
                        newReq = req;
                    }

                    return caches.match(newReq);
                });
        },

        /**
         * 缓存和网络都会发请求
         *
         * 效果如下：
         * 1.网速状况良好。
         *     每次从请求获取最新数据
         * 2.弱网环境。
         *     有缓存：若 3s 后请求未返回，从缓存中获取数据。
         *     无缓存：一直等到请求返回数据。
         * 3.离线环境。
         *     有缓存：立即从缓存中读取数据
         *     无缓存：返回网络失败提示
         *
         * @param {Request} req request
         * @return {Promise}
         */
        fastest: function (req) {
            return new Promise(function (resolve, reject) {
                // 是否已经有一种方法失败了
                var rejected = false;
                var cacheRes;

                fetchAndCache(req.clone())
                    .then(maybeResolve, function (e) {
                        if (cacheRes) {
                            maybeResolve(cacheRes);
                        }
                        else {
                            maybeReject(e);
                        }
                    });

                cacheOnly(req)
                    .then(function (res) {
                        if (rejected) {
                            return maybeResolve(res);
                        }

                        cacheRes = res;
                        setTimeout(function () {
                            maybeResolve(res);
                        }, 3000);
                    }, maybeReject);

                function maybeResolve(res) {
                    if (res instanceof Response) {
                        resolve(res);
                    }
                    else {
                        maybeReject('No result returned');
                    }
                }

                function maybeReject(e) {
                    if (rejected) {
                        reject(e);
                    }
                    else {
                        rejected = true;
                    }
                }
            });
        }

    };


    /**
     * 请求并缓存内容
     *
     * @param {Request} req request
     * @return {Promise}
     */
    function fetchAndCache(req) {
        return fetch(req.clone())
            .then(function (res) {
                if (req.method === 'GET' && SUCCESS_RESPONSE_REGEXP.test(res.status)) {
                    var newReq;

                    if (req.headers.get('accept').indexOf('text/html') > -1) {
                        newReq = new Request('/index.html');
                    }
                    else {
                        newReq = req;
                    }

                    saveToCache(newReq, res.clone());
                }

                return res;
            });
    }

    /**
     * 从缓存中匹配
     *
     * @param {Request} req request
     * @return {Promise}
     */
    function cacheOnly(req) {

        var newReq;

        if (req.headers.get('accept').indexOf('text/html') > -1) {
            newReq = new Request('/index.html');
        }
        else {
            newReq = req;
        }

        return caches.match(newReq)
            .then(function (res) {
                if (res) {
                    return res;
                }

                throw new Error('cache missed');
            });
    }

    /**
     * 保存内容到缓存
     *
     * @param {Request} req request
     * @param {Response} res response
     * @return {*}
     */
    function saveToCache(req, res) {
        return caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.put(req, res);
            });
    }

    /**
     * 如果页面请求失败,则发送一条消息给页面本身显示离线消息
     */
    function postMessage() {
        self.clients.matchAll()
            .then(function (clients) {
                if (clients && clients.length) {
                    var currentClient = clients[0];
                    setTimeout(function () {
                        currentClient.postMessage('您的设备未连接到互联网');
                    }, 2000);
                }
            });
    }

})();

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            return Promise.all(PRECACHE_LIST.map(function (url) {
                return cache.add(url);
            }));
        })
        .then(function () {
            // Force the SW to transition from installing -> active state
            return self.skipWaiting();
        })
    );
});

// delete cached files
self.addEventListener('activate', function (event) {
    event.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(existingRequests.map(function (existingRequest) {
                    return cache.delete(existingRequest);
                }));
            });
        })
        .then(function () {
            return self.clients.claim();
        }));
});

self.addEventListener('fetch', function (event) {
    var req = event.request;
    var url = new URL(req.url);

    // 只管 get 的请求，且不缓存统计日志请求
    if (req.method !== 'GET'
        || url.host === 'hm.baidu.com'
    ) {
        return;
    }

    // 静态文件缓存优先
    if (url.href.match(/.*\.(js|css|png|jpg|jpeg|gif|woff|tff)(\?.*)?/)) {
        return event.respondWith(strategies.fastest(req));
    }

    return event.respondWith(strategies.fastest(req));
});

/* eslint-enable max-nested-callbacks */
