/**
 * @file logger.js
 * @author tanglei (tanglei02@baidu.com)
 */

export default function (app, addModule) {
    let config = null;

    const log = {
        get default() {
            return app.default.config.logger;
        },
        set logger(logger) {
            config = logger;
        },
        get logger() {
            return config;
        }
    };

    addModule('logger', {
        config: {
            get() {
                return config;
            }
        },
        module: {
            get() {
                return log;
            }
        },
        init(logger = log.default) {
            log.logger = logger;
        }
    });
}
