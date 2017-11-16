/**
 * @file logger.js
 * @author tanglei (tanglei02@baidu.com)
 */

export default function (app) {
    let logger;

    app.addModule('logger', {
        get() {
            return logger;
        },
        set(val) {
            logger = val;
        }
    });

    return () => {
        logger = app.config.logger || app.default.config.logger;
    };
}
