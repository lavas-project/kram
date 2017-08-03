# kram

kram （mark <-> kram :-)）是一个文档框架，通过一些简单的配置，便能够将整个 markdown 文件项目，编译生成对应的 html 文件，并组织成一个文档站点。

kram 主要基于以下开源项目：

- 文档解析
    - [marked](https://github.com/chjj/marked)
    - [highlight.js](https://github.com/isagalaev/highlight.js)

- 服务端
    - [akb](https://www.npmjs.com/package/akb)

- 客户端
    - [vue](https://cn.vuejs.org/)
    - [vuetify](https://vuetifyjs.com/)

## 安装及使用

### 项目拷贝

kram 可以通过 github clone 进行安装：

```bash
git clone https://github.com/lavas-project/kram.git
```

得到的目录结构如下所示：

```
app             \
bin             |
config          |
views           |-> 服务端
-- build.sh     |
-- dev.sh       |
-- install.sh   |
-- index.js     /

parser           -> 文档解析
client           -> 客户端
```

项目由服务端、文档解析、客户端三大模块构成，三者的关系如图所示：

![kram 结构图](https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/kram/kram-struct-f2e8b4cb.png)

可以看到：

1. 服务端调用文档解析模块暴露的方法实现文档的加载、解析、更新和读取；
2. 服务端实现客户端框架的渲染，接收前端的 ajax 请求并返回相应的请求数据；
3. 三个模块相对独立，可根据实际需求进行改造或替换；


### 安装依赖

为了开发调试方便，kram 的服务端和客户端是相互独立的，因此需要在根目录和 client 目录分别执行 `npm install` 进行依赖安装：

```bash
# 在项目根目录下执行
npm install
cd client
npm install
```

也可以直接执行 install.sh 进行项目依赖安装：

```bash
sh install.sh
```

### 调试模式

在根目录和 client 目录执行 `npm run dev` 分别将服务端和客户端跑起来，虽然稍微麻烦了点，但好处是在调试阶段可以通过两个 shell 窗口分别查看服务端和客户端的调试信息。

服务端和客户端跑起来之后，分别监听的 `8849` 和 `8080` 端口，客户端向服务端的请求通过 `client/config/index.js` 里的 `dev.proxyTable` 实现请求映射。

### 项目上线

项目开发调试完毕后，可在根目录执行 `npm run build` 或 `sh build.sh` 实现项目的打包，打包完成后会在根目录生成 `output.zip` 文件。

上线时，只需将 output.zip 上传至上线机器，解压后在项目根目录执行 `sh run.sh` 即可。

## 模块说明

### 文档解析

文档解析模块是 kram 的核心，基于 `marked` 和 `highlight.js`。文档解析模块的大致流程为：

1. 下载/加载文档项目
2. 将文档编译为 html，生成整个文档项目的目录结构
3. 将编译好的文档和目录结构信息存储至 store 中
4. 通过 `get()` 方法从 store 读取编译好的文档或目录结构

#### 对外接口

文档解析模块通过 `parser/index.js` 定义需要暴露的接口：

- **config** {Object} 文档的配置文件信息，即 `parser/config.js`
- **configure** {Function} 动态配置
- **init** {Function} 文档初始化
- **build** {Function} 文档编译
- **pull** {Function} 文档下载
- **get** {Function} 获取编译好的文档\文档目录结构

接口之间的相互关系可以通过下图表示：

![文档解析结构](https://gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/kram/parser-f9848b73.png)

#### 配置说明

文档的配置信息分为静态配置和动态配置两个部分，静态配置文件为 `parser/config.js`，其中最重要的两个配置信息为 `store` 和 `repos`。

##### store

store 为编译好的文档信息的存储仓库，默认为 MemoryStore，信息全部存到当前运行环境的内存里，你可以根据实际需要更改为 Redis、mongodb、mysql 等等，只需要传入的 store 实现以下接口即可：

- {Promise} set(key, value)
- {Promise} get(key)

##### repos

repos 为文档源文件存储仓库，kram 允许源文件放在 github 上或者本地，其配置如下所示：

```javascript
repos: {
    'lavas': {
        // github 仓库地址
        github: 'github:lavas-project/lavas-tutorial'
    },
    'pwa-doc': {
        // 本地文件夹
        local: path.resolve(__dirname, '../doc/pwa-doc')
    }
}
```

我们可以定义不同仓库的文档使用不同的路由名称：

```javascript
repos: {
    'lavas': {
        // ...

        // 通过 /guide/:articleKey 可以访问到 lavas 的文章
        routeName: 'guide'
    },
    'pwa-doc': {
        // ...

        // 通过 /doc/:articleKey 可以访问到 pwa-doc 的文章
        routeName: 'doc'
    }
}
```

#### 编译流程

通过调用暴露的 `init`、`pull`、`build` 方法去实现文档的编译并存储于 store 中。

在调用 init 方法时，会将本地的文档仓库进行编译，同时去下载 github 的文档，文档下载好之后再进行编译。

对于更新频繁的 github 文档，可在运行过程中调用 `pull` 和 `build` 方法去更新并编译文档。

每篇文章编译完成后会生成相关文章信息对象，结构如下：

- html 文章对应的 html
- chapters 文章的章节信息
- title 文章标题
- url 文章的 url

每篇文章编译完成后会生成一个 docKey，由文章路径构成。如：

```
vue
  |- foundation
      |- get-start.md

对应的 key 为：
vue/foundation/get-start
```

编译过程还会生成文档的目录结构并存储起来，每个目录同样会生成一个 catalogKey，由文档的目录的路径构成：如：

```
vue
  |- foundation
  |   |- get-start.md
  |- test.md

对应的 catalogKey 为：
vue
vue/foundation

特别地，根目录的 catalogKey 为
/
```

#### 读取

通过调用 get 方法读取编译好的文档或目录信息：

```javascript
// 读取文档：

let docInfo = await parser.get(
        {
            repoKey: 'lavas',
            docKey: 'vue/foundation/get-start'
        },
        'doc'
    );

// 读取目录结构：

let catalogInfo = await parser.get(
        {
            repoKey: 'lavas',
            catalogKey: 'vue/foundation'
        },
        'catalog'
    );
```

### 服务端

服务端采用了 `akb` 作为服务端框架。服务端主要做了以下事情：

1. 初始化阶段调用文档编译模块传入相关配置并进行编译初始化；
2. 使用 akb 的 `cron` 模块实现 github 文档的定时更新编译；
3. 客户端静态资源返回；
4. 客户端 ajax 请求的处理；

#### 初始化

服务端初始化阶段会触发 `started` 钩子函数，在 `app/hooks/started.js` 中调用文档编译模块的 `configure` 和 `init` 方法完成初始化。

#### 定时任务

akb 集成了 `node-cron`，可通过配置 `config/cron.js` 实现文档的定时更新，目前默认的配置为每 5 分钟去执行一次 `app/cron/updateDoc.js`，
在 `updateDoc.js` 中调用文档编译模块的 `pull` 和 `build` 方法去实现文档的定时更新编译。

#### 路由

akb 的路由配置文件为 `config/router.js`，路由主要做四件事情：

1. 将 ajax 请求路由到对应的 controller 中
2. 返回前端页面框架（vue 编译生成的 html js css 以及其他的 assets）
3. 返回文档图片
4. 匹配不到的资源返回 404

#### ajax 请求

前端通过 `/api/doc/getCatalog`、 `/api/doc/getDoc` 这两个 action 分别请求文章的目录和文章信息，
对应的文件在 `app/controllers/doc` 下面，这两个 action 调用了文档编译系统的 get 方法进行文档信息读取。


### 客户端

客户端采用 `vue` 作为前端框架，通过 `vue-cli` 生成基本的项目结构，因此调试和编译的方式与其他 vue 的项目一致。客户端以组件为粒度提供了文档目录，章节目录，文档容器，回到顶部，面包屑导航等等组件，并写了首页、文档页、demo 页等等页面来举例前端路由的组织方法和组件的使用方法。