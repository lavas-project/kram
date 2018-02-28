<template>
<div class="wd-sidebar">
    <sidebar-mobile
        v-model="status"
        :duration="duration"
        :trigger-area="triggerArea"
        :media-query="mediaQuery"
        v-if="isMobile"
    >
        <slot v-if="isMobile"></slot>
    </sidebar-mobile>
    <sidebar-pc v-if="!isMobile">
        <slot v-if="!isMobile"></slot>
    </sidebar-pc>
</div>
</template>

<style lang="stylus">
.wd-sidebar
    position absolute

@media screen and (max-width: 767px)
    .wd-sidebar
        .wd-sidebar-pc
            display none

@media screen and (min-width: 768px)
    .wd-sidebar
        .wd-sidebar-mobile
            display none

</style>

<script>
import {deviceWidth} from '@/assets/common/utils/dom';
import SidebarPC from './SidebarPC';
import SidebarMobile from './SidebarMobile';

const DEFAULT_PROP = 'default';

export default {
    name: 'sidebar',
    props: [
        'value',
        'duration',
        'triggerArea',
        'mediaQuery'
    ],
    data() {
        return {
            isMobile: false
        }
    },
    computed: {
        status: {
            set(val) {
                this.$emit('input', val);
            },
            get() {
                return this.value;
            }
        }
    },
    methods: {
        onResize() {
            this.isMobile = deviceWidth() < 768;
        }
    },
    mounted() {
        this.onResize();
        this.resize = this.onResize.bind(this);
        window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },
    components: {
        'sidebar-pc': SidebarPC,
        'sidebar-mobile': SidebarMobile
    }
};
</script>