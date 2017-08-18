/**
* @file store module
* @author tanglei (tanglei02@baidu.com)
*/

export default function (app) {
    app.config.store = {
        options: {},
        storage: null
    };

    const store = {
        async set(type, key, value) {
            let {storage, options} = app.config.store;
            let name = generateKey(type, key, options);
            return await storage.set(name, value);
        },

        async get(type, key) {
            let {storage, options} = app.config.store;
            let name = generateKey(type, key, options);
            return await storage.get(name);
        },

        async delete(type, key) {
            let {storage, options} = app.config.store;
            let name = generateKey(type, key, options);
            return await storage.delete(name);
        },

        init({
            options = app.default.config.store.options,
            storage = app.default.config.store.storage
        } = {}) {
            this.register(storage);
            this.setOptions(options);
        },

        register(storage) {
            if (storage) {
                app.config.store.storage = storage;
            }
        },

        setOptions(opts) {
            if (opts) {
                app.config.store.options = Object.assign(
                    {},
                    app.default.config.store.options,
                    app.config.store.options,
                    opts
                );
            }
        }
    };

    return store;
};

function generateKey(type, key, {prefix, delimiter}) {
    return [prefix, type, key].join(delimiter);
}