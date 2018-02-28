<template>
    <div class="doc-layout guide">
        <sidebar
            id="sidebar-left"
            v-model="mobileSidebarStatus"
        >
            <div class="sidebar-home"
                @click="goHome"
            ><i class="material-icons">home</i>Lavas</div>
            <div class="version-select-wrapper">
                <div class="version-select-label">版本</div>
                <div class="version-select">
                    <v-select
                        :style="{'z-index': 99999}"
                        v-if="versions && versions.length"
                        :items="versions"
                        v-model="version"
                        single-line
                        label=""
                        item-text="name"
                        item-value="url"
                        bottom
                        dark
                    ></v-select>
                </div>
            </div>
            <div class="menu-wrapper">
                <infinity-menu v-if="isValidMenu"
                    :menu="menu"
                    level="0"
                    :collapse="false"
                    :current="url"
                />
            </div>
        </sidebar>

        <div class="markdown-wrapper" ref="markdownWrapper">
            <div class="migrate-toast" v-if="isOldVersion">您正在阅读旧版 Lavas 的文档，请查看 <router-link :to="latestVersion.url">Lavas {{ latestVersion.name }}</router-link> 获取新版资讯</div>
            <markdown
                v-show="isValidHTML"
                :html="html"
                @ready="htmlReady"
                class="ui-dep-1"
            >
                <breadcrumbs
                    slot="header"
                    :current="current"
                    :menu="menu"
                ></breadcrumbs>
                <page-turn
                    slot="footer"
                    v-if="isValidMenu && isValidHTML"
                    :menu="menu"
                    :current="current"
                />
            </markdown>
        </div>

        <sidebar
            id="sidebar-right"
        >
            <div class="sidebar-right-wrapper">
                <div class="sidebar-right-inner">
                    <div class="chapter-wrapper ui-dep-1">
                        <infinity-chapters v-if="isValidChapters"
                            :menu="chapters"
                            :props="{name: 'text', key: 'hash'}"
                            :active="activeChapter"
                            @select="chapterSelected"
                        /></infinity-chapters>
                    </div>
                </div>
            </div>
        </sidebar>

        <back-top></back-top>

        <toast v-model="error.show"
            :message="error.message"
        ></toast>
    </div>
</template>

<style lang="stylus">
@require '~@/assets/style/variable'
// 移到 global.styl
// @require '~@/assets/style/doc-layout'

</style>

<script>
    import {mapGetters, mapState, mapActions} from 'vuex';
    // import axios from 'axios';
    import {
        traversal,
        // bus,
        get,
        isValidArray,
        isValidString
    } from '@/assets/common/utils/basic';
    import Markdown from '@/components/document/Markdown';
    import InfinityMenu from '@/components/document/InfinityMenu';
    import InfinityChapters from '@/components/document/InfinityChapters';
    import PageTurn from '@/components/document/PageTurn';
    import BackTop from '@/components/common/BackTop';
    import Sidebar from '@/components/common/sidebar/Sidebar';
    import HashScroller from '@/components/common/HashScroller';
    import Toast from '@/components/common/Toast';
    import Breadcrumbs from '@/components/document/Breadcrumbs';

    const ERROR_SHOW = 'error.show';

    export default {
        name: 'guide',
        metaInfo() {
            return {
                title: this.detail.info && this.detail.info.title,
                titleTemplate: '%s | Lavas 教程 | Lavas',
                meta: [
                    {
                        name: 'keywords',
                        content: this.detail.info && this.detail.info.keywords || 'lavas,pwa,guide'
                    },
                    {
                        name: 'description',
                        content: this.detail.info && this.detail.info.description || 'lavas 相关知识介绍'
                    }
                ]
            };
        },
        data() {
            return {
                activeChapter: '',
                hashScroller: null
            };
        },
        async asyncData({store, route}) {
            store.dispatch('app-shell/setPath', route.path);

            await Promise.all([
                store.dispatch('guide/getMenu', {url: route.path}),
                store.dispatch('guide/getDetail', {url: route.path}),
                store.dispatch('guide/getVersions')
            ]);
        },
        computed: {
            ...mapState('guide', [
                'menu',
                'details',
                'mapper',
                'detail',
                'error',
                'versions'
            ]),
            ...mapState('app-shell', [
                'sidebarStatus'
            ]),
            mobileSidebarStatus: {
                set(status) {
                    this.$store.dispatch('app-shell/setSidebarStatus', status);
                },
                get() {
                    return this.sidebarStatus;
                }
            },
            version: {
                set(val) {
                    this.$router.push(val);
                },
                get() {
                    if (!this.versions || !this.versions.length) {
                        return null;
                    }

                    if (!this.detail) {
                        return null;
                    }

                    for (let i = 0; i < this.versions.length; i++) {
                        let url = this.versions[i].url;
                        if (this.url.indexOf(url) > -1) {
                            return url;
                        }
                    }

                    return this.versions[0].url;
                }
            },
            current() {
                return this.detail.path;
            },
            isOldVersion() {
                if (!this.detail || !this.detail.url || !this.latestVersion) {
                    return false;
                }

                return this.detail.url.indexOf(this.latestVersion.url) === -1;

            },
            latestVersion() {
                return this.versions[0];
            },
            hash() {
                return this.$route.hash;
            },
            url() {
                return this.mapper[this.$route.path] || this.$route.path;
            },
            html() {
                return this.detail && this.detail.html || '';
            },
            chapters() {
                let chapters = this.detail && this.detail.chapters || [];
                if (chapters.length === 1 && chapters[0].children) {
                    return chapters[0].children;
                }

                return chapters;
            },
            isValidMenu() {
                return isValidArray(this.menu);
            },
            isValidHTML() {
                return isValidString(this.html);
            },
            isValidChapters() {
                return isValidArray(this.chapters);
            }
        },
        watch: {
            hash(val) {
                this.hashScroller && this.hashScroller.scrollTo(val);
            }
        },
        methods: {
            htmlReady() {
                setTimeout(() => {
                    this.hashScroller && this.hashScroller.calc().scrollTo(this.$route.hash);
                });
            },
            goHome() {
                this.$router.push('/');
            },
            chapterSelected(key) {
                this.mobileSidebarStatus = false;
                this.$router.replace(this.$route.path + key);
            },
            onScroll(key) {
                this.activeChapter = key;
            }
        },
        beforeRouteUpdate(to, from, next) {
            if (from.path === to.path) {
                next();
            }
            else {
                this.activeChapter = '';
                this.mobileSidebarStatus = false;
                this.$loading.start();

                if (to.path.indexOf(this.version) === -1) {
                    this.$store.dispatch('guide/getMenu', {url: to.path});
                }

                this.$store.dispatch('guide/getDetail', {url: to.path})
                .then(() => {
                    this.$loading.finish();
                    next();
                });
            }
        },
        beforeRouteLeave(to, from, next) {
            this.mobileSidebarStatus = false;
            next();
        },
        mounted() {
            this.hashScroller = new HashScroller({
                    selector: '[data-hash]',
                    root: this.$refs.markdownWrapper.$el,
                    offsetTop: -22,
                    props: {
                        hash: ['dataset', 'hash']
                    }
                })
                .listen(this.onScroll.bind(this))
                .mount();
        },
        beforeDestroy() {
            this.hashScroller.unmount();
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
