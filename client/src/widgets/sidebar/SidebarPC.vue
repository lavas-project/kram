<template>
<div class="wd-sidebar-pc"
    :style="style"
    v-if="avaliable"
>
    <slot></slot>
</div>
</template>

<style lang="stylus">
@require '../../common/style/variable'

.wd-sidebar-pc
    position fixed
    overflow auto

</style>

<script>
import {
    getWithDefault
} from '../../common/utils/basic';
import {
    clientWidth,
    clientHeight,
    scrollTop,
    scrollHeight,
    getMediaQueryValue,
    toUnit,
    rAF
} from '../../common/utils/dom';

const DEFAULT_PROP = 'default';

export default {
    name: 'sidebar',
    props: {
        enable: {
            'type': Boolean,
            'default': true
        },
        mediaQuery: {
            'type': [Array, Object],
            [DEFAULT_PROP]() {
                return {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 300
                };
            }
        },
        beside: {
            'type': [String, Array],
            'default': 'bottom'
        }
    },
    data() {
        return {
            scrollTop: 0,
            clientWidth: 1366,
            clientHeight: 768,
            scrollHeight: 2048,
            onResize: () => {
                this.measure();
                this.updateScrollTop();
            },
            onScroll: () => {
                if (this.avaliable) {
                    rAF(this.updateScrollTop.bind(this));
                }
            }
        };
    },
    computed: {
        layout() {
            let clientWidth = this.clientWidth;
            let clientHeight = this.clientHeight;
            let val = getMediaQueryValue(this.mediaQuery, clientWidth);
            let {top, bottom, left, right, width, height} = val;

            return Object.assign({}, val, {
                top: getWithDefault(top, clientHeight - bottom - height),
                left: getWithDefault(left, clientWidth - right - width),
                right: getWithDefault(right, clientWidth - left - width),
                bottom: getWithDefault(bottom, clientHeight - top - height)
            });
        },
        avaliable() {
            return this.enable && this.layout.display !== 'none';
        },
        left() {
            return this.layout.left;
        },
        top() {
            if (this.beside.indexOf('top') === -1) {
                return this.layout.top;
            }

            let gap = this.layout.top - this.scrollTop;
            return Math.max(gap, 0);
        },
        bottom() {
            if (this.beside.indexOf('bottom') === -1) {
                return this.layout.bottom;
            }

            let gap = this.scrollTop + this.clientHeight
                - (this.scrollHeight - this.layout.bottom);
            return Math.max(gap, 0);
        },
        right() {
            return this.layout.right;
        },
        style() {
            return {
                top: toUnit(this.top),
                bottom: toUnit(this.bottom),
                left: toUnit(this.left),
                right: toUnit(this.right)
            };
        }
    },
    methods: {
        measure() {
            this.clientWidth = clientWidth();
            this.clientHeight = clientHeight();
            this.scrollHeight = scrollHeight();
        },
        updateScrollTop() {
            this.scrollTop = scrollTop();
        },
        update() {
            this.measure();
            this.updateScrollTop();
        }
    },
    beforeMount() {
        this.update();
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.onScroll);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScroll);
    }
};
</script>
