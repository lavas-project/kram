/**
 * @file index.js
 * @author tanglei (tanglei02@baidu.com)
 */

import defaultData from './default';
import * as modules from './module';
import {is, subset} from './utils';


const moduleNames = Object.keys(modules);

export class Kram {

    /**
     * Kram constructor
     *
     * @param {Object=} config configure options
     */
    constructor(config = {}) {
        this.module = {};

        // 模块实例化并挂载到 this.module 上
        // 因为模块间可能存在相互调用，因此先统一挂载，最后再初始化
        let inits = moduleNames.map(key => modules[key](this)).filter(init => !!init);

        // 初始化默认参数与默认插件等等
        this.default = defaultData(this);

        // 初始化配置
        this.config = is(Function, config) ? config(this) : config;

        // 初始化模块
        inits.forEach(fn => fn());
    }

    /**
     * 将模块挂载到 .module 上
     * e.g. compiler.addModule('hello', () => 'world')
     * 那么 compiler.module.hello === 'world'
     *
     * @param {string} name module's name
     * @param {Function|Object} descriptor property descriptor or simply a getter function
     */
    addModule(name, descriptor) {
        Object.defineProperty(
            this.module,
            name,
            is(Function, descriptor) ? {get: descriptor} : descriptor
        );
    }

    /**
     * 运行 kram
     *
     * @param {string|null} sourceName 需要加载的资源名称，为 null 时默认加载全部资源
     */
    async exec(sourceName) {
        let {loader, file, parser, menu, hook} = this.module;

        // 通知运行开始
        this.logger.info('[kram] execution start.');
        await hook.exec(hook.STAGES.START);

        // 加载资源
        let sources = await loader.load(sourceName);

        // 对资源做预处理与过滤
        let {change = [], remove = []} = await file.process(sources);

        if (change.length + remove.length > 0) {
            // 对文档进行编译和存储
            await parser.parseAndStore(change, remove);
            // 生成菜单
            await menu.generateAndStore();
        }

        // 通知运行结束
        await hook.exec(hook.STAGES.DONE);
        this.logger.info('[kram] execution done.');
    }

    /**
     * 编译单片文档
     *
     * @return {Function} 编译方法
     */
    get parse() {
        return this.module.parser.parse;
    }

    /**
     * logger
     *
     * @return {Object} logger 对象
     */
    get logger() {
        return this.module.logger;
    }

    /**
     * store object
     *
     * @return {Object} 存储对象，仅暴露 set get remove 三个方法
     */
    get store() {
        return subset(this.module.store, ['set', 'get', 'remove']);
    }

    /**
     * 获取菜单
     *
     * @return {Function} 获取菜单的方法
     */
    get getMenu() {
        return this.module.menu.getMenu;
    }

    /**
     * 获取菜单对象
     *
     * @return {Function} 获取菜单对象的方法
     */
    get getMenuItem() {
        return this.module.menu.getMenuItem;
    }

    /**
     * 获取文档
     *
     * @return {Function} 获取文档对象的方法
     */
    get getDoc() {
        return this.module.parser.get;
    }

    /**
     * 获取文件路径（包括文档和依赖文件）
     *
     * @return {Function} 获取文件路径的方法
     */
    get getFilePaths() {
        return this.module.file.filePaths;
    }

    /**
     * 获取文件信息（包括文档和依赖文件）
     *
     * @return {Function} 获取文件信息的方法
     */
    get getFileInfos() {
        return this.module.file.fileInfos;
    }

    /**
     * 获取文档文件路径
     *
     * @return {Function} 获取文档文件路径的方法
     */
    get getEntryPaths() {
        return this.module.file.entryPaths;
    }

    /**
     * 获取文档文件信息
     *
     * @return {Function} 获取文档文件信息的方法
     */
    get getEntryInfos() {
        return this.module.file.entryInfos;
    }

    /**
     * 插件列表
     *
     * @return {Array} 返回插件列表
     */
    get plugins() {
        return this.module.plugin.list;
    }

    /**
     * 钩子列表
     *
     * @return {Array} 钩子列表
     */
    get STAGES() {
        return this.module.hook.STAGES;
    }

    /**
     * 监听钩子事件触发的回调，不阻塞执行流程
     *
     * @param {string} stage 事件名称
     * @param {Function} callback 回调
     */
    on(stage, callback) {
        this.module.event.on(stage, callback);
    }
}
