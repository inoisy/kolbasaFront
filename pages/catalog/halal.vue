<template>
  <div></div>
</template>

<script>
export default {
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");
  }
};
</script>

<style>
</style>
