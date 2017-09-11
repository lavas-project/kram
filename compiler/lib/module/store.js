/**
* @file store module
* @author tanglei (tanglei02@baidu.com)
*/

export default function (app, addModule) {
    const config = {
        options: {},
        storage: null
    };

    const store = {
        get config() {
            return config;
        },

        get default() {
            return app.default.config.store;
        },

        setStorage(storage) {
            if (storage) {
                config.storage = storage;
            }
        },

        setOptions(opts) {
            if (opts) {
                config.options = Object.assign(
                    {},
                    this.default.options,
                    config.options,
                    opts
                );
            }
        },

        async set(type, key, value) {
            let {storage, options} = config;
            let name = generateKey(type, key, options);
            return await storage.set(name, value);
        },

        async get(type, key) {
            let {storage, options} = config;
            let name = generateKey(type, key, options);
            return await storage.get(name);
        },

        async delete(type, key) {
            let {storage, options} = config;
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

        store.setStorage(storage);
        store.setOptions(options);
    };
}

function generateKey(type, key, {prefix, delimiter}) {
    return [prefix, type, key].join(delimiter);
}
