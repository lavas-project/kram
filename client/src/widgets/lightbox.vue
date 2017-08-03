<template>
    <transition name="light-box">
        <div class="light-box" v-show="show" @click.prevent.stop="close">
            <div class="img-wrapper">
                <img :src="src"
                    :style="{width: widthStr, height: heightStr}"
                >
            </div>
            <div class="mask"></div>
        </div>
    </transition>
</template>

<style lang="stylus" scoped>
    @require '../common/style/variable'
    .light-box
        fixed 0 0 0 0
        z-index 130
        .mask
            width 100%
            height 100%
            z-index 1
            opacity .7
            background $colorBlack
        .img-wrapper
            absolute 50% _ _ 50%
            transform translate(-50%, -50%)
            z-index 2
            overflow auto
            max-width 90%
            max-height 90%
            // cursor zoom-out
            // img
            //     size 100% 100%
    .light-box-enter-active,
    .light-box-leave-active
        transition opacity .3s

    .light-box-enter,
    .light-box-leave-active
        opacity 0
</style>

<script>
    import {imageLoader} from '../common/utils/basic';
    export default {
        name: 'light-box',
        props: ['selector'],
        data() {
            const clientWidth = document.documentElement.clientWidth;
            const clientHeight = document.documentElement.clientHeight;

            return {
                container: null,
                event: async e => {
                    if (e.target.tagName !== 'IMG') {
                        return;
                    }

                    let {status, data} = await imageLoader(e.target.src);
                    if (status === 0) {
                        this.width = data.width;
                        this.height = data.height;

                        this.src = e.target.src;
                        this.showImage = true;
                    }
                    else {
                        console.log('wtf');
                    }
                },
                width: 0,
                height: 0,
                src: '',
                clientWidth: clientWidth,
                clientHeight: clientHeight,
                showImage: false,
                showError: false
            };
        },
        computed: {
            show() {
                return this.showImage || this.showError;
            },
            widthStr() {
                return this.width + 'px';
            },
            heightStr() {
                return this.height + 'px';
            }
        },
        methods: {
            close() {
                this.showImage = false;
                this.showError = false;
            }
        },
        mounted() {
            if (this.clientWidth > 600) {
                this.container = document.querySelector(this.selector);
                this.container.addEventListener('click', this.event);
            }
        },
        beforeDestroy() {
            if (this.clientWidth > 600) {
                this.container.removeEventListener('click', this.event);
            }
        }
    };
</script>