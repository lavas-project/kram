<template>
    <div class="app-search-page-wrapper">
        <div class="app-search-page"
            :class="initSearchStyle"
        >
            <div class="mobile-header">
                <v-btn light icon class="search-btn" @click.native="$router.go(-1)">
                    <v-icon class="search-icon" color="#fff">arrow_back</v-icon>
                </v-btn>
                <form @submit.prevent="getSearchResult({query: inputQuery})">
                    <input class="search-input"
                        v-model="inputQuery"
                        type="search"
                        autocomplete="off"
                        placeholder="请输入搜索标题"
                        autocapitalize="off"
                    />
                </form>
                <v-btn light icon class="search-btn" @click.native="clearInputQuery()">
                    <v-icon class="search-icon" color="#fff">close</v-icon>
                </v-btn>
            </div>
            <div class="search-box ui-dep-1">
                <div class="search-input">
                    <form @submit.prevent="getSearchResult({query: inputQuery})">
                        <input type="search"
                            autocomplete="off"
                            placeholder="请输入搜索标题"
                            autocapitalize="off"
                            v-model="inputQuery"
                            ref="searchBoxInput"
                        >
                    </form>
                </div>

                <v-btn color="primary"
                    class="search-button"
                    @click="getSearchResult({query: inputQuery})"
                >搜索一下</v-btn>

            </div>
            <div class="search-list-wrapper ui-dep-1">
                <div class="list-controller"
                    v-if="status === 'free'"
                >
                    <div class="list-filter-wrapper"
                        v-if="scopes && scopes.length > 1"
                    >
                        <v-select
                            v-bind:items="scopes"
                            label="全部"
                            v-model="scope"
                            single-line
                            bottom
                        ></v-select>
                    </div>
                    <div class="list-statistic">共 <span class="list-number">{{ displaySearchResult.length }}</span> 条结果</div>
                </div>

                <div class="search-list" ref="searchList" v-if="status === 'free'">
                    <router-link v-for="(item, i) in displaySearchResult"
                        :key="i"
                        class="search-item"
                        :to="item.url"
                        v-ripple
                    >
                        <h4 class="search-item-title" v-html="item.title"></h4>
                        <p class="search-item-desc" v-html="item.description"></p>
                        <p class="search-item-menu" v-html="item.breadcrumbs"></p>
                    </router-link>
                    <div class="search-no-result" v-if="displaySearchResult.length === 0">
                        <i class="fa fa-frown-o" aria-hidden="true"></i>
                        <p>糟糕，找不到相应的文档...</p>
                    </div>
                </div>

                <div class="search-loading" v-else>
                    <div id="boostrap-splash">
                        <div id="boostrap-splash-bound-1"></div>
                        <div id="boostrap-splash-bound-2"></div>
                    </div>
                </div>
            </div>
            <back-top></back-top>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import BackTop from '@/components/common/BackTop';

function getLabel(menu) {
    // lavas app
    if (/^(lavas )?app/i.test(menu)) {
        return 'Lavas App';
    }

    // codelab
    if (/^CODELAB/i.test(menu)) {
        return 'Codelab';
    }
    // pwa
    if (/^pwa/i.test(menu)) {
        return 'PWA';
    }

    // guide
    let match = menu.match(/\/v(\d+)/);

    if (match) {
        return `Lavas ${match[1]}`;
    }

    return '';
}

// highlight the query
function highlight(item, query) {
    let key = query.replace(/[^0-9a-zA-Z_ \u0391-\uFFE5+]/g, '')
    .split(/\s+/)
    .filter(key => key !== '')
    // .map(key => encodeURI(key))
    .join('|');

    let regex = new RegExp(key, 'ig');

    let label = getLabel(item.menu);

    let bg = 'bg-' + label.toLowerCase().replace(/\s+/g, '-');

    return Object.assign({}, item, {
        label: label,
        title: `<span class="search-label ${bg}">${label}</span>`
            + (item.title || '').replace(regex, str => highlightSpan(str)),
        description: (item.description || '').replace(regex, str => highlightSpan(str)),
        breadcrumbs: item.breadcrumbs.split('/').join(' / ').replace(regex, str => highlightSpan(str))
    });
    // return data;
}

function highlightSpan(str) {
    return `<span class="highlight-query">${str}</span>`;
}

export default {
    metaInfo: {
        title: '搜索',
        titleTemplate: '%s | Lavas',
        meta: [
            {
                name: 'keywords',
                content: 'lavas,pwa,search'
            },
            {
                name: 'description',
                content: 'lavas 搜索'
            }
        ]
    },
    asyncData({store, route}) {
        store.dispatch('app-shell/setPath', route.path);
    },
    data() {
        return {
            inputQuery: '',
            initSearchStyle: {},
            scope: ''
        }
    },
    computed: {
        ...mapState('search', [
            'query',
            'searchResult',
            'status'
        ]),
        scopes() {
            let scopes = Array.from(new Set(
                this.searchResult.map(result => result.menu)
            ))
            .map(scope => {
                let label = getLabel(scope);

                if (scope.indexOf('CODELAB') === 0) {
                    return {
                        text: label,
                        value: 'CODELAB'
                    };
                }

                return {
                    text: label,
                    value: scope
                }
            });

            return [
                {
                    text: '全部',
                    value: ''
                },
                ...scopes
            ];
        },

        displaySearchResult() {
            let results;

            if (!this.scope) {
                results = this.searchResult;
            }
            else {
                results = this.searchResult.filter(result => {
                    return result.menu.indexOf(this.scope) === 0;
                });
            }

            return results.map(result => highlight(result, this.query));
        }
    },
    watch: {
        query() {
            this.scope = '';
            this.initSearchStyle = ['show'];
        }
    },
    methods: {
        ...mapActions('search', [
            'getSearchResult',
            'setSearchQuery'
        ]),
        clearInputQuery() {
            this.inputQuery = '';
            this.setSearchQuery('');
        }
    },
    beforeRouteLeave(to, from, next) {
        if (!this.searchResult.length) {
            this.setSearchQuery('');
        }

        next();
    },
    mounted() {
        // 为了消抖 因此在初始化的时候再去显示
        if (this.query) {
            this.inputQuery = this.query;
            this.initSearchStyle = ['show'];
        }
        else {
            this.initSearchStyle = ['show', 'single-bar'];
        }
    },
    components: {
        BackTop
    }
};
</script>

<style lang="stylus" scoped>

@import '~@/assets/style/variable'

@keyframes search-boostrap-splash
    0%,
    100%
        transform scale(0.0)

    50%
        transform scale(1.0)

.app-search-page-wrapper
    background $colorGreyTrace
    overflow hidden

.app-search-page
    max-width 1000px
    margin 0 auto
    display none

    .mobile-header
        display none

    .search-box
        display flex
        max-width 700px
        margin 0 auto
        margin-top 50px
        font-size 18px
        // border 1px solid $colorBlue
        margin-bottom 30px

        .search-input
            flex 1
            background $colorWhite
            height 48px

            input
                height 48px
                width 100%
                outline none
                padding 0 12px

        .search-button
            margin 0
            font-size 18px
            height 48px
            padding 0 20px
            box-shadow none
            border-radius 0

    .search-list-wrapper
        background $colorWhite
        min-height 100px
        font-size 15px
        margin-bottom 50px

        .list-controller
            border-bottom 1px solid $colorBlue
            padding 0 50px
            height 70px


            .list-filter-wrapper
                width 180px
                display inline-block
                .input-group
                    padding-top 16px
                    /deep/.input-group__details
                        min-height 2px

            .list-statistic
                float right
                line-height 70px
                font-size 16px
                .list-number
                    color $colorBlue

        .search-list
            padding 0 50px 50px
            // background #0f0
            /deep/ .highlight-query
                background #fff59d

        .search-item
            border-bottom 1px solid $colorGreyTrace
            padding 15px 0
            display block
            text-decoration none
            position relative
            color $colorBlue
            &:last-child
                border none

            &-title
                font-weight 500
                line-height 26px
                padding 5px 0
                color $colorBlue

                /deep/ .search-label
                    display inline-block
                    margin-right 10px
                    background $colorGreyTrace
                    padding 0 6px
                    font-size 12px
                    line-height 24px
                    border-radius 5px
                    color $colorWhite
                /deep/ .bg-pwa
                    background #7986cb
                /deep/ .bg-codelab
                    background #00897b
                /deep/ .bg-lavas-1
                    background #81d4fa
                /deep/ .bg-lavas-2
                    background #1e88e5
                /deep/ .bg-lavas-app
                    background #00acc1

            &-desc
                margin 0
                color $colorBlack
                // line-height 1.5
                // font-size 15px

            &-menu
                margin 5px 0 0
                font-size 14px
                color $colorGreyLight

        .search-no-result
            height 330px
            text-align center
            i
                margin-top 100px
                font-size 64px
                color $colorBlue
                font-weight 500
            p
                font-size 22px
                margin-top 20px
                color $colorGreyLight
                font-weight 500

        .search-loading
            height 400px
            position relative

            #boostrap-splash
                width 120px
                height 120px
                position absolute
                top 50%
                left 50%
                margin -60px 0 0 -60px


            #boostrap-splash-bound-1,
            #boostrap-splash-bound-2
                width 100%
                height 100%
                border-radius 50%
                background-color #1976d2
                opacity 0.6
                position absolute
                top 0
                left 0
                animation search-boostrap-splash 2.0s infinite ease-in-out


            #boostrap-splash-bound-2
                animation-delay -1.0s

    &.show
        display block

    &.single-bar
        position relative
        .search-list-wrapper
            display none
        .search-box
            margin-top 35vh

@media screen and (max-width: 767px)
    .app-search-page
        .mobile-header
            position fixed
            top 0
            left 0
            z-index 99999
            display block
            width 100%
            margin 0
            background $colorPrimaryBlue
            display flex
            align-items center
            height 56px

            form
                flex 1

            .search-input
                width 100%
                outline none
                font-size 16px
                height 36px
                text-indent 8px
                background #fff
                border-radius 3px

            .search-content
                // padding 5px
                width 90%
            .search-btn
                .icon
                    color #fff !important

        .search-box
            display none
        .search-list-wrapper
            box-shadow none

            .list-controller,
            .search-list
                padding-left 30px
                padding-right 30px

</style>
