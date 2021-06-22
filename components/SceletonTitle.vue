<template>
    <div>
        <v-skeleton-loader
            v-if="noLoad || isLoading"
            width="400px"
            max-width="100%"
            height="38px"
            type="heading"
            :boilerplate="!isLoading"
        />
        <template v-else>
            <slot />
        </template>
    </div>
</template>

<script>
export default {
    props: {
        noLoad: {
            type: Boolean,
            default: false,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
