/**
 * @file init.js
 * @author tanglei (tanglei02@baidu.com)
 * @description 使用外部 storage 进行数据持久化之后需要在每次启动的时候至少全部编译一次，
 * 以免编译相关改动没有生效
 */

module.exports = class Init {
    apply(on, app) {
        let isReady = false;

        // 缓存资源改变的文档信息 用于两个钩子之间的数据传递
        let cachedChangedFileList;

        on(app.STAGES.GET_ORIGINAL_FILES, originalInfos => {
            if (isReady) {
                return;
            }

            cachedChangedFileList = originalInfos.filter(info => /\.md$/.test(info.path));
        });

        on(app.STAGES.GET_CHANGED_ENTRY_FILES, entryInfos => {
            if (isReady) {
                return;
            }

            // 将所有的 .md 文件放进来解析
            let addEntryInfos = cachedChangedFileList.filter(
                info => entryInfos.every(entryInfo => entryInfo.path !== info.path)
            )
            .map(info => Object.assign({type: 'add'}, info));

            // 清空更改文件的缓存并且修改状态
            cachedChangedFileList = null;
            isReady = true;

            return [...entryInfos, ...addEntryInfos];
        });
    }
};
