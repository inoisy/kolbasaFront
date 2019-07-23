<template>
  <v-card
    :to="`/catalog/${category}/${product.slug}`"
    hover
    ripple
    class="fill-height d-flex column"
  >
    <div class="display-flex justify-center align-center pt-2 pb-3" style="min-height:150px">
      <img
        class="d-block ma-auto product-img"
        v-lazy="product.img ? imageBaseUrl + product.img.url : require('~/assets/no-image.png')"
      />
    </div>
    <v-card-text class="pt-1" style="flex-grow: 0 !important;">
      <h3 class="display-1 mb-0" style="line-height: normal !important;">{{product.name}}</h3>
    </v-card-text>
  </v-card>
</template>
<style lang="stylus" scoped>
.product-img {
  height: 150px;
  object-fit: contain;
}

@media (min-width: 600px) {
  .product-img {
    height: 180px;
  }
}

@media (min-width: 960px) {
  .product-img {
    height: 200px;
  }
}
</style>

<script>
export default {
  data() {
    return { imageBaseUrl: process.env.imageBaseUrl };
  },
  props: ["category", "product"]
};
</script>

