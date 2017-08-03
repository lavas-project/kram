<template>
    <div class="md-content">
        <div v-html="html"
            class="markdown-body"
            ref="markdown"
        ></div>
        <light-box :selector="'.markdown-body'"></light-box>
    </div>
</template>

<style lang="stylus">
    @require '~highlight.js/styles/monokai-sublime.css'
    @require '~github-markdown-css/github-markdown.css'
    @require './markdownOverwrite'
    @require '../common/style/variable'
    @require './ripple'

    .md-content
        padding 0 50px 100px 50px

    .markdown-body

        &:after
            display none

        h2, h3, h4, h5, h6
            &.md-heading
                background #f0f5f6
                padding 5px 5px 5px 10px

                &:hover
                    text-decoration none

                    .heading-link
                        .material-icons
                            display block

        h1.md-heading
            border-bottom 1px solid #dcdcdc
            padding-bottom 15px

            & + blockquote
                margin-top -20px
                margin-bottom 40px

        .md-heading
            position relative

            a[target="_blank"]
                .material-icons
                    display none

        .heading-link
            color $colorBlack
            text-decoration none

            .material-icons
                font-size 18px
                position absolute
                top 50%
                transform translateY(-50%)
                left -22px
                display none
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

        .md-img
            display inline-block
            margin-bottom 20px
            min-width 49%
            margin-right 1%

            img
                display block
                cursor zoom-in

            p
                font-weight 600
                margin-top 5px
                word-break break-all

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
            margin-right 20px
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

            &:active
                box-shadow 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)

    @media screen and (max-width: 600px)
        .md-content
            padding 0 25px 50px

        .md-img
            min-width 50%
            margin-right 0

        .to-github
            display none
</style>

<script>
    import {imageLoader} from '../common/utils/basic';
    import {scrollTop} from '../common/easeScroll';
    import LightBox from './lightbox';
    import ripple from './Ripple';

    export default {
        name: 'markdown',
        props: ['html'],
        data() {
            return {
                markdown: null
            };
        },
        watch: {
            html() {
                this.$nextTick(async () => {
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
                        bus.$emit('scroll', a.hash);
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
            }
        },
        async mounted() {
            this.markdown = this.$refs.markdown;
            ripple(this.markdown);
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