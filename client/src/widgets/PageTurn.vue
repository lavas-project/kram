<template>
    <div class="page-turn">
        <div class="pre-article">
            <router-link v-if="!!pre" :to="pre.url">
                <i class="material-icons">arrow_back</i>
                {{ pre && pre.name || '' }}
            </router-link>
        </div>
        <div class="next-article">
            <router-link v-if="!!next" :to="next.url">
                {{ next && next.name || '' }}
                <i class="material-icons">arrow_forward</i>
            </router-link>
        </div>
    </div>
</template>

<style lang="stylus">
    @require '../common/style/variable'

    .page-turn
        font-size 15px
        width 100%
        overflow hidden
        margin-bottom 20px
        color $colorPrimaryBlue
        position relative
        & > div
            width 50%
            float left
            box-sizing border-box
            color $colorPrimaryBlue

            ellipsis()
            &:empty
                height 1px

            .material-icons
                position absolute
                top 50%
                transform translateY(-50%)

        a
            padding 0 5px
            color $colorPrimaryBlue
            line-height 1.2

            &:hover
                text-decoration underline

        .pre-article
            text-align left
            padding-left 74px

            .material-icons
                left 50px

        .next-article
            text-align right
            padding-right 74px

            .material-icons
                right 50px

    @media screen and (max-width: 600px)
        .page-turn
            font-size 14px
            a
                &:hover
                    text-decoration none

            .pre-article
                padding-left 44px

                .material-icons
                    left 20px

            .next-article
                padding-right 44px

                .material-icons
                    right 20px
</style>

<script>
    export default {
        name: 'page-turn',
        props: ['catalog', 'current'],
        computed: {
            pre() {
                let parent = getParent(this.current, this.catalog);

                if (!parent) {
                    return null;
                }

                let index = getIndex(this.current, parent.children || parent);

                if (index > 0) {
                    let pre = (parent.children || parent)[index - 1];

                    while (pre.children) {
                        pre = pre.children[pre.children.length - 1];
                    }

                    return pre;
                }

                while (parent) {
                    let currParent = getParent(parent.key, this.catalog);

                    if (!currParent) {
                        break;
                    }

                    let index = getIndex(parent.key, currParent.children || currParent);

                    if (index > 0) {
                        let pre = (currParent.children || currParent)[index - 1];

                        while (pre.children) {
                            pre = pre.children[pre.children.length - 1];
                        }

                        return pre;
                    }

                    parent = currParent;
                }

                return null;
            },
            next() {
                let parent = getParent(this.current, this.catalog);

                if (!parent) {
                    return null;
                }

                let index = getIndex(this.current, parent.children || parent);
                let list = parent.children || parent;

                if (index < (list.length - 1)) {
                    let next = list[index + 1];

                    while (next.children) {
                        next = next.children[0];
                    }

                    return next;
                }

                while (parent) {
                    let currParent = getParent(parent.key, this.catalog);

                    if (!currParent) {
                        break;
                    }

                    let list = currParent.children || currParent;
                    let index = getIndex(parent.key, list);

                    if (index < (list.length - 1)) {
                        let next = list[index + 1];

                        while (next.children) {
                            next = next.children[0];
                        }

                        return next;
                    }

                    parent = currParent;
                }

                return null;
            }
        }
    };

    function getParent(key, catalog) {
        let list;

        if (Array.isArray(catalog)) {
            list = catalog;
        }
        else if (catalog.children) {
            list = catalog.children;
        }

        if (getItem(key, list)) {
            return catalog;
        }

        for (let i = 0, max = list.length; i < max; i++) {
            if (list[i].children) {
                let childParent = getParent(key, list[i]);
                if (childParent) {
                    return childParent;
                }
            }
        }

        return null;
    }

    function getItem(key, list) {
        for (let i = 0, max = list.length; i < max; i++) {
            if (list[i].key === key) {
                return list[i];
            }
        }

        return null;
    }

    function getIndex(key, list) {
        for (let i = 0, max = list.length; i < max; i++) {
            if (list[i].key === key) {
                return i;
            }
        }

        return -1;
    }
</script>