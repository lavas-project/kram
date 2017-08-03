<template>
    <v-snackbar class="wd-toast"
        :timeout="timeout"
        :bottom="bottom"
        :top="top"
        v-model="status"
    >{{ message }}</v-snackbar>
</template>

<style lang="stylus">
.wd-toast.snack
    border-radius 5px
    text-align center
    .snack__content
        border-radius 5px
        justify-content center
        min-width 200px

.wd-toast.snack--top
    top 8px

.wd-toast.snack--bottom
    bottom 100px

@media screen and (max-width: 600px)
    .wd-toast.snack
        width 80%
        left 50%
        transform translateX(-50%)
</style>

<script>
import {clientWidth} from '../common/utils/dom';

export default {
    name: 'toast',
    props: {
        timeout: {
            type: Number,
            default: 3000
        },
        message: {
            type: [String, Number, Boolean],
            default: ''
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            top: false,
            bottom: false,
            clientWidth: 320,
            onResize: () => {
                this.clientWidth = clientWidth();
            }
        };
    },
    computed: {
        isMobile() {
            return this.clientWidth <= 600;
        },
        status: {
            set(val) {
                this.$emit('input', val);
            },
            get() {
                return this.value;
            }
        }
    },
    watch: {
        status(val) {
            if (this.isMobile) {
                this.top = false;
                this.bottom = true;
            }
            else {
                this.top = true;
                this.bottom = false;
            }
        }
    },
    beforeMount() {
        this.clientWidth = clientWidth();
        window.addEventListener('resize', this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    }
};
</script>