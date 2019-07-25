<template>
  <v-card
    :to="`/catalog/${category}/${product.slug}`"
    hover
    ripple
    class="fill-height d-flex column"
  >
    <div class="position-relative product-card-img-wrap">
      <img
        class="d-block ma-auto product-img"
        v-lazy="product.img ? imageBaseUrl + product.img.url : require('~/assets/no-image.png')"
      />
      <v-btn
        flat
        icon
        color="primary"
        style="position:absolute; right: 0;top: 0;"
        @click="addToBasket"
      >
        <v-icon>add_shopping_cart</v-icon>
      </v-btn>
    </div>
    <v-card-text class="pt-0">
      <div class="display-flex justify-space-between">
        <v-subheader
          class="pl-0 display-flex align-center"
          :class="product.price ? 'display-2 font-weight-medium black--text' : ''"
        >{{product.price ? product.price +'₽' : 'Цена по запросу'}}</v-subheader>
        <v-subheader
          class="align-center display-flex pa-0"
        >{{product.weight ? product.weight + 'кг' : ''}}</v-subheader>
      </div>

      <h3
        class="mb-0"
        style="line-height: normal !important; font-size:1rem;font-weight: 600;"
      >{{product.name}}</h3>
    </v-card-text>
  </v-card>
</template>
<style lang="stylus" scoped>
.product-card-img-wrap {
}

.product-img, .product-card-img-wrap {
  height: 120px;
  max-height: 120px;
}

.product-img {
  object-fit: contain;
}

@media (min-width: 600px) {
  .product-img, .product-card-img-wrap {
    height: 140px;
    max-height: 140px;
  }
}

@media (min-width: 960px) {
  .product-img, .product-card-img-wrap {
    height: 160px;
    max-height: 160px;
  }
}
</style>

<script>
export default {
  data() {
    return { imageBaseUrl: process.env.imageBaseUrl };
  },
  methods: {
    async addToBasket(event) {
      event.stopPropagation();
      await this.$store.commit("basket", this.product);
    }
  },
  props: ["category", "product"]
};
</script>

