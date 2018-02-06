# kram 1.0

kram （kram <--> mark :-)）是一个文档解析模块，封装了文档从文件载入到编译结果输出的全部功能，同时基于源文件的目录结构生成网站目录。

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
    ],

    // 路由定义
    routes: [
        {
            path: /\.md$/,
            url(filename) {
                filename = filename.replace(/\.md$/, '');
                return `/my/${filename}`;
            }
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
kram.exec().then(function () {

    // 假设有篇文档的路径为：basePath/diary/2018/02/06/todo.md
    kram.getDoc('diary/2018/02/06/todo.md')
        .then(function (docInfo) {
            console.log(docInfo);

            // docInfo {Object} 包含以下信息
            // - path 文章路径，对应上面的 diary/2018/02/06/todo.md
            // - url 文章 url，/my/diary/2018/02/06/todo
            // - html 编译好的 html
            // - chapters 文章标题树状结构
            // - info 文章其他相关信息
        });

});
```

假设 `diary/` 文件夹结构为：

```
/diary
|
|----/subdir
|    |----c.md
|    |----d.md
|
|----a.md
|----b.md
```

那么在编译完成之后，可以通过 `getMenu()` 方法获得目录信息：

```javascript
kram.getMenu().then(function (menuList) {
    console.log(menuList);
});
```

得到的目录信息为：

```javascript
[
    {
        path: 'diary/subdir',
        name: 'subdir',
        children: [
            {
                path: 'diary/subdir/c.md',
                name: 'c'
            },
            {
                path: 'diary/subdir/d.md',
                name: 'd'
            }
        ]
    },
    {
        path: 'diary/a.md',
        name: 'a'
    },
    {
        path: 'diary/b.md',
        name: 'c'
    }
]
```

可以通过子目录路径拿到子目录：

```javascript
kram.getMenu('diary/subdir').then(function (menuList) {
    console.log(menuList);
})
```

得到的则是 `diary/subdir` 下的目录信息

```javascript
[
    {
        path: 'diary/subdir/c.md',
        name: 'c'
    },
    {
        path: 'diary/subdir/d.md',
        name: 'd'
    }
]
```

如果想拿到子目录本身的节点，可以通过 `getMenuItem()` 方法获取：

```javascript
kram.getMenuItem('diary/subdir').then(function (menuItem) {
    console.log(menuItem);
})
```

则得到的结果为

```javascript
{
    path: 'diary/subdir',
    name: 'subdir',
    children: [
        {
            path: 'diary/subdir/c.md',
            name: 'c'
        },
        {
            path: 'diary/subdir/d.md',
            name: 'd'
        }
    ]
}
```

这样，有了编译好的文档，又有了目录，就可以根据实际项目需求自行生成静态站点或者配合服务器构建网站啦！

构建出的网站效果可以参考 [Lavas 官网教程](https://lavas.baidu.com/guide)。

## 配置

kram 的配置项列表：

- [basePath](#basePath)
- [sources](#sources)
- [routes](#routes)
- [loader](#loader)
- [store](#store)
- [highlight](#highlight)
- [logger](#logger)
- [plugin](#plugin)

### basePath

@property `{string}` basePath **必须** 且要求为绝对路径

源文件加载到的根目录，
kram 中的文档读取模块只会从这个目录中读取源文件，同时文章和目录的路径信息 `path` 是以 basePath 为根目录计算的。

EXP

```
basePath: path.resolve(__dirname, './dist')
```

### sources

@property `{Array.<Source>}` sources **必须**

其中 Source 定义为：

@typeof `{Object}` Source
@property `{string}` name 源名称
@property `{string}` loader 加载器名称
@property `{string}` from 源文件来源
@property `{string}` to 加载到的位置

kram 内置了两种加载器 `local` 和 `download-git-repo`，分别用于加载本地文件夹和 github 仓库。

以 `local` 加载器为例，假设 sources 配置如下所示：

```javascript
sources: [
    {
        name: 'diary',
        loader: 'local',
        from: path.resolve(__dirname, '../my/diary'),
        to: path.resolve(basePath, 'diary')
    }
]
```

那么源文件将从 `path.resolve(__dirname, '../my/diary')` 拷贝到 `path.resolve(basePath, 'diary')` 目录中。

以 `download-git-repo` 为例，假设 sources 配置如下所示：

```javascript
sources: [
    {
        name: 'lavas',
        loader: 'download-git-repo',
        from: 'github:lavas-project/lavas-tutorial',
        to: path.resolve(basePath, 'lavas'),
        tmp: path.resolve(__dirname, 'tmp/lavas')
    }
]
```

那么源文件将从 github 将文档下载到本地。

`download-git-repo` 加载器封装自 [download-git-repo](https://github.com/flipxfx/download-git-repo)，所以 `from` 的拼写规则可以参考它的 `repository`。

**建议** 在使用 `download-git-repo` 加载器时增加 `tmp` 参数，且与 `to` 参数不一致，这样在加载的时候，文件先会下载到 tmp 目录下，再将这个文件移动到 basePath 中。这是由于依赖的 `download-git-repo` 在下载时只会进行文件的增量替换，因此如果源文件存在文章删除，是不会生效的。因此需要先把文件下载到别的地方，再与旧的文件做替换。

kram 允许定义多个源：

```javascript
sources: [
    {
        name: 'diary',
        loader: 'local',
        from: path.resolve(__dirname, '../my/diary'),
        to: path.resolve(basePath, 'diary')
    },
    {
        name: 'lavas',
        loader: 'download-git-repo',
        from: 'github:lavas-project/lavas-tutorial',
        to: path.resolve(basePath, 'lavas'),
        tmp: path.resolve(__dirname, 'tmp/lavas')
    }
]
```

在运行 kram 的时候，就可以一次性加载编译全部，或者指定源进行编译：

```javascript
// 不传参数，默认全部源加载编译
kram.exec();

// 指定源编译
kram.exec('diary');
```

### routes

