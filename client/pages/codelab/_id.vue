<template>
    <div id="app-codelab-page">
        <sidebar
            v-model="mobileSidebarStatus"
            id="sidebar-left"
        >
            <div class="sidebar-home"
                @click="goHome"
            ><i class="material-icons">home</i>Lavas</div>
            <div class="stepper-list">
                <v-stepper v-if="show"
                    v-model="step"
                    class="dark"
                    vertical
                >
                    <template v-for="(item, n) in menu">
                        <div class="stepper-step-item">
                            <v-stepper-step
                                :class="{
                                    'stepper-before': step > n + 1,
                                }"
                                :key="n + 1"
                                :step="n + 1"
                                :complete="step > n + 1"
                                edit-icon="done"
                                editable
                            >
                                {{ item.name }}
                            </v-stepper-step>
                        <div
                            :class="{'finished-color': n + 1 < step}"
                            class="vertical-line"
                            v-if="n + 1 !== menu.length"
                            :key="n"
                        ></div>
                        </div>
                    </template>
                </v-stepper>
            </div>
        </sidebar>
        <div class="stepper-content-wrapper">
            <v-stepper v-if="show" v-model="step">
                <v-stepper-items>
                    <v-stepper-content
                        v-for="(item, n) in list"
                        :step="n + 1"
                        :key="n + 1"
                    >
                        <v-card class="card-auto">
                            <div class="codelab-info">
                                <h2>{{ menuInfo.name }}</h2>
                                <p>{{ menuInfo.description }}</p>
                            </div>
                            <markdown ref="markdown" :html="item.html" />
                        </v-card>
                    </v-stepper-content>
                </v-stepper-items>
                <v-btn v-if="step - 1" color="primary" class="last-step-btn" @click="lastStep(step)"><i class="material-icons">keyboard_arrow_left</i></v-btn>
                <v-btn color="primary" class="next-step-btn" @click="nextStep(step)"><i class="material-icons">keyboard_arrow_right</i></v-btn>
            </v-stepper>
        </div>

        <toast v-model="error.show"
            :message="error.message"
        ></toast>
    </div>
</template>

<script>

import {mapGetters, mapState, mapActions} from 'vuex';
import axios from 'axios';
import Toast from '@/components/common/Toast';
import Markdown from '@/components/document/Markdown';
import Sidebar from '@/components/common/sidebar/Sidebar';
import easeScroll from '@/components/common/easeScroll';
// import hashScroller from 'HashScroller';

function setState(store) {}

export default {
    name: 'codelab-detail',
    metaInfo() {
        return {
            title: this.menuInfo.name,
            titleTemplate: '%s | Lavas',
            meta: [
                {
                    name: 'keywords',
                    content: 'lavas,pwa,codelab'
                },
                {
                    name: 'description',
                    content: this.menuInfo.description || 'lavas 相关实验'
                }
            ]
        }
    },
    data() {
        return {
            // e1: 1,
            loading: false
        };
    },
    computed: {
        ...mapState('codelab', [
            'menu',
            'details',
            'mapper',
            'error',
            'menuInfo'
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
        step: {
            set(step) {
                if (step > 0) {
                    this.$router.replace(this.menu[step - 1].url);
                }
            },
            get() {
                let url = this.mapper[this.path] || this.path;
                return this.menu.findIndex((item) => {
                    return item.url === url;
                }) + 1;
            }
        },
        list() {
            return this.menu.map(item => {
                return this.details[item.url] || {html: ''};
            });
        },
        show() {
            return this.menu.length !== 0;
        },
        path() {
            return this.$route.path;
        },
        hash() {
            return this.$route.hash;
        }
        // show() {
        //     return this.menu.length !== 0
        //         && this.data.length !== 0
        //         && this.menu.length === this.menu.length;
        // }
    },
    components: {
        Toast,
        Markdown,
        Sidebar
    },
    watch: {
        async path() {
            this.mobileSidebarStatus = false;
            await this.$store.dispatch('codelab/getDetail', this.path);
            window.scrollTo(0, 0);
        },
        hash() {
            // hashScroller && hashScroller.scrollTo(val);
        }
        // async e1(val) {
        //     this.$router.replace(this.menu[val - 1].url);
        // }
    },
    methods: {
        nextStep(n) {
            if (n >= this.menu.length) {
                this.$router.replace(this.menu[0].url);
            }
            else {
                this.$router.replace(this.menu[n].url);
            }
        },
        lastStep(n) {
            if (n > 1) {
                this.$router.replace(this.menu[n - 2].url);
            }
        },
        goHome() {
            this.$router.push('/');
        }
    },
    async asyncData({store, route}) {
        store.dispatch('app-shell/setPath', route.path);
        await Promise.all([
            store.dispatch('codelab/getMenu', route.path),
            store.dispatch('codelab/getDetail', route.path)
        ]);
    },
    beforeRouteUpdate(to, from, next) {
        this.mobileSidebarStatus = false;
        next();
    },
    beforeRouteLeave(to, from, next) {
        this.mobileSidebarStatus = false;
        next();
    }
};
</script>

<style lang="stylus">
#app-codelab-page
    #sidebar-left
        .wd-sidebar-pc
            width 300px
            top 64px
            left 0
            bottom 0

@media screen and (min-width: 768px)
    #app-codelab-page
        #sidebar-left
            .wd-sidebar-mobile
                display none

@media screen and (max-width: 767px)
    #app-codelab-page
        #sidebar-left
            .wd-sidebar-pc
                display none
</style>

<style lang="stylus" scoped>
@require '~@/assets/style/variable'

// body
//     width 100%
//     height 100%

#app-codelab-page
    background #eee
    // width 100%
    // display flex
    // position absolute
    // top 64px
    // bottom 0
    // .stepper
    //     width 100%
    //     display flex
        // position absolute
        // top 0
        // bottom 0

    .wd-sidebar
        // background #37474f

        /deep/ .wd-sidebar-pc
            background #37474f
        /deep/ .sidebar-main
            background #37474f

        .sidebar-home
            display none

    .stepper-list
        // flex none
        // width 300px
        padding-top 20px
        // background #fff
        // box-shadow 2px 0 2px -1px rgba(0,0,0,.2)
        overflow auto
        .stepper
            // background inherit
            background #37474f
            box-shadow none

        .stepper-step-item
            position relative

            .stepper__step
                padding 24px !important

                /deep/ .stepper__label
                    color $colorWhite
                    font-size 14px

            .stepper__step--inactive
                /deep/ .stepper__label
                    color $colorGreyTiny

            .vertical-line
                border-left solid 1px #ccc
                height 20px
                width 1px
                position absolute
                top 64px
                left 35px
                z-index 5
                &.finished-color
                    border-color #1976D2

    .stepper-content-wrapper
        // flex 1
        // background #eee
        padding 30px 0 40px
        margin-left 300px
        .stepper
            background inherit
            box-shadow none
        // position relative
        // top 0
        // left 200px
        // bottom 0

        .card
            max-width 1000px
            margin 0 auto 10px
            min-height 100vh
            // padding-top 50px

        .codelab-info
            background #546e7a
            padding 20px 50px
            margin-bottom 50px
            h2
                color $colorWhite
                font-size 24px
                font-weight 500
            p
                margin-bottom 0
                color $colorGreyTrace
                font-size 15px
            // padding 30px 0 40px
        // .stepper__items
        //     height 100%
        //     .stepper__content
        //         width 90%
        //         height 100%
        //         margin 0 auto
        //         position relative
        //         overflow auto
        //         .stepper__wrapper
        //             // width 100%
        //             position absolute
        //             top 0
        //             bottom 0
        //             .card
        //                 position absolute
        //                 top 20px
        //                 left 10px
        //                 right 10px
        //                 margin-bottom 50px
        //                 padding 30px
        //                 border-radius 2px
        .btn
            width 50px !important
            height 50px
            min-width 50px !important
            border-radius 50%
            overflow hidden

            &.last-step-btn
                position fixed
                left 320px
                bottom 50px
            &.next-step-btn
                position fixed
                right 20px
                bottom 50px

@media screen and (max-width: 767px)
    #app-codelab-page
        .stepper-content-wrapper
            margin 0
            padding-top 0
            padding-bottom 0
            .card
                margin 0
            .btn
                &.last-step-btn
                    left 20px

        .stepper-list
            width auto
        .stepper__content
            padding 0
        .sidebar-home
            display block
            // margin 0 -20px
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
// @media screen and (max-width: 958px)
//     #app-codelab-page
//         top 56px
//     .stepper
//         width 100%
//         position absolute
//         top 0
//         bottom 0
//         .stepper-list
//             position fixed
//             top 0
//             bottom 0
//             left 0
//             width 260px
//             z-index 99999
//             background #fff
//             box-shadow 2px 0 2px -1px rgba(0,0,0,.2)
//             .stepper-step-item
//                 position relative

//                 .stepper__step
//                     padding 24px !important
//                     .stepper__label
//                         display block !important
//                 .stepper:not(.stepper--vertical) .stepper__label
//                     display block !important
//                 .vertical-line
//                     border-left solid 1px #ccc
//                     height 20px
//                     width 1px
//                     position absolute
//                     top 64px
//                     left 35px
//                     z-index 5
//                     &.finished-color
//                         border-color #1976D2

//         .stepper-content-wrapper
//             background #eee
//             position relative
//             top 0
//             // left 0
//             bottom 0
//             .stepper__items
//                 height 100%
//                 .stepper__content
//                     width 90%
//                     height 100%
//                     margin 0 auto
//                     position relative
//                     .stepper__wrapper
//                         // width 100%
//                         position absolute
//                         top 0
//                         bottom 0
//                         .card
//                             position absolute
//                             top 20px
//                             left 10px
//                             right 10px
//                             margin-bottom 20px
//                             padding 20px
//                             border-radius 2px


//             .btn
//                 width 50px !important
//                 height 50px
//                 min-width 50px !important
//                 border-radius 50%
//                 overflow hidden

//                 &.last-step-btn
//                     position absolute
//                     left 20px
//                     bottom 50px
//                 &.next-step-btn
//                     position absolute
//                     right 20px
//                     bottom 50px

//     #app-codelab-page .stepper:not(.stepper--vertical) .stepper__label
//         display block !important




// .application .theme--light.stepper--vertical .stepper__content:not(:last-child), .theme--light .stepper--vertical .stepper__content:not(:last-child)
//     border none !important

// #app-codelab-page .stepper--vertical
//     padding-bottom 0 !important

</style>
