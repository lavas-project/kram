<template>
    <div  class="error-content">
        <div class="err-wrapper">
            <p class="err-msg">4<span><i class="fa fa-frown-o" aria-hidden="true"></i></span>4</p>
            <p>很抱歉，未找到指定页面!</p>
            <v-btn to="/"><i class="fa fa-home" aria-hidden="true"></i>&nbsp;返回首页</v-btn>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapState, mapActions} from 'vuex';

export default {
    name: 'error',
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
    // computed: {
    //     ...mapActions('app-shell', [
    //         'setShowLogo'
    //     ])
    // },
    created() {
        let query = this.$route.query;
        if (Object.keys(query).length !== 0) {
            this.$router.replace({
                name: 'error',
                params: query
            });
        }
    }
    // ,
    // mounted() {
    //     this.$store.dispatch('app-shell/setShowLogo', true);
    // }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/variable'

.error-content
    min-height 100vh
    position relative
    .err-wrapper
        position absolute
        top 30%
        left 50%
        margin-left -160px
        text-align center
        color $colorGrey
        width 350px
        font-size 30px

        .err-msg
            font-size 72px
            margin-bottom 20px
            // opacity 0.5
            span
                margin 0 10px
                color $colorPrimaryBlue
        .btn
            margin-top 20px
            width 190px
            height 50px
            font-size 18px
            background $colorBlue !important
            color $colorWhite
            border-radius 5px

@media screen and (max-width: 720px)

    .error-content
        .err-wrapper
            font-size 18px
            width 320px

            .err-msg
                font-size 50px
            .btn
                width 150px
                margin-top 10px



</style>