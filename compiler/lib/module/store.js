/**
* @file store module
* @author tanglei (tanglei02@baidu.com)
*/

export default function (app) {
    app.config.store = {
        options: {},
        instance: null
    };

    const store = {
        async set(type, key, value) {
            let {instance, options} = app.config.store;
            let name = generateKey(type, key, options);
            return await instance.set(name, value);
        },

        async get(type, key) {
            let {instance, options} = app.config.store;
            let name = generateKey(type, key, options);
            return await instance.get(name);
        },

        async delete(type, key) {
            let {instance, options} = app.config.store;
            let name = generateKey(type, key, options);
            return await instance.delete(name);
        },

        init({
            options = app.default.config.store.options,
            instance = app.default.config.store.instance
        } = {}) {
            this.register(instance);
            this.setOptions(options);
        },

        register(instance) {
            if (instance) {
                app.config.store.instance = instance;
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