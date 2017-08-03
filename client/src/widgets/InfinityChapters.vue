<template>
    <div class="wd-infinity-chapters">
        <div class="title"
            v-if="level == 0 && title !== false"
        >{{ title }}</div>
        <div v-for="item in menu">
            <div>
                <p @click.prevent.stop="select(item[props.key])"
                    :class="{active: active === item[props.key]}"
                >{{ item[props.name] }}</p>
                <div v-if="isValidArray(item.children)"
                    :class="'children-' + level"
                >
                    <infinity-chapters
                        :menu="item.children"
                        :level="level + 1"
                        :props="props"
                        :active="active"
                        @select="select"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="stylus">
    @require '../common/style/variable'

    .wd-infinity-chapters
        font-size 14px
        font-weight 500

        .title
            margin-bottom 10px
            line-height 1.5
            position relative

            &:before
                content: ''
                height 18px
                width 3px
                position absolute
                top 50%
                left -14px
                transform translateY(-50%)
                background $colorPrimaryBlue

        p
            display block
            padding 5px 0
            color #2c3e50
            font-weight 600
            position relative
            white-space normal

            &:hover
                cursor pointer
                color $colorPrimaryBlue !important

            &.active
                color $colorPrimaryBlue !important

        [class^="children-"]
            padding-left 14px

            .wd-infinity-chapters
                p
                    color $colorBlack
                    font-weight 500

        .children-0
            padding 0

</style>

<script>
    import {isValidArray} from '../common/utils/basic';

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
            title: {
                'type': [String, Number, Boolean],
                'default': '目录'
            },
            active: {
                'type': [String, Number]
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
        methods: {
            select(key) {
                this.$emit('select', key);
            }
        }
    };
</script>