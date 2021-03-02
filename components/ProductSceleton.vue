<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <v-skeleton-loader
      class="mb-3"
      type="image"
      :boilerplate="boilerplate"
      height="150px"
    />
    <!--class="mb-3" <v-skeleton-loader type="chip" width="300px" :boilerplate="!loading" /> -->
    <v-skeleton-loader type="text" :boilerplate="boilerplate" />
    <v-skeleton-loader type="text" width="50%" :boilerplate="boilerplate" />
    <v-skeleton-loader type="text" width="30%" :boilerplate="boilerplate" />

    <v-skeleton-loader
      class="mt-auto"
      type="button"
      height="48px"
      width="100%"
      :boilerplate="boilerplate"
    />
    <!-- {{ loading }}, card-heading -->
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