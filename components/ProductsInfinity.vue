<template>
    <client-only>
        <infinite-loading
            ref="infiniteLoading"
            class="flex xs12"
            @infinite="onInfinite"
        >
            <div slot="no-results"></div>
            <div slot="no-more"></div>
        </infinite-loading>
    </client-only>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';

export default {
    components: { InfiniteLoading },

    methods: {
        onInfinite($state) {
            this.$emit('load', $state);
        },
    },
};
</script>
