<template>
  <client-only>
    <infinite-loading
      @infinite="onInfinite"
      ref="infiniteLoading"
      class="flex xs12"
    >
      <div slot="no-results"></div>
      <div slot="no-more"></div>
    </infinite-loading>
  </client-only>
</template>
<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: { InfiniteLoading },

  methods: {
    onInfinite($state) {
      this.$emit("load", $state);
    },
  },
};
</script>