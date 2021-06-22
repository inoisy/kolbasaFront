<template>
    <v-skeleton-loader type="button"
                       height="36px"
                       :boilerplate="boilerplate"
    />
</template>

<script>
export default {
    props: {
        boilerplate: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
