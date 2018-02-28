<template>
    <div class="skeleton-wrapper">
        <header class="skeleton-header"></header>
        <section class="skeleton-block">
            <div id="boostrap-splash">
                <div id="boostrap-splash-bound-1"></div>
                <div id="boostrap-splash-bound-2"></div>
            </div>
        </section>
    </div>
</template>

<script>

export default {
    name: 'skeleton'
};
</script>

<style lang="stylus" scoped>

@import '~normalize.css';

.skeleton-wrapper
    position fixed
    top 0
    bottom 0
    width 100%

    .skeleton-header
        height 64px
        background #1976d2
        // box-shadow 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px rgba(0,0,0,.14), 0 1px 10px rgba(0,0,0,.12)

    .skeleton-block
        display flex
        flex-direction column
        padding-top 8px

#boostrap-splash
    width 120px
    height 120px
    position absolute
    top 50%
    left 50%
    margin -60px 0 0 -60px


#boostrap-splash-bound-1,
#boostrap-splash-bound-2
    width 100%
    height 100%
    border-radius 50%
    background-color #1976d2
    opacity 0.6
    position absolute
    top 0
    left 0
    animation boostrap-splash 2.0s infinite ease-in-out


#boostrap-splash-bound-2
    animation-delay -1.0s


@keyframes boostrap-splash
    0%,
    100%
        transform scale(0.0)

    50%
        transform scale(1.0)



@media screen and (max-width: 767px)
    .skeleton-wrapper
        .skeleton-header
            height 56px

</style>
