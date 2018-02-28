<template>
<div class="wd-sidebar-pc">
    <slot></slot>
</div>
</template>

<style lang="stylus">
.wd-sidebar-pc
    position fixed
    overflow auto

</style>

<script>
export default {
    name: 'sidebar-pc'
};
</script>
