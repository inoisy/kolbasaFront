<template>
    <v-img
        class="imageBackground"
        :class="fixed && 'fixed'"
        src="/images/bg.jpg"
        position="50% 0%"
        gradient="to left top, rgb(255 255 255 / 12%), rgb(255 255 255 / 50%)"
    />
</template>

<script>
export default {
    props: {
        fixed: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
    .imageBackground {
        ::v-deep > .v-image__image {
            background-color: #f0f0f0;
            background-repeat: repeat;
            background-size: 100% auto;
        }

        &.fixed {
            ::v-deep > .v-image__image {
                background-attachment: fixed;
            }
        }
    }
</style>
