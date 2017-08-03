<template>
    <transition name="top">
        <div class="back-top"
            v-show="shouldDisplay"
            @click="scroll"
        ><i class="material-icons">arrow_upward</i></div>
    </transition>
</template>

<style lang="stylus" scoped>
    @require '../common/style/variable'
    .back-top
        z-index 30
        size 40px 40px
        background #333
        opacity .4
        line-height 40px
        text-align center
        border-radius 20px
        cursor pointer
        user-select none
        &:hover
            background #111
        i
            font-size 30px
            vertical-align middle
            color $colorWhite

    .top-enter,
    .top-leave-active
        opacity 0

    .top-enter-active,
    .top-leave-active
        transition opacity .3s

    @media screen and (min-width: 1616px)
        .back-top
            fixed _ _ 20px 1320px
    @media screen and (max-width: 1615px)
        .back-top
            fixed _ 240px 20px _
    @media screen and (max-width: 1024px)
        .back-top
            fixed _ 20px 20px _
</style>

<script>
    import {scrollTop} from '../common/easeScroll';
    export default {
        name: 'back-top',
        data() {
            return {
                timer: null,
                // show: false,
                scrolling: false,
                scrollY: 0,
                shouldShow: false,
                shouldDisplay: false,
                displayTimer: null
            };
        },
        watch: {
            scrollY() {
                if (this.shouldShow) {
                    this.shouldDisplay = true;
                    this.displayTimer && window.clearTimeout(this.displayTimer);
                    this.displayTimer = window.setTimeout(() => {
                            this.shouldDisplay = false;
                            this.displayTimer = null;
                        }, 3000);
                }
                else {
                    this.shouldDisplay = false;
                }
            }
        },
        methods: {
            async scroll() {
                if (this.scrolling) {
                    return;
                }
                this.scrolling = true;
                await scrollTop(0);
                this.shouldShow = false;
                this.scrolling = false;
            }
        },
        created() {
            this.timer = window.setInterval(() => {
                    this.scrollY = window.scrollY;
                    this.shouldShow = this.scrollY >= document.documentElement.clientHeight;
                }, 600);
        },
        beforeDestroy() {
            window.clearInterval(this.timer);
        }
    };
</script>