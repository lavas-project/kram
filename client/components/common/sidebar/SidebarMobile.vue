<template>
    <div class="wd-sidebar-mobile"
        ref="sidebarWrapper"
        :class="wrapperClass"
        v-if="avaliable"
    >
        <div class="sidebar-scroller"
            ref="sidebarScroller"
            :style="sidebarScrollerStyle"
        >
            <div v-if="beside === 'right'"
                class="touch-toggle"
                :style="{
                    'opacity': opacity,
                    'padding-right': widthProp
                }"
                @click.stop.prevent="toggleClick"
            ></div>
            <div class="sidebar-main"
                :style="{
                    width: widthProp
                }"
                @scroll.stop
            >
                <slot></slot>
            </div>
            <div v-if="beside === 'left'"
                class="touch-toggle"
                :style="{
                    'opacity': opacity,
                    'padding-left': widthProp
                }"
                @click.stop.prevent="toggleClick"
            ></div>
        </div>
    </div>
</template>
<style lang="stylus">
.wd-sidebar-mobile
    z-index 9999
    .sidebar-main
        overflow-y auto
        overflow-x hidden
        box-sizing border-box
        z-index 25
        display none
        background #fff
        height 0
        top 0
    .touch-toggle
        position fixed
        top 0
        bottom 0
        left 0
        width 0
        z-index 100
        opacity 0
        transition opacity .3s
    &.collapse
        margin-top 0 !important
        .sidebar-scroller
            padding-left 0 !important
        .touch-toggle
            padding-left 0 !important
            top 64px
    &.expand
        position fixed
        top 0
        right 0
        bottom 0
        left 0
        z-index 150
        overflow hidden
        .sidebar-scroller
            width 100%
            height 100%
            white-space nowrap
            position relative
            box-sizing content-box
        .sidebar-main
            display block
            height 100%
            position absolute
            top 0
            right auto
            bottom 0
            left 0
            overflow auto
        .touch-toggle
            position static
            width 100%
            height 100%
            background #212121
            opacity .5
</style>
<script>
import IScroll from 'iscroll/build/iscroll-lite';
import {
    getWithDefault
} from '@/assets/common/utils/basic';
import {
    rAF,
    clientWidth,
    clientHeight,
    toUnit,
    getMediaQueryValue
} from '@/assets/common/utils/dom';
const DEFAULT_PROP = 'default';
export default {
    props: {
        value: {
            'type': Boolean,
            'default': false
        },
        mediaQuery: {
            'type': [Array, Object],
            [DEFAULT_PROP]() {
                return {
                    left: 0,
                    right: 80
                };
            }
        },
        duration: {
            'type': Number,
            'default': 200
        },
        triggerArea: {
            'type': Object,
            [DEFAULT_PROP]() {
                return {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 40
                };
            }
        },
        beside: {
            'type': String,
            'default': 'left'
        }
    },
    data() {
        return {
            clientWidth: 320,
            clientHeight: 568,
            startX: 0,
            startY: 0,
            scrollEnable: false,
            wrapperClass: {
                'expand': false,
                'collapse': true,
                'w-left': true
            },
            opacity: 0,
            iscroll: null
        };
    },
    computed: {
        layout() {
            let clientWidth = this.clientWidth;
            let val = getMediaQueryValue(this.mediaQuery, this.clientWidth);
            let {left, right, width} = val;

            return Object.assign({}, val, {
                width: getWithDefault(width, clientWidth - left - right)
            });
        },
        width() {
            return this.layout.width;
        },
        widthProp() {
            return toUnit(this.width);
        },
        sidebarScrollerStyle() {
            if (this.beside === 'left') {
                return {
                    'padding-left': this.widthProp
                };
            }

            return {
                'padding-right': this.widthProp
            };
        },
        avaliable() {
            return this.layout.display !== 'none';
        },
        status: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        },
        zone() {
            let {top, right, bottom, left, width, height} = this.triggerArea;
            let clientWidth = this.clientWidth;
            let clientHeight = this.clientHeight;

            return {
                top: getWithDefault(top, clientHeight - bottom - height),
                left: getWithDefault(left, clientWidth - right - width),
                width: getWithDefault(width, clientWidth - left - right),
                height: getWithDefault(height, clientHeight - top - left)
            };
        }
    },
    watch: {
        status(val) {
            if (val) {
                this.expand();
            }
            else {
                this.collapse();
            }
        }
    },
    // beforeMount() {
    //     this.measure();
    // },
    mounted() {
        this.measure();
        this.touchStartFn = this.touchStart.bind(this);
        this.touchMoveFn = this.touchMove.bind(this);
        document.body.addEventListener('touchstart', this.touchStartFn);
        document.body.addEventListener('touchmove', this.touchMoveFn);
    },
    beforeDestroy() {
        document.body.removeEventListener('touchstart', this.touchStartFn);
        document.body.removeEventListener('touchmove', this.touchMoveFn);
    },
    methods: {
        measure() {
            this.clientWidth = clientWidth();
            this.clientHeight = clientHeight();
        },
        inTriggerArea(x, y, {top, left, width, height}) {
            return x >= left
                && x <= left + width
                && y >= top
                && y <= top + height;
        },
        /**
         * 用于记录 touch 初始位置
         *
         * @param {Event} e 原生事件对象
         */
        touchStart(e) {
            if (this.wrapperClass.expand) {
                return;
            }
            if (!this.avaliable) {
                return;
            }
            let {clientX, clientY} = e.touches[0];
            this.scrollEnable = this.inTriggerArea(clientX, clientY, this.zone);
            if (!this.scrollEnable) {
                return;
            }
            this.startX = clientX;
            this.startY = clientY;
        },
        /**
         * 用于判断当前滑动距离和方向是否满足触发 sidebar 侧滑
         *
         * @param {Event} e 原生事件对象
         */
        touchMove(e) {
            if (!this.scrollEnable) {
                return;
            }
            let {clientX, clientY} = e.touches[0];
            let x = clientX - this.startX;
            // 只有当滑动距离大于 5 像素
            // 同时滑动角度小于 30° 时，触发 sidebar 侧滑
            if (x > 5 && Math.abs(clientY - this.startY) / x < 0.577) {
                this.wrapperClass.expand = true;
                this.wrapperClass.collapse = false;
                this.$nextTick(() => {
                    this.bindScroll(e);
                });
            }
        },
        /**
         * 点击 sidebar 阴影部分收起 sidebar
         *
         * @param {Event} e 原生点击事件
         */
        toggleClick(e) {
            this.status = false;
        },
        /**
         * 绑定 iscroll
         *
         * @param {Event} e 原生 touchmove 事件对象
         */
        bindScroll(e) {
            if (this.iscroll || !this.$refs.sidebarWrapper) {
                return;
            }
            // 初始化 iscroll
            this.iscroll = new IScroll(
                this.$refs.sidebarWrapper,
                {
                    eventPassthrough: true,
                    scrollY: false,
                    scrollX: true,
                    bounce: false,
                    startX: -this.width
                }
            );
            this.iscroll.on('scrollEnd', () => {
                let {directionX, x} = this.iscroll;
                // 完全展开的时候 showStatus 状态变为 true
                if (x >= 0) {
                    this.status = true;
                }
                // 完全收起的时候 showStatus 状态变为 false 同时解绑 iscroll
                else if (x <= -this.width) {
                    this.status = false;
                }
                // 滑到一半的情况 就根据其不同的滑动状态去补完剩余操作
                else if (directionX > 0) {
                    this.status = false;
                }
                else if (directionX < 0) {
                    this.status = true;
                }
                else {
                    this.status = !this.status;
                }
            });
            // 触发蒙层的透明度计算
            this.changeOpacity();
            // 将原生事件对象透传给 iscroll 使其在初始化完成后立马实现滚动
            e && this.iscroll._start(e);
        },
        /**
         * 展开侧边栏
         */
        expand() {
            this.wrapperClass.expand = true;
            this.wrapperClass.collapse = false;
            // 得等到 wrapper 的 class 改变生效，才能去做下一步的绑定操作
            // 故而用 nextTick
            this.$nextTick(() => {
                if (!this.iscroll) {
                    this.bindScroll();
                }
                if (this.iscroll) {
                    if (this.beside === 'left') {
                        // 部分机型在 iscroll 初始化完成后立即执行 scrollTo 会有问题
                        // 用 nextTick 无效
                        this.iscroll.x < 0
                        && setTimeout(() => this.iscroll && this.iscroll.scrollTo(0, 0, this.duration), 10);
                    }
                    else {
                        this.iscroll > 0
                        && setTimeout(() => this.iscroll && this.iscroll.scrollTo(0, 0, this,duration), 10);
                    }

                }
            });
        },
        /**
         * 收起侧边栏
         */
        collapse() {
            if (!this.iscroll) {
                return;
            }
            if (this.iscroll.x > -this.width) {
                // 解决部分机型在调用 scrollTo 完成的时候 不会触发 scrollEnd 事件的 bug
                setTimeout(this.iscroll.scrollTo.bind(this.iscroll, -this.width, 0, this.duration));
                // 滚动结束后解绑 iscroll
                setTimeout(this.unbindScroll.bind(this), this.duration + 10);
            }
            else {
                this.unbindScroll();
            }
        },
        /**
         * 解绑并销毁 iscroll
         */
        unbindScroll() {
            if (!this.iscroll) {
                return;
            }
            // 销毁 iscroll
            this.iscroll.destroy();
            this.iscroll = null;
            // 清除各项数值
            this.wrapperClass.expand = false;
            this.wrapperClass.collapse = true;
            this.scrollEnable = false;
            this.opacity = 0;
            // 去掉 iscroll 遗留下的 style
            this.$refs.sidebarScroller.setAttribute(
                'style',
                `padding-left:${this.widthProp}`
            );
        },
        /**
         * 触发 mask 的透明度改变
         */
        changeOpacity() {
            if (this.wrapperClass.expand && this.iscroll) {
                this.opacity = (this.iscroll.x + this.width) / this.width * 0.5;
                rAF(this.changeOpacity.bind(this));
            }
        }
    }
};
</script>
