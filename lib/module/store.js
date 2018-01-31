/**
* @file store module
* @author tanglei (tanglei02@baidu.com)
*/

export default function (app) {

    // 存储相关配置信息
    let options;

    // 仓库实例
    let storage;

    const store = {
        get storage() {
            return storage;
        },

        set storage(val) {
            storage = val;
        },

        get options() {
            return options;
        },

        set options(val) {
            if (val) {
                options = Object.assign(
                    {},
                    store.default.options,
                    options,
                    val
                );
            }
        },

        get default() {
            return app.default.config.store;
        },

        /**
         * 写
         *
         * @param {string} type 类型标识
         * @param {string} key key
         * @param {*} value 写入的数据
         * @return {Promise} promise 对象
         */
        async set(type, key, value) {
            let name = generateKey(type, key, options);
            return await storage.set(name, value);
        },

        /**
         * 读
         *
         * @param {string} type 类型标识
         * @param {string} key key
         * @return {*} 读取结果
         */
        async get(type, key) {
            let name = generateKey(type, key, options);
            return await storage.get(name);
        },

        /**
         * 删
         *
         * @param {string} type 类型标识
         * @param {string} key key
         * @return {Promise} promise 对象
         */
        async remove(type, key) {
            let name = generateKey(type, key, options);
            return await storage.remove(name);
        }
    };

    app.addModule('store', () => store);

    return () => {
        let {
            options = store.default.options,
            storage = store.default.storage
        } = app.config.store || {};

        store.storage = storage;
        store.options = options;
    };
}

/**
 * 生成存储 key 的方法
 *
 * @param {string} type 类型标识
 * @param {string} key key
 * @param {Object} options options
 * @param {string} options.prefix 统一前缀
 * @param {string} options.delimiter 统一分隔符
 * @return {string} 实际存储的 key
 */
function generateKey(type, key, {prefix, delimiter}) {
    return [prefix, type, key].join(delimiter);
}
