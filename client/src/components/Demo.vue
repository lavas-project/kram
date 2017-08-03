<template>
    <div class="demo">
        <div class="demo-wrapper">
            <div class="phone">
                <div class="sensor"></div>
                <div class="speaker"></div>
                <div class="home" @click="home"></div>
                <div class="iframe-wrapper">
                    <iframe
                        :src="demoUrl"
                        scrolling="auto"
                        frameborder="no"
                        ref="iframeDemo"
                    ></iframe>
                </div>
            </div>
            <div class="demo-info">
                <p>扫描下方二维码</p>
                <p>或 <a :href="demoUrl" target="_blank">点击这里</a> 查看 demo</p>
                <qrcode-vue :value="demoUrl" size=280 class="qr-code"></qrcode-vue>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import QrcodeVue from 'qrcode.vue';

const DEFAULT_DEMO_URL = 'https://lavas-project.github.io/lavas-demo/appshell/';

export default {
    name: 'demo',
    components: {
        QrcodeVue
    },
    data() {
        return {
            demoUrl: DEFAULT_DEMO_URL
        };
    },
    methods: {
        home() {
            this.$refs.iframeDemo.contentWindow.location.replace(this.demoUrl);
        }
    },
    created() {
        document.title = this.$route.meta.title;
    }
};
</script>

<style lang="stylus">
    .demo
        position relative
        margin 0 auto
        width 800px
        .demo-wrapper
            width 100%
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
            .demo-info
                float right
                margin 30px 0 0 0
                font-size 16px
                p
                    text-align center
                    margin-bottom 40px
                .qr-code
                    width 280px
                    height 280px
                    margin 0 auto
                    canvas
                        width 100%
                        height 100%
                        display block

            .phone
                float left
                position: relative
                padding: 60px 10px
                width: 320px
                height: 480px
                overflow hidden
                box-sizing content-box
                background: #080808
                border-radius: 28px

                .sensor
                    background: #3c3d3d
                    width: 12px
                    height: 12px
                    position: absolute
                    top: 26px
                    left: 50%
                    margin-left: -60px
                    border-radius: 100%

                .speaker
                    background: #292728
                    width: 60px
                    height: 8px
                    position: absolute
                    top: 28px
                    left: 50%
                    margin-left: -30px
                    border-radius: 4px

                .home
                    cursor pointer
                    border-radius: 16px
                    width: 80px
                    height: 28px
                    position: absolute
                    left: 50%
                    margin-left: -40px
                    bottom: 16px
                    background: linear-gradient(135deg, #464646 0%, #464646 50%, #464646 100%)
                    &:before
                        background: #080808
                        position: absolute
                        content: ''
                        border-radius: 16px
                        width: calc(100% - 4px)
                        height: calc(100% - 4px)
                        top: 2px
                        left: 2px
                    &:active
                        background #292728
                .iframe-wrapper
                    box-sizing: content-box
                    background: #fff
                    width 320px
                    height 480px
                    overflow-y scroll
                    overflow-x hidden
                    -webkit-overflow-scrolling touch
                    iframe
                        width 320px
                        height 480px
                    &::-webkit-scrollbar
                        width 0px
                        background transparent

    @media screen and (max-width: 800px)
        .demo
            width 100%
            padding 20px 0 0 0
            .demo-wrapper
                top 40%
                .phone
                    display none
                .demo-info
                    float none
                    p
                        margin 0 auto 10px 0
                    .qr-code
                        width 200px
                        height 200px
                        margin 0 auto
                        canvas
                            width 100% !important
                            height 100% !important
                            display block

</style>
