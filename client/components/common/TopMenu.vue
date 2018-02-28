<template>
    <div  v-if="showHeader" id="header">
        <v-toolbar>
            <v-toolbar-side-icon
                :class="showSidebarIcon ? 'wd-xs-show' : 'hide'"
                @click.native="sidebarClick"
            ></v-toolbar-side-icon>
            <v-toolbar-title
                :class="{
                    'show-logo': showLogo
                }"
            >
                <router-link to="/">LAVAS</router-link>
            </v-toolbar-title>
            <v-toolbar-items class="navi">
                <v-list class="pc-tab">
                    <v-list-tile
                        v-for="(item, i) in tabs"
                        :key="i"
                        :to="Array.isArray(item.route) ? item.route[0] : item.route"
                        :class="{
                            'list-item': true,
                            'list-item-active': activeIndex === i
                        }"
                        ripple
                    >
                        <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <form @submit.prevent="goSearch()"
                v-if="showSearch"
            >
                <input class="search-input"
                    v-model="inputQuery"
                    type="search"
                    autocomplete="off"
                    placeholder="请输入搜索标题"
                    autocapitalize="off"
                    ref="menuSearchInput"
                />
            </form>
            <v-btn icon @click="goSearch()"
                v-if="showSearch"
            >
                <v-icon>search</v-icon>
            </v-btn>
            <v-toolbar-items class="wd-xs-show">
                <v-btn icon @click.stop.prevent="clickMobileMenu">
                    <v-icon color="#fff">more_vert</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <div :class="{
                show: showSmallMenu
            }"
            class="header-small-menu-list"
            @click.stop.prevent="clickMobileMenu"
            @touchmove.prevent
        >
            <v-list class="ui-dep-5">
                <v-list-tile
                    v-for="(item, i) in tabs"
                    :key="i"
                    :to="Array.isArray(item.route) ? item.route[0] : item.route"
                    :class="{
                        'list-item': true,
                        'list-item-active': activeIndex === i
                    }"
                    ripple
                >
                    <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex';

export default {
    name: 'top-menu',
    data() {
        return {
            showSmallMenu: false,
            inputQuery: ''
        };
    },
    computed: {
        ...mapState('search', [
            'query'
        ]),
        ...mapGetters('app-shell', [
            'tabs',
            'showHeader',
            'showSidebarIcon',
            'showLogo',
            'showSearch',
            'activeIndex'
        ])
    },
    watch: {
        query(val) {
            this.inputQuery = val;
        }
    },
    methods: {
        ...mapActions('app-shell', [
            'setSidebarStatus'
        ]),
        ...mapActions('search', [
            'getSearchResult',
            'clearSearchData'
        ]),
        sidebarClick() {
            this.setSidebarStatus(true);
        },
        async goSearch() {
            // 失去焦点
            this.$refs.menuSearchInput.$el
            && this.$refs.menuSearchInput.$el.blur();

            // 查结果
            if (this.inputQuery) {
                this.getSearchResult({query: this.inputQuery});
            }
            else {
                this.clearSearchData();
            }

            // 跳转
            this.$router.push({path: '/search'});
        },
        clickMobileMenu() {
            this.showSmallMenu = !this.showSmallMenu;
        }
    }
};
</script>


<style lang="stylus">

@import '~@/assets/style/variable';

$topMenuColor = #1976d2

#header
    position fixed
    top 0
    left 0
    z-index 120
    background $topMenuColor
    width 100%
    box-sizing border-box
    height 64px
    color #fff
    font-size 16px
    font-family $roboto

    .toolbar
        box-shadow none
        padding-right 10px
        background none !important

    .navi
        flex 1
        min-width 570px
        ul.pc-tab
            height 64px
            line-height 64px
            background $colorPrimaryBlue
            padding 0
            margin 0
            white-space nowrap

            li.list-item
                height 100%
                line-height 100%
                vertical-align top
                display inline-block
                background $colorPrimaryBlue
                color #fff

                .list__tile
                    display inline-block
                    height 64px
                    line-height 64px

                    .list__tile__title
                        color #fff
                        height 64px
                        line-height 64px

                &.list-item-active
                    border-bottom solid 3px #fff
                    box-sizing border-box

    .btn
        color #fff
        &.btn--icon
            color #fff
            width 36px
            height 36px
            .btn__content
                line-height 36px
    form
        flex 1
        text-align right
        .search-input
            min-width 200px
            height 36px
            line-height 36px
            vertical-align middle
            border-radius 2px
            background #fff
            opacity 0.5
            color #333
            padding 0 10px
            &:focus
                outline none
                width 50%
                transition width .2s


    .toolbar__content
        height 64px !important
        line-height 64px !important

    .toolbar__title
        padding-right 20px

        a
            color #fff
            text-decoration none
            display block
            width 56px
            height 56px
            line-height 56px
            border-radius 26px
            font-size 14px
            background #0000002a
            font-weight 600
            text-align center

    .header-small-menu-list
        display none

@media screen and (max-width: 1050px)
    #header
        form
            .search-input
                width 60%
                min-width 60%
        .navi
            ul.pc-tab
                li.list-item
                    .list__tile
                        font-size 14px

@media screen and (max-width: 920px)
    #header
        form
            display none

/* for mobile */
@media screen and (max-width: 767px)
    #header
        padding 0 0
        height 56px

        .title
            left 10px

        .toolbar__title
            display none

            &.show-logo
                display block

            a
                width 46px
                height 46px
                line-height 46px
                border-radius 23px
                font-size 12px

        .toolbar__items
            margin-right 0

        .btn--icon
            color #fff
            width 36px
            height 36px

        .navi
            display none
            float right
            width 600px
        .btn
            color #fff

        form
            display none

        .toolbar__content
            height 56px !important
            line-height 56px !important

        .header-small-menu-list
            display block
            position fixed !important
            top 0
            left 0
            right 0
            bottom 0
            padding-top 56px
            margin-top 0
            background transparent
            transform scaleY(0)
            transform-origin 50% 56px
            transition transform .2s ease
            &.show
                transform scaleY(1)

            .list-item
                .primary--text
                    color $colorBlack !important

            .list-item-active
                a
                    .list__tile__title
                        color $colorPrimaryBlue

@media screen and (min-width: 768px)
    #header
        .spacer
            display none

</style>
