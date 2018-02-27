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
                name: 'c',
                url: '/my/diary/subdir/c'
            },
            {
                path: 'diary/subdir/d.md',
                name: 'd',
                url: '/my/diary/subdir/d'
            }
        ]
    },
    {
        path: 'diary/a.md',
        name: 'a',
        url: '/my/diary/a'
    },
    {
        path: 'diary/b.md',
        name: 'b',
        url: '/my/diary/b'
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
        name: 'c',
        url: '/my/diary/subdir/c'
    },
    {
        path: 'diary/subdir/d.md',
        name: 'd',
        url: '/my/diary/subdir/d'
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
            name: 'c',
            url: '/my/diary/subdir/c'
        },
        {
            path: 'diary/subdir/d.md',
            name: 'd',
            url: '/my/diary/subdir/d'
        }
    ]
}
```

这样，有了编译好的文档，又有了目录，就可以根据实际项目需求自行生成静态站点或者配合服务器构建网站啦！

构建出的网站效果可以参考 [Lavas 官网教程](https://lavas.baidu.com/guide)。

## 配置

kram 的配置项列表：

- [基本配置](#基本配置)
    - [basePath](#basePath)
    - [sources](#sources)
    - [routes](#routes)
- [高级配置](#高级配置)
    - [loader](#loader)
    - [store](#store)
    - [parser](#parser)
    - [highlight](#highlight)
    - [logger](#logger)
    - [plugin](#plugin)

### 基本配置

基本配置属于必要配置，能够生成

#### basePath

@property `{string}` basePath **必须** 且要求为绝对路径

源文件加载到的根目录，
kram 中的文档读取模块只会从这个目录中读取源文件，同时文章和目录的路径信息 `path` 是以 basePath 为根目录计算的。

比如：

```
basePath: path.resolve(__dirname, './dist')
```

#### sources

@property `{Array.<Source>}` sources **必须**

其中 Source 定义为：

@typeof `{Object}` Source

@property `{string}` name 源名称

@property `{string}` loader 加载器名称

其他字段根据不同加载器的要求略有不同。

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

**INFO** 在使用 `download-git-repo` 加载器时使用 `tmp` 参数，且与 `to` 参数不一致，这样在加载的时候，文件先会下载到 tmp 目录下，再将这个文件移动到 basePath 中。这是由于依赖的 `download-git-repo` 在下载时只会进行文件的增量替换，因此如果源文件存在文章删除，是不会生效的。因此需要先把文件下载到别的地方，再与旧的文件做替换。

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

#### routes

@property `{Array.<Route>}` routes

其中 Route 的定义如下：

@typeof {Object} Route

@property {string|RegExp|Function} path 路径匹配规则

@property {Function} url 生成 url 的方法

routes 定义了文件路径到 url 的映射关系。在写 markdown 的时候，可以通过写相对路径的方式去引入文章链接或图片链接等等。匹配规则为按数组顺序从上到下匹配，匹配到的第一条规则时停止匹配并生成对应 url。

示例配置如下所示：

```javascript
routes: [
    {
        path: 'diary/img/d.png',
        url: function (path) {
            return '/assets/' + path;
        }
    },
    {
        path: /\.jpg$/,
        url: function (path) {
            return '/assets/' + path;
        }
    },
    {
        path: function (path) {
            return /\.md$/.test(path);
        },
        url: function (path) {
            return '/my/' + path.replace(/\.md$/, '');
        }
    }
]
```

假设源文件的目录结构为：

```
/diary
|
|----/img
|    |----c.jpg
|    |----d.png
|
|----a.md
|----b.md
```

那么可以在 `a.md` 文件中通过相对路径引入 `c.jpg` 和 `b.md`

```markdown

# 这是文章 A

![引入 a.jpg](./img/c.jpg)

点击跳转到 [文章 B](./b.md)

```

kram 会把 markdown 文件中的这些相对路径转化为相对于 basePath 的路径，然后再通过路由匹配规则替换成对应 url。如前面的 `a.md` 经过编译之后将得到如下 html 片段：

```html
<h1>这是文章 A</h1>
<img src="/assets/diary/c.jpg">
<p>点击跳转到<a href="/my/diary/b">文章 B</a></p>
```

### 高级配置

#### loader

@property `{Object}` loader

kram 默认提供了 `local` 和 `download-git-repo` 两种加载器，在实际项目中如果不满足要求的话，可以选择自定义加载器，定义方法如下所示：

```javascript
loader: {
    'user-defined-loader': function (sourceOptions) {
        // 加载过程
    }
}
```

其中 sourceOptions 为 [sources](#sources) 中定义的源信息，比如这么定义：

```javascript
sources: [
    {
        name: 'test-source',
        loader: 'user-defined-loader',
        propertyA: '123',
        propertyB: '456'
    }
]
```

这条匹配到的源信息对象将整个传入到 'user-defined-loader' 中。

下面以 `local` 加载器的定义作为例子：

```javascript
const fs = require('fs-extra');

loader: {
    local: async function ({from, to}) {
        if (!await fs.exist(from)) {
            throw new Error(from + '文件夹不存在');
        }

        let stat = await fs.stat(from);

        if (!stat.isDirectory()) {
            throw new Error(from + '不是文件夹')
        }

        await fs.remove(to);
        await fs.copy(from, to);
    }
}
```

#### store

@property `{Object}` store

@property `{Object}` store.storage

@property `{Object}` store.options

@property `{string}` store.options.prefix

@property `{string}` store.options.delimiter

store 配置项可以对存储仓库和存储字段格式进行配置。

kram 的默认配置为：

```javascript
store: {
    storage: new MemoryStore(),
    options: {
        prefix: 'KRAM',
        delimiter: '$$'
    }
}
```

##### store.storage

通过该配置项可以自定义存储仓库，只需要实现 `set` `get` `remove` 三个方法即可。默认的 storage 为 MemoryStore，其定义如下：

```javascript
class MemoryStore {
    constructor() {
        this.store = {};
    }

    set(key, val) {
        this.store[key] = val;
    }

    get(key) {
        return this.store[key];
    }

    remove(key) {
        delete this.store[key];
    }
}
```

通过类似的方法，就可以将 Redis MySQL 等封装成 storage 实现编译结果的持久化。

**需要注意的是**
1. kram 会往 storage 中存入 Object 对象，因此在写 `set` 和 `get` 方法的时候请注意做好序列化和反序列化。

2. storage 的 `set` `get` `remove` 支持异步，返回 Promise 对象即可

##### store.options

prefix 是要存储的字段名前所加的前缀，delimiter 是拼接符，按照默认配置，假设文章路径为 `diary/a.md`，那么实际存储到 storage 里的字段名为 `KRAM$$doc$$diary/a.md`。

#### parser

kram 使用了 [marked](https://github.com/chjj/marked) 作为 markdown 解析器，因此 parser 的配置与 marked 的配置大致相同。默认配置为：

```javascript
parser: {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: kram.module.highlighter.highlight,
    renderer: new marked.Renderer()
}
```

其中可以看到 `highlight` 传入的一些奇怪的东西，那是因为 kram 对 highlight 做了一层封装。

highlight 由自己单独的配置项，因此请不要在 `parser` 里修改，如需要修改 highlight 的配置请参考 [highlight 配置说明](#highlight)。

假设需要对 heading 的样式做修改，那么可以这么配置：

```javascript
parser: {
    renderer: {
        heading: function (text, level) {
            return `<h${level} style="color: red">${text}</h${level}>`;
        }
    }
}
```

那么标题元素文字就变成红色啦。

具体 renderer 的说明请阅读 [marked.Renderer](https://github.com/chjj/marked#renderer)。

#### highlight

@property {Object} highlight

@property {Object} highlight.options

@property {Object} highlight.languages

kram 中的代码高亮封装了 [highlight.js](https://github.com/isagalaev/highlight.js) 作为高亮工具。

默认配置为：

```javascript
highlight: {
    options: {
        tabReplace: '    '
    },
    languages: {
        npm: npm,
        vue: vue
    }
}
```

##### highlight.options

options 的配置信息会透传到 `highlightjs.configure()` 中，详细配置请查看 [highlight configure](http://highlightjs.readthedocs.io/en/latest/api.html#configure-options)

##### highlight.languages

虽然 highlight.js 提供了茫茫多的语言的语法高亮，但总归会碰到不支持的语言类型，因此可以通过 languages 配置项进行扩充。

以 vue 为例，其定义及配置为：

```javascript
highlight: {
    languages: {
        vue: function (hljs) {
            return {
                case_insensitive: true,
                subLanguage: 'xml'
            };
        }
    }
}
```

深入了解 highlight.js 的语言定义，请阅读 [Language definition guide](http://highlightjs.readthedocs.io/en/latest/language-guide.html)。

#### logger

默认的 logger 为 console，就是 `console.log` 的 console，如果需要对 kram 编译时的错误信息进行收集，请参照 console 自行实现 `info` `log` `warn` `error` 方法。

默认配置

```javascript
logger: console
```

#### plugin

@property {Object} plugin

插件配置，默认配置为：

```javascript
plugin: {
    insert: new Insert(),
    meta: new Meta(),
    minify: new Minify(),
    style: new Style(),
    stylus: new Stylus()
}
```

自定义插件通过该配置项传给 kram，并在初始化时自动挂在到对应的钩子上。

具体的插件介绍请看下一节 [插件机制](#插件机制)

## 插件机制

kram 提供了一种灵活的插件机制，去依附编译流程实现各种功能，包括数据提取、样式修改、流程控制等等，都能够通过插件实现。

### 插件定义

插件需要是一个实现了 `apply()` 方法的 Object：

```javascript
var plugin = {
    apply: function (on, kram) {

    }
};
```

apply 方法传入两个参数 `on` 和 `kram`。其中 `kram` 即为实例化后的 kram 对象，`on` 为注册监听事件的方法，注册监听事件的方法如下所示：

```javascript
on(kram.STAGES.AFTER_PARSE, function (data, options) {}, 1000);
```

`on` 方法接受 3 个参数：

1. 事件名称，全部的事件名称均挂在 `kram.STAGES` 下
2. 监听方法，根据钩子的不同，监听方法传入的 data 和 options 可能存在，也可能不存在
3. 权重，默认值为 999。kram 会根据这个值对监听到同一个钩子的方法做排序，权重越小越靠前执行。

部分钩子支持异步的监听方法，只需要监听方法返回 promise 对象，或者用 async/await 实现即可：

```javascript
on(kram.STAGES.AFTER_PARSE, async function (data, options) {
    await sleep(5000);
    // process on data
    return data;
});
```

这样，通过监听方法，就能拿到对应钩子的数据，就可以对数据做提取、修改等等，如果将修改的数据 `return` 出来，那么 kram 将会拿修改后的数据走剩下的编译流程，不 `return` 则不会影响。

**这里需要注意的是** 当 data 是 Object 对象时，由于是引用传递，因此在不 `return` 的情况下也有可能造成属性值的修改，在开发插件的时候请注意。

### 事件钩子

- START
    - 回调参数： 无
    - 支持异步：是
    - 说明：编译开始

- BEFORE_LOAD
    - 回调参数：
        - #options# sources 本次加载的源信息
    - 支持异步：是
    - 说明：加载开始前

- AFTER_LOAD
    - 回调参数：
        - #options# sources 本次加载的源信息
    - 支持异步：是
    - 说明：加载结束

- GET_ORIGINAL_FILES
    - 回调参数：
        - #data# fileInfos {Array.<FileInfo>} 源文件信息列表
    - 支持异步：是
    - 说明：kram 将加载到 basePath 的文件读取到内存中

- GET_CHANGED_FILES
    - 回调函数：
        - #data# fileInfos {Array.<FileInfo>} 存在变化的文件信息列表
    - 支持异步：是
    - 说明：kram 将会拿本次加载的文件与上次加载的文件 md5 做 diff，仅保留存在变动的文件（增、删、改）的文件进入下一步处理

- GET_CHANGED_ENTRY_FILES
    - 回调函数：
        - #data# fileInfos {Array.<FileInfo>} 存在变化的入口文件信息列表
    - 支持异步：是
    - 说明：变化的入口文件，从变化的文件中找出 `.md` 后缀的文件进入编译流程

- BEFORE_PARSE
    - 回调函数：
        - #data# md {string} markdown 源文件
        - #options# fileInfo {FileInfo} markdown 源文件信息
    - 支持异步：是
    - 说明：markdown 源文件即将编译成 html 前

- RENDER_(HEADING, IMAGE, LINK ... TEXT)
    - 回调函数：
        - #data# html {string} renderer 对应函数渲染结果
        - #options# options {FileInfo} 当前编译的 markdown 文件信息
                    options.args {Array} 当前渲染函数的输入参数，如 heading 则 args = [text, level]
    - 支持异步：**否**
    - 说明：调用 marked 渲染 markdown 时触发的一系列事件，比如监听 heading() 则注册函数为：`on(kram.STAGES.RENDER_HEADING, (html, {args, path}) => {})`

- AFTER_PARSE
    - 回调函数：
        - #data# html {string} markdown 编译得到的 html
        - #options# fileInfo {FileInfo} markdown 的文件信息
    - 支持异步：是
    - 说明：markdown 编译成 html 之后

- CREATE_DOC_STORE_OBJECT
    - 回调函数：
        - #data# storeInfo {StoreInfo} 存储的文章信息对象
    - 支持异步：是
    - 说明：通过 kram.getDoc('xxx') 所返回的对象

- CREATE_MENU
    - 回调函数：
        - #data# menu {MenuTree} 目录
        - #options# entrys {Array.<StoreInfo>} 用于生成目录的所有编译后的入口文件信息
    - 支持异步：是
    - 说明：生成目录

- DONE
    - 回调函数：无
    - 支持异步：是
    - 说明：编译结束

## API

- [exec](#exec)
- [getMenu](#getMenu)
- [getMenuItem](#getMenuItem)
- [getDoc](#getDoc)
- [getFilePaths](#getFilePaths)
- [getFileInfos](#getFileInfos)
- [getEntryPaths](#getEntryPaths)
- [getEntryInfos](#getEntryInfos)
- [parse](#parse)
- [store](#store)
- [STAGES](#STAGES)
- [on](#on)

### exec

{Promise} exec({string=} sourceName)

@params sourceName 需要加载的资源名称，为空时默认加载全部资源

运行 kram 的方法

```javascript
kram.exec().then(function () {
    //
});

kram.exec('diary').then(function () {
    //
});
```

### getMenu

`{Promise.<MenuTree>}` getMenu({string=} menuPath)

@params menuPath 目录路径，参数为空时默认返回全部的目录信息

获取目录信息的方法

```javascript
kram.getMenu('diary/subdir').then(function (menu) {
    console.log(menu)
})
```

### getMenuItem

`{Promise.<MenuItem>}` getMenuItem({string} menuPath)

@params menuPath 目录路径

获取目录信息的方法

```javascript
kram.getMenuItem('diary/subdir').then(function (menuItem) {
    console.log(menuItem)
})
```

### getDoc

`{Promise.<StoreInfo>}` getDoc({string} docPath)

@params docPath 文章路径

获取编译好的文章信息的方法

```javascript
kram.getDoc('diary/a.md').then(function (docInfo) {
    console.log(docInfo)
})
```

### getFilePaths

`{Promise.<Array.<string>>}` getFilePaths({RegExp|Function=} filter)

@params {RegExp|Function=} filter 过滤条件，默认为空时返回全部的源文件路径列表。

获取源文件的路径列表

```javascript
kram.getFilePaths(/^diary/).then(function (list) {
    console.log(list)
})

// 等价于

kram.getFilePaths(function (path) {
    return /^diary/.test(path);
})
.then(function (list) {
    console.log(list)
})

// list:
// [
//      'diary/a.md',
//      'diary/b.md',
//      'diary/img/e.jpg',
//      'diary/img/f.jpg',
//      'diary/subdir/c.md',
//      'diary/subdir/d.md'
// ]
```

### getFileInfos

`{Promise.<Array.<FileInfo>>}` getFileInfos({RegExp|Function=} filter)

@params {RegExp|Function=} filter 过滤条件，默认为空时返回全部的源文件列表。

```javascript
kram.getFileInfos(/^diary/).then(function (list) {
    console.log(list)
})

// 等价于

kram.getFileInfos(function (path) {
    return /^diary/.test(path);
})
.then(function (list) {
    console.log(list)
})

```

### getEntryPaths

`{Promise.<Array.<string>>}` getEntryPaths({RegExp|Function=} filter)

@params {RegExp|Function=} filter 过滤条件，默认为空时返回全部的入口文件路径列表。

获取入口文件的路径列表

```javascript
kram.getEntryPaths(/^diary/).then(function (list) {
    console.log(list)
})

// 等价于

kram.getEntryPaths(function (path) {
    return /^diary/.test(path);
})
.then(function (list) {
    console.log(list)
})

// 与 getFilePaths 不同的是，getEntryPaths 只会返回 markdown 文件的路径列表

// list:
// [
//      'diary/a.md',
//      'diary/b.md',
//      'diary/subdir/c.md',
//      'diary/subdir/d.md'
// ]
```

### getEntryInfos

`{Promise.<Array.<FileInfo>>}` getEntryInfos({RegExp|Function=} filter)

@params {RegExp|Function=} filter 过滤条件，默认为空时返回全部的入口文件列表。

```javascript
kram.getEntryInfos(/^diary/).then(function (list) {
    console.log(list)
})

// 等价于

kram.getEntryInfos(function (path) {
    return /^diary/.test(path);
})
.then(function (list) {
    console.log(list)
})

```

### parse

`{Promise.<string>}` parse({FileInfo} fileInfo)

@params fileInfo 需要编译的文章信息

编译单篇 markdown 的方法

比如：

```javascript
kram.parse({
    path: 'diary/a.md',
    file: `
        # 这是日记 A
        日记 A 的内容
    `
})
.then(function (html) {
    console.log(html);
})
```

### store

{Object} store
- {Function} store.set({string} type, {string} path, {*} value)
- {Function} store.get({string} type, {string} path)
- {Function} store.remove({string} type, {string} path)

store 对象

### STAGES

事件钩子名称对象

```javascript
kram.STAGES.RENDER_HEADING
kram.STAGES.BEFORE_PARSE
```

### on

{null} on({string} stage, {Function} callback)

监听事件钩子触发的回调，与前面 [插件定义](#插件定义) 中的 on 方法类似，但不同的是
1. callback 不接受返回值，所以回调函数不会影响编译流程
2. callback 定义为异步函数时，不会阻塞编译流程
