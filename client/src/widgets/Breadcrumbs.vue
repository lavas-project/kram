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
@require '../common/style/variable'

.wd-breadcrumbs.breadcrumbs
    justify-content flex-start
    padding-left 50px
    padding-top 20px

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
import {isValidArray, traversal} from '../common/utils/basic';

export default {
    props: {
        catalog: {
            type: Array
        },
        docKey: {
            type: String
        }
    },
    computed: {
        isValidCatalog() {
            return isValidArray(this.catalog);
        },
        breadcrumb() {
            if (!this.isValidCatalog || !this.docKey) {
                return [];
            }

            return this.docKey.split('/')
                .map((str, i, arr) => arr.slice(0, i + 1).join('/'))
                .map(
                    key => traversal(
                        this.catalog,
                        (obj, res, e) => {
                            if (obj.key === key) {
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