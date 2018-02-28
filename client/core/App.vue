<template>
    <div id="app">
        <v-app>
            <top-menu></top-menu>
            <div class="app-view-container">
                <router-view class="app-view"></router-view>
            </div>
            <update-toast></update-toast>
            <common-footer></common-footer>
        </v-app>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import UpdateToast from '@/components/UpdateToast';
    import TopMenu from '@/components/common/TopMenu';
    import CommonFooter from '@/components/common/CommonFooter';


    export default {
        name: 'app',
        components: {
            UpdateToast,
            TopMenu,
            CommonFooter
        },
        methods: {
            ...mapActions('app-shell', [
                'setPath'
            ])
        }
    };
</script>

<style lang="stylus">
    @import '~vuetify/dist/vuetify.min.css'
    @import '~@/assets/style/global'

    #app
        font-family $roboto
        .app-view-container
            min-height 100vh
            background $colorWhite

        .app-view
            min-height 100vh
            background $theme.primary


            &::-webkit-scrollbar
                width 0
                background transparent

            // vuetify selects 组件 在 safari 下 flex 属性兼容处理
            .input-group--select
                display block
                .input-group__input
                    display flex
                    display -webkit-flex

    @media screen and (min-width: 768px)
        #app
            .app-view
                padding-top 64px

    @media screen and (max-width: 767px)
        #app
            .app-view-container
                background-color #fff
            .app-view
                padding-top 56px
</style>
