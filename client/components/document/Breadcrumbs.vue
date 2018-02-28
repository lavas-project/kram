<template>
<v-breadcrumbs divider="/" class="wd-breadcrumbs">
    <v-breadcrumbs-item
        v-for="(item, i) in breadcrumb"
        :key="i"
    >
        {{ item.name }}
    </v-breadcrumbs-item>
</v-breadcrumbs>
</template>

<style lang="stylus">
@require '~@/assets/style/variable'

.wd-breadcrumbs.breadcrumbs
    justify-content flex-start
    padding-left 0
    padding-top 0
    padding-bottom 40px

    li
        .breadcrumbs__item
            color $colorBlack
            cursor default
        &:first-child
            .breadcrumbs__item
                padding-left 0
        &:last-child
            .breadcrumbs__item
                color #bdbdbd

@media screen and (max-width: 600px)
    .wd-breadcrumbs.breadcrumbs
        display none
</style>

<script>
import {isValidArray, traversal} from '@/assets/common/utils/basic';

export default {
    props: {
        menu: {
            type: Array
        },
        current: {
            type: String
        }
    },
    computed: {
        isValidMenu() {
            return isValidArray(this.menu);
        },
        breadcrumb() {
            if (!this.isValidMenu || !this.current) {
                return [];
            }

            return this.current.split('/')
                .map((str, i, arr) => arr.slice(0, i + 1).join('/'))
                .map(
                    key => traversal(
                        this.menu,
                        (obj, res, e) => {
                            if (obj.path === key) {
                                e.break = true;
                                return obj;
                            }
                        }
                    )
                )
                .filter(obj => obj != null);
        }
    }
};
</script>