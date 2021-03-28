<template>
  <div :class="$style.wrapper">
    <v-skeleton-loader
      :class="$style.img"
      class="mb-3"
      type="image"
      :boilerplate="boilerplate"
      height="150px"
    />
    <v-skeleton-loader type="text" :boilerplate="boilerplate" />
    <v-skeleton-loader type="text" width="50%" :boilerplate="boilerplate" />
    <v-skeleton-loader
      class="lastText"
      type="text"
      width="30%"
      :boilerplate="boilerplate"
    />

    <v-skeleton-loader
      :class="$style.btn"
      type="button"
      height="48px"
      width="100%"
      :boilerplate="boilerplate"
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
<style lang="scss" scoped>
.lastText {
  ::v-deep .v-skeleton-loader__text {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped module>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
  justify-content: space-between;
  .img {
    margin-bottom: var(--gap, 10px);
  }

  .btn {
    margin-top: var(--gap, 10px);
  }
}
</style>