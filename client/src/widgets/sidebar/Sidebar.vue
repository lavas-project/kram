<template>
<div class="wd-sidebar">
    <sidebar-mobile
        :media-query="mobileMediaQuery"
        v-model="status"
        :enable="mobileEnable"
        :duration="duration"
        :trigger-area="triggerArea"
    >
        <slot v-if="mobileEnable"></slot>
    </sidebar-mobile>
    <sidebar-pc
        ref="sidebarPC"
        :media-query="pcMediaQuery"
        :beside="beside"
        :enable="pcEnable"
    >
        <slot v-if="pcEnable"></slot>
    </sidebar-pc>
</div>
</template>

<style lang="stylus">
.wd-sidebar
    position absolute

@media screen and (max-width: 600px)
    .wd-sidebar
        .wd-sidebar-pc
            display none

@media screen and (min-width: 601px)
    .wd-sidebar
        .wd-sidebar-mobile
            display none
</style>

<script>
import {clientWidth} from '../../common/utils/dom';
import SidebarPC from './SidebarPC';
import SidebarMobile from './SidebarMobile';

const DEFAULT_PROP = 'default';

export default {
    name: 'sidebar',
    props: [
        'mediaQuery',
        'beside',
        'value',
        'duration',
        'triggerArea'
    ],
    data() {
        return {
            clientWidth: clientWidth(),
        };
    },
    computed: {
        isMobile() {
            return this.clientWidth < 600;
        },
        pcMediaQuery() {
            return this.mediaQuery.filter(
                ({maxWidth}) => maxWidth == null || maxWidth > 600
            );
        },
        mobileMediaQuery() {
            return this.mediaQuery.filter(
                ({minWidth}) => minWidth == null || minWidth <= 600
            );
        },
        status: {
            set(val) {
                this.$emit('input', val);
            },
            get() {
                return this.value;
            }
        },
        pcEnable() {
            return !this.isMobile;
        },
        mobileEnable() {
            return this.isMobile;
        }
    },
    beforeMount() {
        this.clientWidth = clientWidth();
    },
    methods: {
        update() {
            if (!this.isMobile && this.$refs.sidebarPC) {
                this.$refs.sidebarPC.update();
            }
        }
    },
    components: {
        'sidebar-pc': SidebarPC,
        'sidebar-mobile': SidebarMobile
    }
};
</script>