<template>
<div class="index-page-wrapper" id="container">
    <div class="section-slogan">
        <h1 class="slogan-title">LAVAS</h1>
        <div class="slogan-desc-wrapper wd-md-show wd-lg-show">
            <h3 class="slogan-desc">基于 Vue.js 的 PWA 解决方案</h3>
            <h3 class="slogan-desc">帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题</h3>
        </div>
        <div class="slogan-desc-wrapper wd-xs-show wd-sm-show">
            <h3 class="slogan-desc">基于 Vue.js 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题</h3>
        </div>
        <div class="btn-wrapper">
            <v-btn class="btn-startup"
                to="/guide"
            ><i class="fa fa-paper-plane" aria-hidden="true"></i>起步</v-btn>
            <v-btn class="btn-github"
                href="https://www.github.com/lavas-project"
                target="_blank"
                outline
            ><i aria-hidden="true" class="fa icon fa-github"></i>Github</v-btn>
        </div>
    </div>
    <div class="section-feature">
        <div class="section-feature-mask">
            <div class="section-feature-inner">
                <div class="feature-wrapper">
                    <div class="icon-wrapper">
                        <svg class="feature-icon" width="200px" height="200px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M853.333333 490.666667h-64v-170.666667c0-46.933333-38.4-85.333333-85.333333-85.333333h-170.666667V170.666667c0-59.733333-46.933333-106.666667-106.666666-106.666667S320 110.933333 320 170.666667v64h-170.666667c-46.933333 0-85.333333 38.4-85.333333 85.333333v162.133333H128c64 0 115.2 51.2 115.2 115.2S192 712.533333 128 712.533333H64v162.133334c0 46.933333 38.4 85.333333 85.333333 85.333333h162.133334V896c0-64 51.2-115.2 115.2-115.2s115.2 51.2 115.2 115.2v64h162.133333c46.933333 0 85.333333-38.4 85.333333-85.333333v-170.666667H853.333333c59.733333 0 106.666667-46.933333 106.666667-106.666667s-46.933333-106.666667-106.666667-106.666666z" /></svg>
                    </div>
                    <h3 class="feature-title">完善的前端开发框架</h3>
                </div>
                <div class="feature-wrapper">
                    <div class="icon-wrapper">
                        <svg class="feature-icon" width="200px" height="200px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M320 128l-64 64v128L128 448v192L0 768v192h704l64-64V768H64l128-128h640l64-64V448H192l128-128h640l64-64V128z" /></svg>
                    </div>
                    <h3 class="feature-title">自动化站点 PWA 实现</h3>
                </div>
                <div class="feature-wrapper">
                    <div class="icon-wrapper">
                        <svg class="feature-icon" width="200px" height="200px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M738.5088 1023.83616H285.4912c-66.68288 0-120.75008-57.30304-120.75008-127.95904V128.12288c0-70.69696 54.0672-127.95904 120.79104-127.95904h452.93568c66.7648 0 120.832 57.26208 120.832 127.95904v767.75424c0 70.656-54.0672 127.95904-120.832 127.95904z m60.37504-895.71328c0-35.34848-27.0336-63.97952-60.416-63.97952H285.53216c-33.3824 0-60.416 28.672-60.416 63.97952v31.9488h573.76768v-31.9488z m0 95.96928H225.11616v511.83616h573.76768V224.09216z m0 575.81568H225.11616v95.96928c0 35.34848 27.0336 63.97952 60.416 63.97952h452.93568c33.3824 0 60.416-28.672 60.416-63.97952V799.9488zM512 927.86688c-24.9856 0-45.30176-21.504-45.30176-47.96416 0-26.50112 20.2752-48.00512 45.30176-48.00512 24.9856 0 45.30176 21.504 45.30176 48.00512 0 26.50112-20.2752 47.96416-45.30176 47.96416z" /></svg>
                    </div>
                    <h3 class="feature-title">Lavas App 支持</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="section-cli">
        <div class="section-cli-inner">
            <div class="cli-wrapper">
                <h1 class="cli-title">Lavas CLI</h1>
                <p class="cli-desc">通过 Lavas 命令行工具，可以快速构建出 PWA 项目框架。框架所提供的功能基本涵盖了 Web App 大多数应用场景，包括服务端渲染（SSR）、单页应用（SPA）、多页应用（MPA）等等，并且能够在构建项目时自动生成 manifest.json、Service Worker 等文件，使站点具有 PWA 功能。</p>
                <p class="cli-desc">我们提供了一系列教程来帮助您快速上手 Lavas，您可以根据 Codelab 按步骤学习框架的使用，也可以通过阅读 Lavas 相关的技术文档，深入理解 Lavas 是怎么运作的。</p>
                <div class="btn-wrapper">
                    <v-btn class="btn-codelab" to="/codelab"><i class="fa fa-book" aria-hidden="true"></i>Codelab</v-btn>
                    <v-btn class="btn-guide"
                        to="/guide" target="_blank"
                        outline
                    ><i class="fa fa-tablet" aria-hidden="true"></i>教程</v-btn>
                </div>
            </div>
            <div class="shell-typed-wrapper">
                <div class="typed-title">
                    <span class="bash-btn bash-close"></span>
                    <span class="bash-btn bash-small"></span>
                    <span class="bash-btn bash-full"></span>
                </div>
                <div class="typed-content"><div class="typed-content-in"></div></div>
            </div>
        </div>
    </div>
    <div class="section-us-show">
        <div class="us-inner-wrapper">
            <h1>关注我们</h1>
            <div class="us-desc wd-sm-show wd-md-show wd-lg-show">
                <h3>可以通过以下渠道，及时与我们交流 Lavas 动态</h3>
                <h3>Lavas 官方 QQ 群， 群号：655433298</h3>
            </div>
            <div class="us-desc wd-xs-show">
                <h3>Lavas 官方 QQ 群</h3>
                <h3>群号：655433298</h3>
            </div>
            <div class="us-qrcode"><div class="img"></div></div>
            <div class="btn-wrapper">
                <v-btn class="contact-item btn-github" target="_blank" href="https://www.github.com/lavas-project"><i aria-hidden="true" class="fa icon fa-github"></i>Github</v-btn>
                <v-btn class="contact-item btn-email" href="mailto:lavas@baidu.com"><i class="fa fa-envelope" aria-hidden="true"></i> lavas@baidu.com</v-btn>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import Typed from 'typed.js';
import {scrollTop, deviceWidth} from '@/assets/common/utils/dom';

export default {
    name: 'hello',
    metaInfo: {
        title: 'Lavas',
        titleTemplate: '%s | 基于 Vue 的 PWA 完整解决方案',
        meta: [
            {
                name: 'keywords',
                content: 'lavas, pwa, vue, baidu, service wroker'
            },
            {
                name: 'description',
                content: '基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题'
            }
        ]
    },
    asyncData({store, route}) {
        store.dispatch('app-shell/setPath', route.path);
    },
    data() {
        return {
            isMobile: false,
            isMounted: false
        };
    },
    computed: {
        autoPlay() {
            return this.isMounted && !this.isMobile;
        }
    },
    mounted() {
        let rootPath = '`<span class="hljs-string">~</span> <span class="hljs-meta">$</span>`';

        let typedList = [
            [rootPath, 1000, '<span class="hljs-built_in">npm</span> install -g <span class="hljs-keyword">lavas</span>'],
            [1500, '`<span class="hljs-meta">-- lavas@2.2.3</span>`', 500],
            [rootPath, 1000, '<span class="hljs-keyword">lavas</span> init'],
            [1000, '`LAVAS <span class="hljs-attr">INFO</span> 欢迎使用 Lavas 解决方案`'],
            ['`LAVAS <span class="hljs-attr">INFO</span> 开始新建一个 Lavas PWA 项目`'],
            ['`<span class="hljs-attr">?</span> 选择一个模版类型（<span class="hljs-attr">按上下键选择</span>）：`'],
            ['`<span class="hljs-literal">> Basic</span>`'],
            ['`<span class="hljs-literal">&nbsp;&nbsp;&nbsp;&nbsp;lavas 基础模板，包含 PWA 工程化相关必需内容</span>`'],
            ['`AppShell`'],
            ['`<span class="hljs-meta">&nbsp;&nbsp;&nbsp;&nbsp;lavas appShell 模板，包含 PWA 工程化以及基础 UI 相关必需内容</span>`', 1500],
            ['`正在拉取云端数据，请稍候...`', 1500],
            ['``'],
            ['`<span class="hljs-attr">? </span><span class="hljs-meta">请输入项目名称：(pwa-project)</span>`', 2000, 'test'],
            ['`<span class="hljs-attr">? </span><span class="hljs-meta">请输入项目作者：(xxx)</span>`', 1000, 'my-name'],
            ['`<span class="hljs-attr">? </span><span class="hljs-meta">请输入email：(xxx@xxx.xxx)</span>`', 1000, 'my-name@baidu.com'],
            ['`<span class="hljs-attr">? </span><span class="hljs-meta">请输入项目描述：(这是一个 Lavas PWA 项目)</span>`', 1000],
            ['`LAVAS <span class="hljs-attr">INFO</span> 正在导出工程...`', 2000],
            ['`LAVAS <span class="hljs-attr">INFO</span> 项目已创建成功！`'],
            ['`LAVAS <span class="hljs-attr">INFO</span> 您可以操作如下命令快速开始开发 Lavas 工程`'],
            ['``'],
            ['`<span class="hljs-attr">cd test</span>`'],
            ['`<span class="hljs-attr">npm install</span>`'],
            ['`<span class="hljs-attr">lavas dev</span>`', 5000]
        ];

        let typedString = typedList.map(line => {
            return line.map(word => {
                if (typeof word === 'number') {
                    return ` ^${word} `;
                }
                return word;
            })
            .join('');
        })
        .join('<br>');

        new Typed('.typed-content-in', {
            strings: [typedString],
            typeSpeed: 30,
            backSpeed: 0,
            smartBackspace: false,
            loop: false,
            // loop: true
            onComplete(self) {
                self.reset();
            }
        });

        this.isMounted = true;
        this.onResize();

        // 临时变量
        this.resize = this.onResize.bind(this);
        window.addEventListener('resize', this.resize);
    },
    methods: {
        onResize() {
            this.isMobile = deviceWidth() < 768;
        }
    },
    beforeDestroy() {
        this.isMounted = false;
        window.removeEventListener('resize', this.resize);
    }
};

</script>

<style lang="stylus">
@require '~@/assets/style/variable'
@require '~@/assets/style/devices'

// tanglei@2018/01/19 vuetify 控件样式的代码冗余
// 是为了提取出来的样式能够给 mip 页直接使用

.index-page-wrapper
    .btn-wrapper
        i.fa
            color inherit
            margin-right 5px

    .section-slogan
        background $colorBlue
        height 768px
        overflow hidden
        padding-top 64px
        text-align center
        margin-top -64px


        .slogan-title
            color $colorWhite
            font-size 64px
            font-weight 400
            text-align center
            margin 140px 0 20px
            text-shadow 1px 1px 3px #0000003f

        .slogan-desc
            color $colorWhite
            font-size 30px
            font-weight 400
            padding 0 40px
            text-align center
            margin 0 auto

        .btn-wrapper
            margin 50px auto 0
            text-align center

            .btn-startup,
            .btn-github
                display inline-block
                width 190px
                height 50px
                border-radius 5px
                line-height 50px
                font-size 18px
                margin 6px 8px

            .btn-startup
                color $colorBlue
                box-shadow none
                background $colorWhite

            .btn-github
                color $colorWhite
                background $colorBlue
                border 1px solid $colorWhite

    .section-feature
        background $colorWhite
        .section-feature-mask
            padding 50px 0

        .section-feature-inner
            max-width 1200px
            padding 0 50px
            display flex
            margin 0 auto

        .feature-wrapper
            flex 1

        .icon-wrapper
            width 130px
            height 130px
            border-radius 65px
            border 2px solid $colorBlue
            position relative
            margin 0 auto

        .feature-icon
            width 60% !important
            height 60% !important
            fill $colorBlue !important
            absolute 50% _ _ 50%
            transform translate(-50%, -50%)
            path
                fill $colorBlue !important

        .feature-title
            margin-top 20px
            font-size 26px
            text-align center
            color $colorBlue
            font-weight 500

    device(0.8)

    .video
        display inline-block
        inner(0.8)

    .section-pwa-show
        width 100%
        padding 50px 0
        background $colorBlackBlue
        position relative
        overflow hidden

        .pwa-inner-wrapper
            max-width 1200px
            margin 0 auto
            padding 0 50px
            position relative
            z-index 1

            .pwa-video
                vertical-align middle
                position absolute
                bottom 0
            .pwa-content
                text-align left
                vertical-align middle
                margin-left 250px
                padding 60px 50px 80px 80px

                .pwa-show-title
                    color $colorWhite
                    font-size 64px
                    margin-top 0
                    font-weight 400
                    line-height 72px

                .pwa-show-desc
                    color $colorGreyTrace
                    font-size 30px
                    font-weight 400

                .pwa-show-content
                    // background #f2f3f5
                    color $colorGreyTrace
                    font-size 18px
                    line-height 1.5
                    margin-top 20px
                    ul
                        margin-bottom 16px
                        list-style-type none

                .btn-wrapper
                    width 100%
                    margin-top 50px
                    .btn
                        display inline-block
                        margin-left 10px
                        width 190px
                        height 50px
                        border-radius 5px
                        line-height 50px
                        font-size 18px
                        text-align center
                        color $colorWhite
                        a
                            text-decoration none
                            color $colorWhite
                        &.btn-pwa
                            background $colorWhite
                            box-shadow none
                            margin 0 10px 0 0
                            color $colorBlackBlue
                        &.btn-demo
                            color $colorWhite
                            margin 0 0 0 10px

    .section-cli
        width 100%
        background $colorBlackBlue
        padding 50px 0

        .section-cli-inner
            max-width 1200px
            margin 0 auto
            position relative
            vertical-align middle
            padding 0 50px
            display flex

            .cli-wrapper
                width 0
                color #fff
                flex 1
                padding 0 40px 0 0

                .cli-title
                    font-size 64px
                    margin-top 0
                    font-weight 400
                    line-height 70px

                .cli-desc
                    font-size 18px
                    line-height 1.5
                    font-weight 400
                    color $colorGreyTrace

                .btn-wrapper
                    width 100%
                    margin-top 50px

                    .btn-codelab,
                    .btn-guide
                        display inline-block
                        margin 6px 8px
                        width 190px
                        height 50px
                        border-radius 5px
                        line-height 50px
                        font-size 18px
                        text-align center

                        &.btn-codelab
                            background $colorWhite
                            box-shadow none
                            color $colorBlackBlue

                        &.btn-guide
                            color $colorWhite
                            background $colorBlackBlue
                            border 1px solid $colorWhite

            .shell-typed-wrapper
                margin-top 10px
                margin-bottom 10px
                text-align center
                width 580px
                min-height  300px
                color $colorWhite

                .typed-title
                    width 100%
                    height 34px
                    line-height 34px
                    padding 5px 0 0 5px
                    border-radius 5px 5px 0 0
                    background -webkit-linear-gradient(top, #f7f7f7 0%,#cfcfcf 7%,#aaaaaa 100%)
                    border-bottom 1px solid #111
                    text-align left

                    .bash-btn
                        display inline-block
                        width 16px
                        height 16px
                        border-radius 50%
                        color #000
                        text-align center
                        line-height 16px
                        margin-right 5px

                        &.bash-close
                            background #f96539

                        &.bash-small
                            background #fbc112

                        &.bash-full
                            background #4caf50

                .typed-content
                    width 100%
                    min-height 550px
                    border-radius 0 0 5px 5px
                    padding 20px
                    text-align left
                    text-shadow none
                    background $colorBlack
                    box-shadow 0 5px 30px rgba(0, 0, 0, .3)
                    font-size 14px
                    font-family $consolas

                    .typed-content-in
                        display inline
                        word-break break-all

                    /deep/ .hljs-built_in
                        color #66d9ef !important

                    /deep/ .hljs-attr
                        color #a7e22e !important

                    /deep/ .typed-cursor
                        animation blink 0.7s infinite

    .section-lavas-app
        width 100%
        background $colorWhite
        position relative

        .section-inner
            max-width 1200px
            margin 0 auto
            position relative
            z-index 0
            // background $colorWhite
            // display flex
            padding 0 50px
            .lavas-app-screen
                position relative
                padding-bottom 50px

            .img
                background-position center
                background-size cover
                height 0
                padding-bottom 71%

            .a
                width 500px
                top 0
                left 0
                position relative
                .img
                    background-image url(//gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/lavas-web/add-app-11a43314.png)
            .b
                width 550px
                left 50%
                top -50px
                transform translateX(-50%)
                position absolute
                .img
                    background-image url(//gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/lavas-web/start-pack-3c91f12d.png)
            .c
                width 600px
                right 0
                top -100px
                position absolute
                .img
                    background-image url(///gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/lavas-web/success-0d6dcfcb.png)

        .content-wrapper
            position relative
            // z-index 20

        .content-inner
            max-width 1200px
            margin 0 auto
            padding 50px 50px 60px

        .lavas-app-title
            font-size 64px
            line-height 1.1
            font-weight 400
            color $colorBlackBlue
            margin-top 0

        .lavas-app-desc
            font-size 18px
            line-height 1.5
            font-weight 400
            color $colorBlackBlue
            width 70%

        .btn-wrapper
            width 100%
            margin-top 50px

            .btn-app
                display inline-block
                margin-left 10px
                width 190px
                height 50px
                border-radius 5px
                line-height 50px
                font-size 18px
                text-align center
                color $colorBlackBlue
                box-shadow none
                margin 0 10px 0 0
                border 1px solid $colorBlackBlue

            a
                text-decoration none
                color $colorBlackBlue



    .section-us-show
        width 100%
        background $colorWhiteDark

        .us-inner-wrapper
            max-width 1100px
            margin 0 auto
            text-align center
            padding 100px 50px

            h1
                font-size 56px
                font-weight 400
                color $colorBlackBlue

            .us-desc
                color $colorGreyLight
                text-align center
                margin 50px 0

                h3
                    font-weight 400
                    font-size 28px

            .us-qrcode
                text-align center
                margin 50px 0

                .img
                    display inline-block
                    width 260px
                    height 260px
                    background-position center
                    background-size cover
                    background-image url(//gss0.baidu.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/lavas-web/qrcode-img-8f7c8330.png)

            .btn-wrapper
                text-align center

                .btn-email,
                .btn-github
                    display inline-block
                    width 190px
                    height 50px
                    border-radius 5px
                    color $colorWhite
                    line-height 50px
                    margin 6px 8px
                    font-size 14px

                .btn-email
                    background $colorRed

                .btn-github
                    background $colorBlue


    .btn__content i
        margin-right 8px
    .btn-wrapper a
        text-decoration none

    h2
        margin-top 50%
        font-size 46px
        font-weight 500

    .error-handle
        margin-top 100px

        a
            display block

@media screen and (max-width: 1160px)
    .index-page-wrapper
        .section-cli
            .section-cli-inner
                .shell-typed-wrapper
                    width 45%
                    min-height 580px

@media screen and (max-width: 991px)
    .index-page-wrapper
        device(0.7)
        .video
            inner(0.7)

        .section-pwa-show
            .pwa-inner-wrapper
                padding 0 20px
                .pwa-video
                    bottom auto
                    top 50%
                    transform translateY(-50%)
                .pwa-content
                    margin-left 230px
                    padding 40px 30px 50px 50px

                    .pwa-show-title
                        // text-align center
                        font-size 50px
                        line-height 58px
                    .pwa-show-desc
                        width 100%
                        font-size 24px
                        line-height 32px
                    .pwa-show-content
                        font-size 18px
                        line-height 26px
                        margin-top 20px

                        ul
                            list-style-type none
                    .btn-wrapper
                        .btn
                            width 160px

        .section-cli
            .section-cli-inner
                display block

                .cli-wrapper
                    width 100%
                    margin-bottom 50px
                    padding-right 0
                    .cli-title
                        font-size 50px
                        line-height 58px

                    .btn-wrapper
                        text-align center

                .shell-typed-wrapper
                    width 580px
                    margin 10px auto

        .section-lavas-app
            .lavas-app-content
                .lavas-app-desc
                    width 100%
            .section-inner
                .lavas-app-screen
                    margin-top 60px
                    .a
                        width 400px
                    .b
                        width 450px
                        top -40px
                    .c
                        width 500px
                        top -80px

@media screen and (max-width: 875px)
    .index-page-wrapper
        .section-feature
            .icon-wrapper
                width 100px
                height 100px
            .feature-title
                font-size 22px


@media screen and (max-width: 767px)
    .index-page-wrapper
        padding-bottom 64px
        .section-slogan
            margin-top -56px
            padding-top 56px

            .slogan-title
                color $colorWhite
                font-size 48px
                margin 100px 0 20px
                text-align center
                span
                    display none

            .slogan-desc
                font-size 20px

        .section-feature
            .section-feature-inner
                display block
            .feature-wrapper
                margin-bottom 40px
            .feature-title
                font-size 20px

        device(0.6)
        .video
            inner(0.6)

        .section-pwa-show
            // width 100%
            padding 50px 0
            .pwa-inner-wrapper
                padding 0

                .pwa-video
                    width 100%
                    position static
                    margin-bottom 30px
                    transform none

                    .device
                        margin 0 auto

                .pwa-content
                    margin-left 0
                    padding 40px 20px
                    border-radius 0
                    .pwa-show-title
                        text-align center
                        font-size 40px
                        line-height 50px

                    .pwa-show-content
                        ul
                            li
                                margin-bottom 5px

                    .btn-wrapper
                        text-align center
                        .btn-pwa,
                        .btn-demo
                            margin 10px !important

        .section-cli
            .section-cli-inner
                padding 0 20px
                .shell-typed-wrapper
                    width 100%

        .section-lavas-app
            .content-inner
                padding 50px 20px
                .btn-app
                    display none !important
            .section-inner
                padding 0 20px
                .lavas-app-screen
                    // height 340px
                    margin-top 40px
                    .a
                        width 65%
                    .b
                        width 70%
                        top -30px
                    .c
                        width 75%
                        top -60px

        .section-us-show
            .us-inner-wrapper
                padding 50px 0

                h1
                    font-size 48px
                h3
                    font-size 20px

                .us-qrcode
                    margin 20px 0


</style>



