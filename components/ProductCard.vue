<template>
  <v-card
    :to="`/catalog/${category}/${product.slug}`"
    hover
    ripple
    class="fill-height d-flex column"
  >
    <div class="display-flex justify-center align-center px-2" style="min-height:150px">
      <img
        class="d-block ma-auto"
        v-lazy="product.img ? imageBaseUrl + product.img.url : require('~/assets/no-image.png')"
      />
    </div>
    <v-card-text class="pt-1" style="flex-grow: 0 !important;">
      <h3 class="display-1 mb-0" style="line-height: normal !important;">{{product.name}}</h3>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return { imageBaseUrl: process.env.imageBaseUrl };
  },
  props: ["category", "product"]
};
</script>

<style>
</style>
