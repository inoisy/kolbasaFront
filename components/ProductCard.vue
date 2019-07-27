<template>
  <v-card hover class="fill-height d-flex column pt-2">
    <!--  -->
    <div class="position-relative product-card-img-wrap">
      <img
        class="d-block ma-auto product-img"
        v-lazy="product.img ? imageBaseUrl + product.img.url : require('~/assets/no-image.png')"
      />
      <div style="position:absolute; right: 0;top: 0;">
        <v-btn flat icon color="primary" @click="removeFromBasket" v-show="busket">
          <v-icon>remove</v-icon>
        </v-btn>
        {{busket}}
        <v-btn flat icon color="primary" @click="addToBasket">
          <v-icon v-show="!busket">add_shopping_cart</v-icon>
          <v-icon v-show="busket">add</v-icon>
        </v-btn>
      </div>
    </div>
    <v-card-text class="pt-2">
      <div class="display-flex justify-space-between">
        <v-subheader
          class="pl-0 display-flex align-center"
          :class="product.price ? 'display-2 font-weight-medium black--text' : ''"
        >{{product.price ? product.price +'₽' : 'Цена по запросу'}}</v-subheader>
        <v-subheader
          class="align-center display-flex pa-0"
        >{{product.weight ? product.weight + 'кг' : ''}}</v-subheader>
      </div>

      <nuxt-link
        :to="`/catalog/${category}/${product.slug}`"
        class="mb-0"
        style="line-height: normal !important; font-size:1rem;font-weight: 600;"
      >{{product.name}}</nuxt-link>
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
  computed: {
    busket() {
      return this.$store.state.localStorage.basket[this.product.id]
        ? this.$store.state.localStorage.basket[this.product.id].count
        : null;
    }
  },
  methods: {
    async addToBasket(event) {
      await this.$store.commit("addToBasket", this.product);
    },
    async removeFromBasket(event) {
      await this.$store.commit("removeFromBasket", this.product);
    }
  },
  props: ["category", "product"]
};
</script>

