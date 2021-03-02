<template>
  <div style="display: flex; flex-wrap: wrap; margin-top: 25px">
    <div style="display: flex; width: 100%">
      <v-skeleton-loader
        class="mb-4"
        width="300px"
        height="38px"
        type="heading"
        :boilerplate="boilerplate"
      />
    </div>
    <v-skeleton-loader
      v-for="(item, index) in new Array(15)"
      :key="`sceleton-filters-${index}`"
      class="mr-2 mb-2"
      type="chip"
      :boilerplate="boilerplate"
    />
  </div>
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
