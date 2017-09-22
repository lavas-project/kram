/**
* @file store module
* @author tanglei (tanglei02@baidu.com)
*/

export default function (app) {
    let options;
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

        async set(type, key, value) {
            let name = generateKey(type, key, options);
            return await storage.set(name, value);
        },

        async get(type, key) {
            let name = generateKey(type, key, options);
            return await storage.get(name);
        },

        async delete(type, key) {
            let name = generateKey(type, key, options);
            return await storage.delete(name);
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

function generateKey(type, key, {prefix, delimiter}) {
    return [prefix, type, key].join(delimiter);
}
