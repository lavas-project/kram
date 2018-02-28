<template>
    <div v-if="showFooter" id="footer-wrapper">
        <div id="footer">
            <div class="footer-box">
                <div class="link-wrapper">
                    <div class="link-box">
                        <div class="title">联系方式</div>
                        <p class="links">
                            <a href="https://www.github.com/lavas-project" target="_blank"><svg t="1498641781602" class="icon-svg" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2360" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
                    <path d="M950.857143 512q0 143.428571-83.714286 258t-216.285714 158.571429q-15.428571 2.857143-22.571429-4t-7.142857-17.142857l0-120.571429q0-55.428571-29.714286-81.142857 32.571429-3.428571 58.571429-10.285714t53.714286-22.285714 46.285714-38 30.285714-60 11.714286-86q0-69.142857-45.142857-117.714286 21.142857-52-4.571429-116.571429-16-5.142857-46.285714 6.285714t-52.571429 25.142857l-21.714286 13.714286q-53.142857-14.857143-109.714286-14.857143t-109.714286 14.857143q-9.142857-6.285714-24.285714-15.428571t-47.714286-22-49.142857-7.714286q-25.142857 64.571429-4 116.571429-45.142857 48.571429-45.142857 117.714286 0 48.571429 11.714286 85.714286t30 60 46 38.285714 53.714286 22.285714 58.571429 10.285714q-22.857143 20.571429-28 58.857143-12 5.714286-25.714286 8.571429t-32.571429 2.857143-37.428571-12.285714-31.714286-35.714286q-10.857143-18.285714-27.714286-29.714286t-28.285714-13.714286l-11.428571-1.714286q-12 0-16.571429 2.571429t-2.857143 6.571429 5.142857 8 7.428571 6.857143l4 2.857143q12.571429 5.714286 24.857143 21.714286t18 29.142857l5.714286 13.142857q7.428571 21.714286 25.142857 35.142857t38.285714 17.142857 39.714286 4 31.714286-2l13.142857-2.285714q0 21.714286 2.857143 50.857143t2.857143 30.857143q0 10.285714-7.428571 17.142857t-22.857143 4q-132.571429-44-216.285714-158.571429t-83.714286-258q0-119.428571 58.857143-220.285714t159.714286-159.714286 220.285714-58.857143 220.285714 58.857143 159.714286 159.714286 58.857143 220.285714z" p-id="2361"></path>
                </svg>lavas-project</a>
                            <a href="mailto:lavas@baidu.com"><i class="material-icons">mail_outline</i>lavas@baidu.com</a>
                            <span>
                                <svg t="1499656370067" class="icon-svg" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3036" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M363.512 774.038c-10.783-0.927-30.573-7.16-41.95-38.482-14.16-38.863-9.368-92.746 13.506-151.698 9.366-24.114 23.836-48.646 43.112-73.122-2.89-8.883-4.347-17.879-4.347-26.901 0-19.818 6.879-48.585 38.054-77.155 8.571-59.887 36.713-114.91 80.02-155.99 15.245-14.46 31.97-26.784 49.776-36.845-40.662-42.256-96.686-68.373-158.548-68.373-116.355 0-212.012 92.303-223.738 210.672-23.042 18.314-36.483 39.625-36.483 62.474 0 10.943 3.298 21.51 9.063 31.612-15.608 18.053-37.004 45.99-49.793 78.919-20.68 53.296-24.516 100.45-13.286 131.27 10.1 27.803 27.81 25.317 42.376-0.376 3.749-6.603 9.409-15.761 15.693-25.734 10.771 33.352 28.785 63.862 52.5 89.73-14.545 4.423-27.139 9.663-34.29 15.695-26.99 22.983-28.18 49.662-5.292 70.092 29.587 26.462 149.416 39.406 219.039 0.508 7.869 0.668 15.76 1.1 23.813 1.114 4.784-9.16 12.19-18.875 23.447-28.461l0.104-0.09a69.32 69.32 0 0 1 6.992-5.15 270.009 270.009 0 0 1-12.168-19.521c-9.164 9.413-21.702 17.173-37.6 15.812z" p-id="3037"></path><path d="M943.02 591.758h0.02c-11.977-30.892-32.07-57.077-46.71-74.034 5.43-9.477 8.5-19.39 8.5-29.655 0-21.434-12.627-41.426-34.223-58.606-11.001-111.02-100.756-197.63-209.87-197.63-109.152 0-198.888 86.59-209.889 197.63-21.616 17.18-34.224 37.172-34.224 58.606 0 10.266 3.092 20.178 8.501 29.655-14.641 16.936-34.712 43.143-46.71 74.034-19.4 49.996-22.998 94.232-12.463 123.144 9.473 26.081 26.088 23.75 39.753-0.353 3.516-6.193 8.826-14.786 14.721-24.14 10.105 31.287 27.004 59.909 49.251 84.175-13.645 4.15-25.46 9.066-32.169 14.724-25.318 21.56-26.435 46.588-4.964 65.753 27.757 24.824 140.167 36.966 205.48 0.476 7.505 0.638 15.028 1.051 22.713 1.051 8.194 0 16.29-0.413 24.28-1.113 65.272 36.573 177.864 24.41 205.642-0.414 21.45-19.165 20.313-44.192-4.982-65.753-6.936-5.865-19.28-10.881-33.531-15.156 22.08-24.183 38.815-52.62 48.862-83.743 5.9 9.356 11.204 17.948 14.721 24.141 13.665 24.082 30.26 26.414 39.753 0.353 10.535-28.913 6.936-73.148-12.462-123.145z" p-id="3038"></path></svg>QQ 群号 655433298</span>
                        </p>
                    </div>
                    <div class="link-box">
                        <div class="title">其他项目</div>
                        <p class="links">
                            <a href="https://www.mipengine.org/" target="_blank">MIP</a>
                            <a href="https://ecomfe.github.io/san/" target="_blank">San</a>
                            <a href="http://fis.baidu.com/" target="_blank">FIS</a>
                        </p>
                    </div>
                    <div class="link-box">
                        <div class="title">友情链接</div>
                        <p class="links">
                            <a href="https://developers.google.com/web/fundamentals" target="_blank">Google Developer</a>
                            <a href="https://cn.vuejs.org" target="_blank">Vue</a>
                            <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a>
                        </p>
                    </div>
                </div>
                <p class="copyright">
                    Copyright © {{ year }} &nbsp; &nbsp;Lavas Project
                </p>
            </div>
        </div>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    export default {
        name: 'top-menu',
        data() {
            return {
                year: (new Date()).getFullYear()
            };
        },
        computed: {
            ...mapGetters('app-shell', [
                'showFooter'
            ])
        }
    };
</script>


<style lang="stylus">
@import '~@/assets/style/variable'

#footer-wrapper
    #footer
        background $colorFooterDark
        color $colorWhite
        padding-top 25px
        text-align center
        z-index 2

        .footer-box
            max-width 1200px
            margin 0 auto
        .link-wrapper
            display flex
        .link-box
            border-top 1px solid #707375
            flex 1
            // display inline-block
            font-size 13px
            // padding-bottom 20px
            margin 0 20px
            padding-top 10px
            .title
                text-align left
                margin-bottom 5px
                font-size 14px
                // border-left 2px solid $colorWhite
                // padding-left 6px
                line-height 1.2
            .links
                text-align left
                a,
                span
                    color #979797
                    display block
                    line-height 1.5
                    position relative
                    img
                        size 70px 70px
                        vertical-align text-top
                        margin-left -2px
                        // position absolute
                        // top 3px
                        // left 26px

            .icon-svg,
            .material-icons
                size 16px 16px
                vertical-align middle
                font-size 16px
                margin-top -3px
                margin-right 10px
            .icon-svg
                fill #979797

        .copyright
            font-size 13px
            line-height 24px
            padding 15px 0
            margin 0

    /* for mobile */
    @media screen and (max-width: 720px)
        #footer
            padding 5px 0
            text-align center
            margin-top  -64px
            .link-wrapper
                display none

</style>
