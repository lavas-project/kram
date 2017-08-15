/**
* @file store module
* @author tanglei (tanglei02@baidu.com)
*/

export default function (app) {
    app.config.store = {
        options: {},
        instance: null
    };

    return {
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

        config() {

        },

        register(instance) {
            app.config.store.instance = instance;
        },

        setOptions(opts) {
            app.config.store.options = Object.assign(
                {},
                app.default.config.store.options,
                app.config.store.options,
                opts
            );
        }
    }
};

function generateKey(type, key, {prefix, delimiter}) {
    return [prefix, type, key].join(delimiter);
}