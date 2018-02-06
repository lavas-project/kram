# kram 1.0

kram （kram <--> mark :-)）是一个文档解析模块，封装了文档从文件载入到编译结果输出的全部功能，同时基于源文件的目录结构生成网站目录。

它的结构框图如图所示：

[kram 结构图](#./documents/img/kram.png)

从大体上，kram 由 4 个模块构成：

- 加载模块
- 编译模块
- 生成模块
- 存储器

## 使用方式

通过 `npm` 安装 kram：

```bash
npm install --save kram
```

在代码中引入 kram：

```javascript
// commonjs
var Kram = require('kram').Kram;

// ES6
import {Kram} from 'kram';
```

然后传入配置项传入如下配置：

```javascript
var kram = new Kram({
    // 文档编译环境根目录，绝对路径
    basePath: path.resolve(__dirname, 'tmp'),

    // 源文件定义
    sources: [
        {
            // 源名称
            name: 'diary',

            // 加载器，默认提供了 local 和 download-git-repo 两种
            // 对应加载本地文档和加载 GitHub 文档
            loader: 'local',

            // 源文件来源
            from: path.resolve(__dirname, 'local/diary/path'),

            // 源文件加载到编译环境的位置，要求必须放在 basePath 目录下
            to: path.resolve(__dirname, 'tmp/diary')
        }
    ]
});
```

启动编译：

```javascript
var promise = kram.exec();
```

编译方法返回一个 `Promise` 对象，当 Promise 对象 resolve 时，编译结束，此时便可以从存储器中读取到编译好的文档啦：

```javascript
promise.then(function () {

    // 假设有篇文档的路径为：basePath/diary/2018/02/06/todo.md
    kram.getDoc('diary/2018/02/06/todo')
        .then(function (docInfo) {
            console.log(docInfo);

            // docInfo {Object} 包含以下信息
            // - path 文章路径，对应上面的 diary/2018/02/06/todo
            // - html 编译好的 html
            // - chapters 文章标题树状结构
            // - info 文章相关信息
        });

});
```