<template>
    <div class="md-content" ref="contentRoot">
        <slot name="header"></slot>
        <div v-html="html"
            class="markdown-body"
            ref="markdown"
        ></div>
        <light-box :selector="$refs.contentRoot" v-if="isReady"></light-box>
        <slot name="footer"></slot>
    </div>
</template>

<style lang="stylus">
// @require '~@/assets/style/markdown'
@require '~@/assets/style/variable'
// @require '~@/components/common/ripple.styl'

.md-content
    padding 0 50px 50px 50px

    .page-turn
        margin-top 50px
        .material-icons
            color $colorBlue

.markdown-body

    &:after
        display none

    h2, h3, h4, h4, h6
        position relative
        padding-bottom 0

        &:hover
            .heading-link
                display block
        // a[target="_blank"]
        //     .fa
        //         display none
    h1
        border-bottom 1px solid #eee !important
        padding-bottom 15px

        & + blockquote
            margin-top -20px
            margin-bottom 40px

    .heading-link
        color $colorBlack
        text-decoration none
        display none
        position absolute
        top 50%
        transform translateY(-50%)
        left -25px
        padding-right 10px

        .fa
            font-size 16px
            // display none
            color $colorBlack
            margin-left 5px

    a[data-path]
        color #0366d6

        &:hover
            cursor pointer
            text-decoration underline

    a
        .material-icons
            vertical-align middle
            font-size 1em
            margin-left 2px
            margin-top -2px
            user-select none
    th, td
        min-width 100px
        font-size 14px
    td
        word-wrap break-word

    img
        display block
        cursor zoom-in

    blockquote
        background #f0f5f6
        padding 12px !important
        &.warn,
        &.error
        &.info,
        &.success
            font-weight 500
            color $colorBlack
            background #f0f5f6 !important

            & > p:first-child > strong:only-child
                font-size 1.3em

        &.warn
            border-left-color $colorOrange
        &.error
            border-left-color $colorPrimaryRed
        &.info
            border-left-color $colorPrimaryBlue
        &.success
            border-left-color $coloePrimaryGreen

    .md-related-wrapper
        margin-top 120px

    .md-related
        font-size 14px
        color $colorGreyTiny
        // transition color .3s
        display inline-block
        padding 5px 15px
        // margin-right 20px
        position relative
        overflow hidden
        border-radius 3px
        text-decoration none !important

        .material-icons
            font-size 1em
            margin-right 5px
            margin-left 0

        &.to-edit
            background $colorPrimaryBlue
            color $colorWhite

        &.to-feedback
            background $colorGreyTiny
            color $colorBlack
            margin-left 5px
            .material-icons
                color $colorBlack

        &:active
            box-shadow 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)

        &.like-box
            background $colorWhiteDark
            float right
            color $colorBlack
            user-select none

            &:active
                box-shadow none
            span
                color $colorGreyTiny
                display inline-block
                padding 0 10px
                margin-left 10px
                cursor pointer
                transform scale(1.2)
                .material-icons
                    color $colorGrey
                &.like.clicked
                    .material-icons
                        color $colorRed
                &.unlike.clicked
                    .material-icons
                        color $colorBlue

            &.unclick
                span
                    &:hover
                        transform-origin 50% 50%
                        transform scale(1.4)
                        .material-icons
                            color $colorGrey

@media screen and (max-width: 900px)
    .markdown-body
        .md-related.like-box
            display block
            margin 20px auto
            float none

@media screen and (max-width: 600px)
    .md-content
        padding 0 25px 50px
    // .md-img
    //     min-width 50%
    //     margin-right 0

    .to-github
        display none
</style>

<script>
    import {imageLoader} from '@/assets/common/utils/basic';
    import {scrollTop} from '@/components/common/easeScroll';
    import LightBox from '@/components/document/lightbox';
    // import ripple from '@/components/common/Ripple';
    import axios from 'axios';

    export default {
        name: 'markdown',
        props: ['html', 'docPath'],
        data() {
            return {
                markdown: null,
                isMounted: false
            };
        },
        computed: {
            isReady() {
                return this.isMounted
                    && !!this.html
                    && this.html;
            }
        },
        watch: {
            isReady() {
                this.$nextTick(async () => {
                    this.mountLike();
                    await this.loadImages();
                    this.$emit('ready');
                });
            }
        },
        methods: {
            async loadImages() {
                let imgs = this.markdown.querySelectorAll('img');

                if (imgs && imgs.length) {
                    await Promise.all(
                        Array.from(imgs).map(img => imageLoader(img.src))
                    );
                }
            },
            jump(e) {
                let a = aNode(e.target, this.markdown);

                if (!a) {
                    return;
                }

                // 下载文件也不拦截
                if (a.download) {
                    return;
                }

                // 跳出站外了就无所谓了
                if (a.hostname !== location.hostname) {
                    return;
                }
                // 页内锚点也无所谓
                if (a.pathname === location.pathname) {
                    if (a.search === window.location.search
                        && a.hash === window.location.hash
                    ) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                let params = {
                    path: a.pathname,
                    hash: a.hash
                };

                if (a.search) {
                    params.query = parse(a.search);
                }

                this.$router.push(params);
            },
            mountLike() {
                let storage = window.localStorage;
                let status = storage.getItem(this.$route.path);
                let likeBox = document.querySelector('.like-box');

                if (!likeBox) {
                    return;
                }

                let like = likeBox.querySelector('.like');
                let unlike = likeBox.querySelector('.unlike');

                like.addEventListener('click', () => {
                    if (like.className.indexOf('clicked') > -1) {
                        return;
                    }

                    if (likeBox.className.indexOf('unclick') === -1) {
                        return;
                    }

                    like.className += ' clicked';
                    likeBox.className = likeBox.className.replace('unclick', '');
                    this.likeStatus(1);
                });

                unlike.addEventListener('click', () => {
                    if (unlike.className.indexOf('clicked') > -1) {
                        return;
                    }

                    if (likeBox.className.indexOf('unclick') === -1) {
                        return;
                    }

                    unlike.className += ' clicked';
                    likeBox.className = likeBox.className.replace('unclick', '');
                    this.likeStatus(0);
                });

                if (status == null) {
                    likeBox.className += ' unclick';
                    return;
                }

                if (+status === 1) {
                    like.className += ' clicked';
                }
                else {
                    unlike.className += ' clicked';
                }
            },
            async likeStatus(status) {
                let storage = window.localStorage;
                storage.setItem(this.$route.path, status);
                axios('/api/doc/like', {
                    method: 'get',
                    params: {
                        status: status,
                        url: this.$route.path
                    }
                });
            }
        },
        async mounted() {
            this.isMounted = true;
            this.markdown = this.$refs.markdown;
            // ripple(this.markdown);
            this.markdown.addEventListener('click', this.jump.bind(this));
            this.markdown.addEventListener('touchend', this.jump.bind(this));
        },
        components: {
            LightBox
        }
    };

    function aNode(child, rootNode) {
        if (child == null) {
            return false;
        }

        if (child.tagName === 'A') {
            return child;
        }

        if (rootNode && rootNode === child) {
            return false;
        }

        if (child.tagName === 'body') {
            return false;
        }

        return aNode(child.parentNode);
    }

    function parse(search) {
        if (search.indexOf('?') === 0) {
            search = search.slice(1);
        }

        return search.split('&')
            .reduce((res, str) => {
                let arr = str.split('=');

                if (arr.length === 2) {
                    res[arr[0]] = arr[1];
                }

                return res;
            }, {});
    }
</script>