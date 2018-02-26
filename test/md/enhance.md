title: 测试 info 插件（到下方的 “----” 为止）
author: 作者1, 作者2
tag: 测试tag1, 测试tag2
----------------

上述内容会被 info 模块（`lib/module/functional/info.js`）提取，并在编译结束生成文档存储对象的时候（STAGES.CREATE_DOC_STORE_OBJECT）自动挂载到 `info` 属性下：

```javascript
console.log(obj.info);

/*

{
    "title": "测试 info 插件（到下方的 “----” 为止）",
    "author": "作者1, 作者2",
    "tag": "测试tag1, 测试tag2"
}

 */

```

# 测试一级标题

## 测试二级标题

### 测试三级标题

# [`测试一个多重语法嵌套`](./haha)

```javascript
console.log('hello world');
```

测试自定义 `npm` 语法高亮（`lib/default/highlight/npm.js`）：

```npm
npm install --save-dev lavas
```

测试 insert 插件（`lib/default/plugin/insert.js`）：

{{- insert: ./partials/author.partial.html -}}

<div class="svg">{{- insert: ./partials/svg.partial.xml -}}</div>


测试 style 插件（`lib/default/plugin/style.js`），所有 style 标签的样式会提取合并，最终注入到 head 标签中（如有）或者是 html 片段的开头：

<style>
.haha {background: #dcdcdc;}
.haha .lala {font-size: 1em}
</style>

测试 stylus 插件（`lib/default/plugin/stylus.js`），需要在 style 标签上指定 lang：

<style lang="stylus">
    $color-blue = #112211
    .a
        color #fff
        .c
            background-color $color-blue
</style>
