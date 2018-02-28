<template>
    <div class="wd-infinity-chapters">
        <ul v-for="(item, i) in menu">
            <li @click.prevent.stop="select(item[props.key])"
                class="chapter-title"
                :class="{active: active === item[props.key]}"
                v-html="item[props.name]"
            ></li>
            <div v-if="isValidArray(item.children)"
                :class="'children-' + level"
            >
                <infinity-chapters
                    :menu="item.children"
                    :level="level + 1"
                    :props="props"
                    :active="active"
                    @select="select"
                    :parent-num="i + 1"
                />
            </div>
        </ul>
    </div>
</template>

<style lang="stylus">
    @require '~@/assets/style/variable'

    .wd-infinity-chapters
        font-size 14px
        font-weight 500

        .chapter-title
            display block
            padding 5px 0
            color $colorBlack
            // font-weight 500
            position relative
            white-space normal
            // font-weight 500

            &:hover
                cursor pointer
                color $colorPrimaryBlue !important

            &.active
                color $colorPrimaryBlue !important

        [class^="children-"]
            padding-left 28px

            // .wd-infinity-chapters
            //     p
            //         color $colorBlack
            //         font-weight 500

        .children-0
            .chapter-title
                font-weight 400

        .children-1
            .chapter-title
                font-weight 300
        //     padding 0

</style>

<script>
    import {isValidArray} from '@/assets/common/utils/basic';

    export default {
        name: 'infinity-chapters',
        props: {
            menu: {
                'type': Array
            },
            level: {
                'type': Number,
                'default': 0
            },
            active: {
                'type': [String, Number]
            },
            parentNum: {
                'type': [Number],
                'default': 0
            },
            props: {
                'type': Object,
                'default': () => ({name: 'name', key: 'key'})
            }
        },
        data() {
            return {
                isValidArray
            };
        },
        computed: {
            numberPrefix() {
                return this.parentNum ? `${this.parentNum}.` : '';
            }
        },
        methods: {
            select(key) {
                this.$emit('select', key);
            }
        }
    };
</script>