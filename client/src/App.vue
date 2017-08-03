<template>
    <div id="app">
        <v-toolbar id="header">
            <v-toolbar-side-icon light
                :class="sidebarClass"
                @click.native="sidebarClick"
            ></v-toolbar-side-icon>
            <v-toolbar-title>
                <router-link to="/">Lavas</router-link>
            </v-toolbar-title>
            <v-toolbar-items class="navi">
                <v-tabs id="tabs" centered grow
                    ref="appTabs"
                    v-model="activeTab"
                >
                    <v-tabs-bar slot="activators">
                        <v-tabs-slider></v-tabs-slider>
                        <v-tabs-item
                            v-for="(item, i) in tabData"
                            :key="i"
                            :to="item.route"
                            router
                            ripple
                        >
                            {{ item.text }}
                        </v-tabs-item>
                    </v-tabs-bar>
                </v-tabs>
            </v-toolbar-items>
            <v-toolbar-items class="small-screen">
                <v-menu :nudge-top="60" :nodge-right="10" transition="v-scale-transition">
                    <v-btn light icon slot="activator">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-item v-for="item in tabData" :key="item">
                            <v-list-tile
                                router
                                :href="item.route"
                                ripple
                            >
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <router-view id="container"></router-view>
        <div id="footer">
            <div class="footer-box">
                <div class="link-wrapper">
                    <div class="link-box">
                        <div class="title">联系方式</div>
                        <p class="links">
                            <a href="https://www.github.com/lavas-project" target="_blank"><i v-html="github"></i>lavas-project</a>
                            <a href="mailto:lavas@baidu.com"><i class="material-icons">mail_outline</i>lavas@baidu.com</a>
                            <span>
                                <i v-html="qqGroup"></i>QQ 群号 655433298</span>
                        </p>
                    </div>
                    <div class="link-box">
                        <div class="title">其他项目</div>
                        <p class="links">
                            <a href="https://www.mipengine.org/" target="_blank">MIP</a>
                            <a href="https://ecomfe.github.io/san/" target="_blank">San</a>
                            <a href="http://fis.baidu.com/" target="_blank">FIS</a>
                        </p>
                    </div>
                    <div class="link-box">
                        <div class="title">友情链接</div>
                        <p class="links">
                            <a href="https://developers.google.com/web/fundamentals" target="_blank">Google Developer</a>
                            <a href="https://cn.vuejs.org" target="_blank">Vue</a>
                            <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a>
                        </p>
                    </div>
                </div>
                <p class="copyright">
                    Copyright © {{ year }} &nbsp; &nbsp;Lavas Project
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {bus} from './common/utils/basic';
    import {routes} from './router';
    import github from './assets/svg/github.xml';
    import qqGroup from './assets/svg/qq-group.xml';

    export default {
        name: 'app',
        data() {
            return {
                year: (new Date()).getFullYear(),
                tabData: routes.map(
                    ({name, meta}) => Object.assign({name}, meta)
                ),
                activeTab: this.$route.path === '/' ? '/' : this.rootPath,
                github,
                qqGroup
            };
        },
        computed: {
            sidebarClass() {
                if (this.$route.path === '/') {
                    return {hide: true};
                }
                let match = this.$route.path.match(/\/(.*?)(\/|$)/);
                if (match && match.length) {
                    let path = `/${match[1]}`;
                    let result = this.tabData.some(d => d.route === path && d.sidebar);
                    if (result) {
                        return {'small-screen': true};
                    }
                }

                return {hide: true};
            },
            path() {
                return this.$route.path;
            },
            rootPath() {
                return this.path.split('/').slice(0, 2).join('/');
            }
        },
        watch: {
            path(val) {
                this.$nextTick(() => {
                    this.$refs.appTabs.tabClick(val === '/' ? '/' : this.rootPath);
                });
            }
        },
        methods: {
            sidebarClick() {
                bus.$emit('sidebar-click');
            }
        }
    };
</script>
<style lang="stylus">
    @require './common/style/common'

    #app
        height 100%

    #header
        position fixed
        top 0
        left 0
        z-index 120
        background $colorPrimaryBlue
        // background #fff
        width 100%
        padding 0 20px 0 0
        box-sizing border-box
        height 64px

        &.toolbar
            box-shadow none
        .toolbar__title
            padding-left 36px
            color #fff
            font-size 22px
            font-weight 500
            line-height 64px
            a
                color #fff

        .tabs__container
            background rgb(40, 116, 240)
            color #fff
            li.tabs__slider
                height 3px
                background #fff

        .menu
            display none
        .navi
            float right
            width 400px

        /* 自定义 component 样式 */
        .tabs__bar
            height 64px
            background #fff
            .tabs__item
                font-size 16px
                color #fff


    #container
        min-height 100%
        margin-top 64px
        overflow hidden

    #footer
        background $colorFooterDark
        color $colorWhite
        padding-top 25px
        text-align center
        z-index 1
        // font-family $consolas
        .footer-box
            max-width 1200px
            margin 0 auto
        .link-wrapper
            display flex
        .link-box
            border-top 1px solid #707375
            flex 1
            // display inline-block
            font-size 13px
            // padding-bottom 20px
            margin 0 20px
            padding-top 10px
            .title
                text-align left
                margin-bottom 5px
                font-size 14px
                // border-left 2px solid $colorWhite
                // padding-left 6px
                line-height 1.2
            .links
                text-align left
                a,
                span
                    color #979797
                    display block
                    line-height 1.5
                    position relative
                    img
                        size 70px 70px
                        vertical-align text-top
                        margin-left -2px
                        // position absolute
                        // top 3px
                        // left 26px

            .icon-svg,
            .material-icons
                size 16px 16px
                vertical-align middle
                font-size 16px
                margin-top -3px
                margin-right 10px
            .icon-svg
                fill #979797

        .copyright
            font-size 13px
            line-height 24px
            padding 15px 0

    .large-screen
        display block
    .small-screen
        display none
    /* for mobile */
    @media screen and (max-width: 600px)
        .large-screen
            display none
        .small-screen
            display block
        #header
            padding 0 0
            height 52px
            .title
                left 10px
            .toolbar__title
                padding-left 10px
                line-height 52px
            .toolbar__items
                margin-right 0
            .menu
                display block
                padding 2px 8px
                float right
                .btn
                    color #fff
                .list__tile
                    color $colorPrimaryBlue
            .navi
                display none

        #container
            margin-top 52px

        #footer
            padding 5px 0
            text-align center
            .link-wrapper
                display none

</style>
