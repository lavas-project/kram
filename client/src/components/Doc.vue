<template>
    <div class="doc">
        <sidebar
            ref="sidebarLeft"
            id="sidebar-left"
            v-model="showMobileLeft"
            :media-query="sidebarParams.left.mediaQuery"
        >
            <div class="sidebar-home"
                @click="goHome"
            ><i class="material-icons">home</i>Lavas</div>
            <infinity-menu v-if="isValidCatalog"
                :menu="catalog"
                level="0"
                :collapse="false"
                :current="docKey"
                @select="menuSelected"
            />
        </sidebar>

        <div class="markdown-wrapper">
            <breadcrumbs :doc-key="docKey"
                :catalog="catalog"
            ></breadcrumbs>

            <markdown ref="markdown"
                v-show="isValidHTML"
                :html="html"
                @ready="htmlReady"
            />
            <page-turn
                v-if="isValidCatalog && isValidHTML"
                :catalog="catalog"
                :current="docKey"
            />
        </div>

        <sidebar
            ref="sidebarRight"
            :media-query="sidebarParams.right.mediaQuery"
        >
            <div class="chapters-wrapper"
                v-show="isValidChapters"
                @touchmove.stop
            >
                <infinity-chapters v-if="isValidChapters"
                    :menu="chapters"
                    :props="{name: 'text', key: 'hash'}"
                    :active="activeChapter"
                    @select="chapterSelected"
                    ref="chapter"
                />
            </div>
        </sidebar>

        <back-top></back-top>

        <toast v-model="error.show"
            :message="error.message"
        ></toast>
    </div>
</template>

<style lang="stylus">
    @require '../common/style/variable'

    .doc
        background #fff
        position relative

        .sidebar-home
            display none

        #sidebar-left
            .wd-sidebar-pc
                background #f2f5f6
                padding 0 20px 20px
            .sidebar-main
                padding 0 20px 20px

        .catalog-wrapper
            width 100%
            max-height 100%
            margin 0 auto
            overflow-x hidden
            overflow-y auto
            padding 30px 20px 20px
            box-sizing border-box

        .wd-infinity-menu
            padding-top 40px

            .wd-infinity-menu
                padding-top 0

        .chapters-wrapper
            width auto
            margin 0 auto
            padding 20px
            box-sizing border-box
            background #fff

        .markdown-wrapper
            max-width 1100px
            position relative
            background #fff

    @media screen and (min-width: 1616px)
        .doc
            .markdown-wrapper
                margin 0 300px 0 265px

    @media screen and (max-width: 1615px)
        .doc
            .markdown-wrapper
                margin 0 240px

    @media screen and (max-width: 1024px)
        .doc
            .markdown-wrapper
                margin-right 0

    @media screen and (max-width: 600px)
        .doc

            .markdown-wrapper
                margin 0

            .sidebar-home
                display block
                margin 0 -20px
                height 64px
                line-height 64px
                box-sizing border-box
                padding-left 20px
                color $colorWhite
                font-size 22px
                background $colorPrimaryBlue

                .material-icons
                    vertical-align text-bottom
                    margin-right 10px

</style>

<script>
    import axios from 'axios';
    import {
        traversal,
        bus,
        get,
        isValidArray,
        isValidString
    } from '../common/utils/basic';
    import Markdown from '../widgets/Markdown';
    import InfinityMenu from '../widgets/InfinityMenu';
    import InfinityChapters from '../widgets/InfinityChapters';
    import PageTurn from '../widgets/PageTurn';
    import BackTop from '../widgets/BackTop';
    import Sidebar from '../widgets/sidebar/Sidebar';
    import hashScroller from '../widgets/HashScroller';
    import Toast from '../widgets/Toast';
    import Breadcrumbs from '../widgets/Breadcrumbs';

    const ERROR_SHOW = 'error.show';

    let sidebarParams = {
        left: {
            mediaQuery: [
                {
                    maxWidth: 600,
                    value: {
                        left: 0,
                        right: 40
                    }
                },
                {
                    minWidth: 601,
                    value: {
                        top: 64,
                        bottom: 168,
                        left: 0
                    }
                },
                {
                    minWidth: 601,
                    maxWidth: 1615,
                    value: {
                        width: 250
                    }
                },
                {
                    minWidth: 1616,
                    value: {
                        width: 280
                    }
                }
            ]
        },
        right: {
            mediaQuery: [
                {
                    maxWidth: 1024,
                    value: {
                        display: 'none'
                    }
                },
                {
                    minWidth: 1025,
                    value: {
                        top: 64,
                        right: 0,
                        bottom: 168
                    }
                },
                {
                    maxWidth: 1615,
                    value: {
                        width: 250
                    }
                },
                {
                    minWidth: 1616,
                    value: {
                        left: 1365
                    }
                }
            ]
        }
    }

    export default {
        name: 'doc',
        data() {
            return Object.assign(
                {
                    sidebarParams,
                    toggleMobileLeft: () => {
                        this.showMobileLeft = !this.showMobileLeft;
                    },
                    error: {
                        message: '',
                        show: false
                    }
                },
                this.initData()
            );
        },
        computed: {
            page() {
                return this.$route.name;
            },
            isValidCatalog() {
                return isValidArray(this.catalog);
            },
            isValidHTML() {
                return isValidString(this.html);
            },
            isValidChapters() {
                return isValidArray(this.chapters);
            }
        },
        methods: {
            initData(to) {
                let docKey = (to || this.$route).params.path;

                return {
                    catalog: null,
                    chapters: null,
                    html: '',
                    showMobileLeft: false,
                    docKey: docKey,
                    activeChapter: ''
                };
            },
            async getCatalog() {
                try {
                    let result = await axios('/api/doc/getCatalog', {
                        method: 'get',
                        params: {
                            page: this.page
                        }
                    });

                    if (result.status === 200 && result.data.status === 0) {
                        let data = result.data.data;
                        this.catalog = data.catalog;
                    }
                    else {

                    }
                }
                catch (e) {

                }
            },
            async getDoc(docKey) {
                this.$loading.start();

                try {
                    let result = await axios('/api/doc/getDoc', {
                        method: 'get',
                        params: {
                            key: docKey,
                            page: this.page
                        }
                    });

                    if (result.status === 200 && result.data.status === 0) {
                        let {key, doc: {chapters, html}} = result.data.data;
                        this.chapters = chapters;
                        this.html = html;
                        this.docKey = key;
                    }
                    else {
                        this.error.message = '糟糕！找不到相应的文档...';
                        this.error.show = true;
                    }
                }
                catch (e) {
                    this.error.message = '糟糕！网络发生了点错误...';
                    this.error.show = true;
                }

                this.$loading.finish();
            },
            htmlReady() {
                setTimeout(() => {
                    hashScroller.calc().scrollTo(this.$route.hash);
                    this.$refs.sidebarLeft && this.$refs.sidebarLeft.update();
                    this.$refs.sidebarRight && this.$refs.sidebarRight.update();
                });
            },
            goHome() {
                this.$router.push('/');
                this.showMobileLeft = false;
            },
            menuSelected(key) {
                this.showMobileLeft = false;
            },
            chapterSelected(key) {
                hashScroller.scrollTo(key);
            },
            onScroll(key) {
                this.activeChapter = key;
            }
        },
        watch: {
            page(val) {
                this.getCatalog();
                this.getDoc(this.docKey);
            },
            chapters(val) {
                let title = this.$route.meta.title;
                let text = get(val, 0, 'text');

                if (text) {
                    title = text + ' | ' + title;
                }

                document.title = title;
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => Object.assign(vm, vm.initData(to)));
        },
        beforeRouteUpdate(to, from, next) {
            if (from.path === to.path) {
                next();
            }
            else {
                this.getDoc(to.params.path).then(next);
            }
        },
        beforeRouteLeave(to, from, next) {
            this.docKey = to.params.path;
            next();
        },
        created() {
            this.getCatalog();
            this.getDoc(this.docKey);
        },
        mounted() {
            bus.$on('sidebar-click', this.toggleMobileLeft);

            hashScroller
                .params({
                    selector: '.md-heading',
                    root: this.$refs.markdown.$el,
                    offsetTop: -22,
                    props: {
                        id: ['dataset', 'id'],
                        hash: ['firstChild', 'hash']
                    }
                })
                .listen(this.onScroll.bind(this))
                .mount();
        },
        beforeDestroy() {
            bus.$off('sidebar-click', this.toggleMobileLeft);
            hashScroller.unmount();
        },
        components: {
            InfinityMenu,
            InfinityChapters,
            Markdown,
            PageTurn,
            BackTop,
            Sidebar,
            Toast,
            Breadcrumbs
        }
    };
</script>
