<template>
  <div
    style="
      color: rgba(255, 255, 255, 0.5);
      display: flex;

      justify-content: center;
    "
  >
    <!-- position: absolute;
      top: 24px;
      left: 0;
      right: 0; -->
    <v-skeleton-loader
      type="button"
      height="21px"
      width="64px"
      :boilerplate="boilerplate"
      dark
    />
    <span style="padding: 0 12px">/</span>
    <v-skeleton-loader
      type="button"
      height="21px"
      width="64px"
      :boilerplate="boilerplate"
      dark
    />
    <span style="padding: 0 12px">/</span>
    <v-skeleton-loader
      type="button"
      height="21px"
      width="64px"
      :boilerplate="boilerplate"
      dark
    />
  </div>
</template>

<script>
export default {
  props: {
    boilerplate: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style>
</style>