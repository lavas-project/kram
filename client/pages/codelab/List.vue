<template>
    <div id="codelab-list-wrapper">
        <div class="codelab-list-head">
            <div class="head-inner-wrapper">
              <!--   <div class="head-logo"><<i class="fa fa-flask" aria-hidden="true"></i>></div> -->
              <div class="head-logo"><i class="fa fa-code" aria-hidden="true"></i></div>
                <div class="head-text">
                    <p class="welcom">Welcome to Codelab</p>
                    <p>我们在 Codelab 中提供了一系列基于 Lavas 的编程小项目，内容包括项目起步、配置教学、功能实现等等</p>
                </div>
            </div>
        </div>
        <div class="codelab-list-main">
            <div class="main-inner-wrapper"  ref="ripple">
                <template v-for="item in list">
                    <router-link :to="item.url" class="lab-item ui-dep-1"
                        v-ripple
                    >
                        <div class="codelab-name-wrapper">
                            <div class="codelab-name"><i class="fa fa-rocket" aria-hidden="true"></i> &nbsp;{{ item.info.name }}</div>
                        </div>
                        <p class="codelab-release-time">学习时间：{{ item.info.duration }}</p>
                        <p class="codelab-desc">{{ item.info.description }}</p>
                    </router-link>
                </template>
            </div>
        </div>
        <toast v-model="error.show"
            :message="error.message"
        ></toast>
    </div>
</template>

<script>

import {mapState} from 'vuex';
import axios from 'axios';
import Toast from '@/components/common/Toast';
// import Ripple from '@/components/common/Ripple'

// function setState(store) {}

export default {
    name: 'codelab',
    metaInfo: {
        title: 'Codelab',
        titleTemplate: '%s | Lavas',
        meta: [
            {
                name: 'keywords',
                content: 'lavas,pwa,codelab'
            },
            {
                name: 'description',
                content: 'lavas 相关实验'
            }
        ]
    },
    computed: {
        ...mapState('codelab', [
            'list',
            'error'
        ])
    },
    components: {
        Toast
    },
    // mounted() {
    //     Ripple(this.$refs.ripple);
    // },
    async asyncData({store, route}) {
        store.dispatch('app-shell/setPath', route.path);
        await store.dispatch('codelab/getList', 'codelab');

    }
};
</script>

<style lang="stylus">
@require '~@/assets/style/variable'

#codelab-list-wrapper
    background #eee
    .codelab-list-head
        width 100%
        background $colorPrimaryBlue
        height 320px
        .head-inner-wrapper
            max-width 1000px
            margin 0 auto
            color #fff
            padding 0 20px

        .head-logo
            display inline-block
            vertical-align top
            font-family $consolas
            text-align center
            margin-top 30px
            width 30%
            height 100%
            color #fff
            font-size 100px
            font-weight 600
        .head-text
            display inline-block
            width 69%
            padding 50px 0 20px 50px
            .welcom
                font-size 40px
            p
                font-size 20px

    .codelab-list-main
        width 100%
        .main-inner-wrapper
            max-width 1040px
            margin -140px auto 0
            padding 50px 20px
            overflow hidden

            .lab-item
                position relative
                background #fff
                float left
                width 32%
                margin 0 2% 3% 0
                padding 0
                text-algin center
                min-height 200px
                overflow hidden
                text-decoration none
                border-radius 5px

                &:nth-of-type(3n)
                    margin-right 0
                .codelab-name-wrapper
                    background #546e7a
                    padding 0 10px
                .codelab-name
                    min-height 50px
                    line-height 50px
                    font-size 18px
                    text-align center
                    color #fff
                    font-weight 400
                    ellipsis()

                .codelab-release-time
                    margin 10px 0
                    color $colorGrey
                    text-align center
                .codelab-desc
                    color $colorBlack
                    font-size 16px
                    font-weight 400
                    text-align left
                    line-height 1.7
                    padding 0 20px 10px
                    height 145px


@media screen and (max-width: 767px)
    #codelab-list-wrapper
        padding-bottom 64px
        .codelab-list-head
            height auto
            .head-inner-wrapper
                padding 0 20px 20px
                .welcom
                    line-height 50px
                .head-logo
                    font-size 100px
                    margin-top 0
                .head-text
                    width 100%
                    padding 0

        .codelab-list-main
            .main-inner-wrapper
                margin 0 auto
                width 100%
                padding 20px
                .lab-item
                    width 100%
                    margin 0 0 20px
</style>
